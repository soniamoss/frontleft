import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabaseClient';
import { getCurrentUser } from '../services/userService';

const ProfilePage = () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [profileData, setProfileData] = useState({
    profilePicture: '',
    firstName: '',
    lastName: '',
    username: '',
    numOfFriends: 0,
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const user = await getCurrentUser();
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('profile_image_url, first_name, last_name, username')
        .eq('user_id', user.id)
        .single();

      const { data: friendsCount, error: friendsError } = await supabase
        .from('friendships')
        .select('*', { count: 'exact' })
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (error || friendsError) throw error || friendsError;

      setProfileData({
        profilePicture: profile.profile_image_url,
        firstName: profile.first_name,
        lastName: profile.last_name,
        username: profile.username,
        numOfFriends: friendsCount.length || 0,
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleProfileEdit = () => {
    navigation.navigate('ProfileEdit'); // Navigate to the profile edit page
  };

  const handlePrivacySettings = () => {
    navigation.navigate('PrivacySettings'); // Navigate to the privacy settings page
  };

  const handleContactUs = () => {
    const email = 'faryar48@gmail.com';
    const subject = '[App Name]: I have a question...';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailtoUrl);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Profile Details */}
      <TouchableOpacity style={styles.profileDetails} onPress={handleProfileEdit}>
        <Image source={{ uri: profileData.profilePicture }} style={styles.profilePicture} />
        <View style={styles.profileTextContainer}>
          <Text style={styles.name}>{`${profileData.firstName} ${profileData.lastName}`}</Text>
          <Text style={styles.username}>{profileData.username}</Text>
          <Text style={styles.numOfFriends}>{profileData.numOfFriends} friends</Text>
        </View>
      </TouchableOpacity>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePrivacySettings}>
          <Text style={styles.buttonText}>Privacy</Text>
          <Ionicons name="shield" size={24} color="#3F407C" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleContactUs}>
          <Text style={styles.buttonText}>Contact Us</Text>
          <Ionicons name="mail" size={24} color="#3F407C" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.text}>Name</Text>
      <Text style={styles.textsmaller}>Where events and friends meet</Text>

      <TouchableOpacity style={styles.buttonLog} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.buttonTextLog}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  profileTextContainer: {
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 18,
    color: '#666',
  },
  numOfFriends: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 18,
    color: '#3F407C',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Chicle',
    color: '#3F407C',
    marginBottom: 5,
  },
  textsmaller: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Chicle',
    color: '#3F407C',
    marginBottom: 10,
  },
  buttonLog: {
    position: 'absolute',
    bottom: 20,
    paddingVertical: 15,
  },
  buttonTextLog: {
    color: '#DF5A76',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
});

export default ProfilePage;
