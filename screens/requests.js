import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { supabase } from '../supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { getCurrentUser } from '../services/userService';

export default function ShowContacts() {
  const [matchingProfiles, setMatchingProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]); // State for friend requests
  const [sentRequests, setSentRequests] = useState([]); // State for sent requests
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('received'); // State for tab selection
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRequests = async () => {
      const user = await getCurrentUser();
      if (!user) {
        console.error('Could not retrieve current user data.');
        return;
      }

      // Fetch received friend requests
      const { data: receivedData, error: receivedError } = await supabase
        .from('friendships')
        .select(`
          *,
          profiles!fk_user_id (
            first_name,
            last_name,
            username
          )
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      if (receivedError) {
        console.error('Error fetching received friend requests:', receivedError);
      } else {
        setFriendRequests(receivedData);
      }

      // Fetch sent friend requests
      const { data: sentData, error: sentError } = await supabase
        .from('friendships')
        .select(`
          *,
          profiles!fk_friend_id (
            first_name,
            last_name,
            username
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'pending');

      if (sentError) {
        console.error('Error fetching sent friend requests:', sentError);
      } else {
        setSentRequests(sentData);
      }

      setLoading(false);
    };

    fetchRequests();

    // Real-time subscription to changes in the 'friendships' table
    const subscription = supabase
      .channel('public:friendships')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'friendships' },
        (payload) => {
          console.log('Real-time change detected:', payload);
          fetchRequests(); // Refresh the friend requests when a change is detected
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = matchingProfiles.filter(profile =>
        profile.first_name.toLowerCase().includes(text.toLowerCase()) ||
        profile.last_name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(matchingProfiles);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    // Update the friendship status to "accepted"
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (error) {
      console.error('Error updating friendship status:', error);
    } else {
      // Refresh the friend requests list after the update
      const user = await getCurrentUser();
      if (user) {
        const { data: updatedReceivedData } = await supabase
          .from('friendships')
          .select(`
            *,
            profiles!fk_user_id (
              first_name,
              last_name,
              username
            )
          `)
          .eq('friend_id', user.id)
          .eq('status', 'pending');

        setFriendRequests(updatedReceivedData);
      }
    }
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.box}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends"
          value={searchText}
          onChangeText={handleSearch}
        />
        
        <Text style={styles.requestsText}>Requests ({friendRequests.length})</Text>

        <View style={styles.requestsTabsContainer}>
          <TouchableOpacity style={styles.requestTab} onPress={() => handleTabChange('received')}>
            <Text style={currentTab === 'received' ? styles.requestTabActive : styles.requestTabInactive}>Received</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.requestTab} onPress={() => handleTabChange('sent')}>
            <Text style={currentTab === 'sent' ? styles.requestTabActive : styles.requestTabInactive}>Sent</Text>
          </TouchableOpacity>
        </View>

        {/* Friend Requests Section */}
        <ScrollView style={styles.requestsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : currentTab === 'received' ? (
            friendRequests.length > 0 ? (
              friendRequests.map((request, index) => (
                <View key={index} style={styles.requestContainer}>
                  <Text style={styles.profileName}>{request.profiles.first_name} {request.profiles.last_name} {request.profiles.username}</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.statusButton}
                      onPress={() => handleAcceptRequest(request.id)}>
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noRequestsText}>No requests received at this time. Go add some friends!</Text>
            )
          ) : (
            sentRequests.length > 0 ? (
              sentRequests.map((request, index) => (
                <View key={index} style={styles.requestContainer}>
                  <Text style={styles.profileName}>{request.profiles.first_name} {request.profiles.last_name} {request.profiles.username}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noRequestsText}>No requests sent at this time. Go add some friends!</Text>
            )
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  box: {
    flex: 1,
    width: '90%',
    maxHeight: '80%', // Limit the height of the box
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginTop: 70, // Space from top of the screen
    alignSelf: 'center',
    justifyContent: 'flex-start',
  },
  searchInput: {
    height: 50,
    borderColor: '#EBF1F7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    placeholderTextColor: '#3D4353', 
  },
  requestsTabsContainer: {
    flexDirection: 'row',
    marginBottom: 5, // Adjust margin to bring tabs closer to the text
    paddingHorizontal: 0, // Align tabs to the left
  },
  requestTab: {
    paddingHorizontal: 15, // Adjust padding to space tabs
  },
  requestTabActive: {
    color: '#3B429F',
    fontWeight: 'bold',
  },
  requestTabInactive: {
    color: '#9E9E9E',
  },
  requestsText: {
    color: '#3D4353',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10, // Adjust margin to align with tabs
  },
  requestsContainer: {
    flexGrow: 1,
  },
  requestContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between', // Align items to the left and right
    alignItems: 'center',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D4353',
  },
  noRequestsText: {
    color: '#3B429F',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusButton: {
    backgroundColor: '#3B429F',
    borderRadius: 20, // Oval shape
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto', // Align button to the right
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});
