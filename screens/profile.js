import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfilePage = () => {
  const navigation = useNavigation();

  const profileData = {
    profilePicture: 'https://example.com/profile.jpg',
    name: 'Faryar Jon',
    username: '@Faryar',
    numOfFriends: 123,
  };

  const handleSettings = () => {
    navigation.navigate('settings');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.image} onPress={handleSettings}>
        <Image source={require('@/assets/images/settings.png')} />
      </TouchableOpacity>

      {/* Profile Picture */}
      <Image source={{ uri: profileData.profilePicture }} style={styles.profilePicture} />

      {/* Profile Details */}
      <View style={styles.profileDetails}>
        {/* Name */}
        <Text style={styles.name}>{profileData.name}</Text>

        {/* Username */}
        <Text style={styles.username}>{profileData.username}</Text>

        {/* Number of Friends */}
        <Text style={styles.numOfFriends}>{profileData.numOfFriends} friends</Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Going</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Interested</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Extra Tickets</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },
  profileDetails: {
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderRadius: 5,
    alignItems: 'center',
    top: 60,
    right: 10,
  },
  buttonText: {
    color: '#9CA9B7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
});

export default ProfilePage;
