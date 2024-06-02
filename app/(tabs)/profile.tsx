import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface ProfileData {
  profilePicture: string;
  name: string;
  username: string;
  numOfFriends: number;
}

const ProfilePage: React.FC = () => {
  const profileData: ProfileData = {
    profilePicture: 'https://example.com/profile.jpg',
    name: 'Faryar Jon',
    username: '@Faryar',
    numOfFriends: 123,
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <Image source={{ uri: profileData.profilePicture }} style={styles.profilePicture} />

      {/* Profile Details */}
      <View style={styles.profileDetails}>
        {/* Name */}
        <Text style={styles.name}>{profileData.name}</Text>

        {/* Username */}
        <Text style={styles.username}>{profileData.username}</Text>

        {/* Number of Friends */}
        <Text style={styles.numOfFriends}>Friends: {profileData.numOfFriends}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    //alignItems: 'center',
    paddingHorizontal: 80,
    paddingVertical: 160,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileDetails: {
    flex: 1,
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
});

export default ProfilePage;
