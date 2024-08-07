
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProfilePage = () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const profileData = {
    profilePicture: 'https://example.com/profile.jpg',
    name: 'Faryar Jon',
    username: '@Faryar',
    numOfFriends: 123,
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Box */}
      <View style={styles.box} />

      {/* Profile Details */}
      <View style={styles.profileDetails}>
        {/* Profile Picture */}
        <Image source={{ uri: profileData.profilePicture }} style={styles.profilePicture} />
        
        {/* Name */}
        <Text style={styles.name}>{profileData.name}</Text>

        {/* Username */}
        <Text style={styles.username}>{profileData.username}</Text>

        {/* Number of Friends */}
        <Text style={styles.numOfFriends}>{profileData.numOfFriends} friends</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Notifications</Text>
            <Image source={require('../assets/images/bell.png')} style={styles.imageBell} />

            <Switch 
              trackColor={{ false: '#808080', true: '#3F407C' }}
              thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Privacy</Text>
          <Image source={require('../assets/images/shield2.png')} style={styles.imageShield} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Contact Us</Text>
          <Image source={require('../assets/images/postcard2.png')} style={styles.imagePostcard} />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}> Name</Text>
      <Text style={styles.textsmaller}> Where events and friends meet</Text>
      <TouchableOpacity style={styles.buttonLog}>
        <Text style={styles.buttonTextLog}>Log Out </Text>
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
    position: 'absolute',
    top: 44, 
    alignItems: 'left',
    right:140,
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
  box: {
    width: '96%',
    height: 140,
    backgroundColor: '#ffff',
    borderRadius: 20,
    marginTop: 80, 
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1, // Ensure the button is above the image
  },
  button: {
    marginHorizontal: 8,
    paddingVertical: 30,
    paddingHorizontal: 60,
    backgroundColor: '#FFFF',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'flex-start', // Center text and switch horizontally
    flexDirection: 'row', // Align text and switch horizontally
    marginBottom: 20, // Add this line to create space between buttons
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center', // Center align text and switch vertically
    width: '100%',
    justifyContent: 'space-between', // Space between text and switch
    paddingLeft: 6,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold', 
    fontFamily: 'Chicle',
    color: '#3F407C',
  },
  buttonLog: {
    position: 'absolute',
    bottom: 10,
    width: '30%',
    paddingVertical: 15,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  buttonTextLog: {
    color: '#DF5A76',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  text: {
    fontSize: 80,
    fontWeight: 'bold', 
    fontFamily: 'Chicle',
    color: '#3F407C',
    bottom: 2,
  },
  textsmaller: {
    fontSize: 16,
    fontWeight: 'bold', 
    fontFamily: 'Chicle',
    color: '#3F407C',
    bottom: 14,
  },
  imageBell:{
    position: 'absolute',
    top: 4,
    right: 248,
  },
  imageShield:{
    position: 'absolute',
    top: 32,
    right: 312,
  },
  imagePostcard:{
    position: 'absolute',
    top: 30,
    right: 310,
  }
});

export default ProfilePage;

