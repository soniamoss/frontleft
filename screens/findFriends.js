
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import { supabase } from '../supabaseClient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { addFriend } from '../services/friendshipService';
import { getCurrentUser } from '../services/userService';
import * as SMS from 'expo-sms';

export default function ShowContacts() {
  const [appContacts, setAppContacts] = useState([]);
  const [nonAppContacts, setNonAppContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [])
  );

  useEffect(() => {
    const subscription = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        payload => {
          console.log('Real-time change:', payload);
          fetchContacts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchContacts = async () => {
    const user = await getCurrentUser();

    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissions Denied', 'Access to contacts is required to find friends.');
      return;
    }

    const { data: deviceContacts } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    if (!deviceContacts.length) {
      Alert.alert('No Contacts Found', 'No contacts found on your device.');
      return;
    }

    const phoneNumbers = deviceContacts
      .flatMap(contact =>
        contact.phoneNumbers
          ? contact.phoneNumbers.map(phoneNumber =>
              phoneNumber.number.replace(/[+() -]/g, '').replace(/^\d{10}$/, '1$&')
            )
          : []
      )
      .filter(Boolean);

    const { data: profiles, error: profilesError } = await supabase.rpc(
      'get_profiles_by_phonenumbers',
      {
        phone_numbers: phoneNumbers,
      }
    );

    if (profilesError) {
      console.error(profilesError);
    } else {
      console.log('profiles', profiles);
    }

    const { data: friendshipIds, error: friendshipError } = await supabase
      .from('friendships')
      .select('friend_id, user_id')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    if (friendshipError) {
      console.error('Error fetching friendship IDs:', friendshipError);
    } else {
      console.log('friendshipIds:', friendshipIds);
    }

    const idsToExclude = friendshipIds.flatMap(friendship => [
      friendship.friend_id,
      friendship.user_id,
    ]);

    const filteredProfiles = profiles.filter(
      profile => !idsToExclude.includes(profile.user_id) && profile.user_id !== user.id
    );

    setAppContacts(filteredProfiles);
    setFilteredProfiles(filteredProfiles);

    const nonAppContactsSample = deviceContacts.slice(0, 10).map(contact => ({
      id: contact.id,
      first_name: contact.name,
      phone_number: contact.phoneNumbers ? contact.phoneNumbers[0].number : '',
    }));

    setNonAppContacts(nonAppContactsSample);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = appContacts.filter(profile =>
        profile.first_name.toLowerCase().includes(text.toLowerCase()) ||
        profile.last_name.toLowerCase().includes(text.toLowerCase()) ||
        profile.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(appContacts);
    }
  };

  const handleAddFriend = async (friendID) => {
    const user = await getCurrentUser();
    const result = await addFriend(user.id, friendID);
    if (result.success) {
      Alert.alert('Success', 'Friend request sent successfully!');
      fetchContacts();
    } else {
      Alert.alert('Error', result.message || 'Failed to send friend request.');
    }
  };

  const handleInvite = async (contact) => {
    const message = `Hi ${contact.first_name}, I invite you to join our app! Click the link to download: [Your App Link]`;
    console.log("set up the app link");
  
    const { result } = await SMS.sendSMSAsync(
      [contact.phone_number],
      message
    );
  
    if (result === 'sent') {
      console.log('Invite sent to:', contact.first_name, contact.phone_number);
      Alert.alert('Invite Sent', `An invite has been sent to ${contact.first_name}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.box}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Add or search friends"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.text}>Find Friends</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* App Contacts Section */}
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile, index) => (
              <View key={index} style={styles.profileContainer}>
                <Image
                  source={{ uri: profile.profile_image_url || 'https://via.placeholder.com/50' }}
                  style={styles.profilePicture}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{profile.first_name} {profile.last_name}</Text>
                  <Text style={styles.profileUsername}>{profile.username}</Text>
                </View>
                <TouchableOpacity style={styles.buttonAdd} onPress={() => handleAddFriend(profile.user_id)}>
                  <Text style={styles.buttonTextAdd}>Add</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noProfilesText}>No matching profiles found</Text>
          )}

          {/* Non-App Contacts Section */}
          <View style={styles.nonAppContactsContainer}>
            <Text style={styles.sectionTitle}>Invite Contacts</Text>
            {nonAppContacts.map((contact, index) => (
              <View key={index} style={styles.profileContainer}>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{contact.first_name}</Text>
                  <Text style={styles.profileUsername}>{contact.phone_number}</Text>
                </View>
                <TouchableOpacity style={styles.inviteButton} onPress={() => handleInvite(contact)}>
                  <Text style={styles.inviteButtonText}>Invite</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
  searchContainer: {
    marginBottom: 10,
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  text: {
    color: '#3D4353',
    fontSize: 24,
    fontWeight: '700',
  },
  scrollView: {
    flexGrow: 1,
  },
  profileContainer: {
    marginVertical: 5,
    padding: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    left: 0,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 60,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileUsername: {
    fontSize: 15,
    fontWeight: '400',
  },
  buttonAdd: {
    width: '34%',
    paddingVertical: 12,
    backgroundColor: '#3F407C',
    borderRadius: 26,
    alignItems: 'center',
    marginTop: 8,
    left: 20,
  },
  buttonTextAdd: {
    color: '#FFFF',
    fontSize: 15,
    fontWeight: '400',
  },
  inviteButton: {
    backgroundColor: '#fff',
    borderColor:'#3F407C',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  inviteButtonText: {
    color: '#3F407C',
    fontSize: 14,
    fontWeight: '600',
  },
  nonAppContactsContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#3D4353',
  },
  noProfilesText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
});
