import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProfilePage = () => {
  const navigation = useNavigation();

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
        <View style={styles.buttonContainer} >
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style= {styles.text}> Name</Text>
      <Text style= {styles.textsmaller}> Where events and friends meet</Text>
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
    paddingVertical: 35,
    paddingHorizontal: 100,
    backgroundColor: '#FFFF',
    borderRadius: 5,
    alignItems: 'flex-start',
    justifyContent: 'left', // Ensure text is centered vertically
    marginBottom: 20, // Add this line to create space between buttons
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold', 
    fontFamily:'Chicle',
    color:'#3F407C',
    bottom: 18,
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
    fontFamily:'Chicle',
    color:'#3F407C',
    bottom: 18,
  },
  textsmaller: {
    fontSize:16 ,
    fontWeight: 'bold', 
    fontFamily:'Chicle',
    color:'#3F407C',
    bottom: 24,
  },
});

export default ProfilePage;
