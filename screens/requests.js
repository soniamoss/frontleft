import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { supabase } from '../supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { getCurrentUser } from '../services/userService';
import { validate as isValidUUID, version as getUUIDVersion } from 'uuid';




export default function ShowContacts() {
  const [matchingProfiles, setMatchingProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]); // State for friend requests
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const user = await getCurrentUser();
      if (!user) {
        console.error('Could not retrieve current user data.');
        return;
      }

      const { data, error } = await supabase
        .from('friendships')
        .select('id, user_id, friend_id, status')
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      

      if (error) {
        console.error('Error fetching friend requests:', error);
      } else {
        
        setFriendRequests(data);
      }
      setLoading(false);
    };

    fetchFriendRequests();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

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

  const handleNext = () => {
    navigation.navigate('Notifications');
  };

  const handleAddProfile = (profile) => {
    console.log('Add profile:', profile);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>

        {/* Box */}
        <View style={styles.box}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends"
            value={searchText}
            onChangeText={handleSearch}
          />

          <View style={styles.headerContainer}>
            <Text style={styles.requestsText}>Requests ({friendRequests.length})</Text>
            <View style={styles.requestsTabsContainer}>
              <TouchableOpacity style={styles.requestTab}>
                <Text style={styles.requestTabActive}>Received</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.requestTab}>
                <Text style={styles.requestTabInactive}>Sent</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Friend Requests Section */}
          <ScrollView style={styles.requestsContainer}>
            {friendRequests.length > 0 ? (
              friendRequests.map((request, index) => (
                <View key={index} style={styles.requestContainer}>
                  <Text style={styles.profileName}>Friend Request from User ID: {request.user_id}</Text>
                  <Text style={styles.profileUsername}>Status: {request.status}</Text>
                  {/* Add buttons for Accept/Reject or other actions if needed */}
                </View>
              ))
            ) : (
              <Text style={styles.noRequestsText}>No requests at this time. Go add some friends!</Text>
            )}
          </ScrollView>
        </View>

        {/* Navigation */}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9F9F9',
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabText: {
    color: '#9E9E9E',
    fontSize: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B429F',
  },
  activeTabText: {
    color: '#3B429F',
    fontWeight: 'bold',
  },
  box: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 10,
    marginHorizontal: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  requestsText: {
    color: '#3D4353',
    fontSize: 18,
    fontWeight: '700',
  },
  requestsTabsContainer: {
    flexDirection: 'row',
  },
  requestTab: {
    paddingHorizontal: 10,
  },
  requestTabActive: {
    color: '#3B429F',
    fontWeight: 'bold',
  },
  requestTabInactive: {
    color: '#9E9E9E',
  },
  requestsContainer: {
    flexGrow: 1,
  },
  requestContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D4353',
  },
  profileUsername: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  noRequestsText: {
    color: '#3B429F',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  navigationItem: {
    paddingVertical: 10,
  },
  navigationText: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  activeNavigationText: {
    color: '#3B429F',
    fontWeight: 'bold',
  },
});
