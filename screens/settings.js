
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
    profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEXk5ueutLepsLPo6uursbXJzc/p6+zj5ea2u76orrKvtbi0ubzZ3N3O0dPAxcfg4uPMz9HU19i8wcPDx8qKXtGiAAAFTElEQVR4nO2d3XqzIAyAhUD916L3f6+f1m7tVvtNINFg8x5tZ32fQAIoMcsEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQTghAJD1jWtnXJPP/54IgNzZQulSmxvTH6oYXX4WS+ivhTbqBa1r26cvCdCu6i0YXbdZ0o4A1rzV+5IcE3YE+z58T45lqo7g1Aa/JY5tgoqQF3qb382x7lNzBLcxft+O17QUYfQI4IIeklKsPSN4i6LKj/7Zm8n99RbHJpEw9gEBXNBpKIYLJqKYRwjOikf//r+J8ZsVuacbqCMNleI9TqGLGqMzhnVdBOdd6F/RlrFijiCoVMk320CBIahUxTWI0KKEcJqKbMdpdJb5QvdHq6wCI5qhKlgGMS/RBHkubWDAE+QZxB4xhCyDiDkLZxgGEVdQldzSKbTIhmZkFkSEPcVvmBn2SMuZB9od7fQDsMiDdKJjFUSCQarM5WirZ3C2TT/htYnyPcPfgrFHWz0BI74gr6J/IZiGUxAZGQLqmvQLTrtE/Go4YxhVRIpEw+sww1IIcqr5NKmUUzLF3d4/qPkYIp2T/obPuemlojFUR4t9Q2Vojhb7BmgElWHzLPH8hucfpefPNFTVgs9h1AdU/Pin96vwWbWdf+X9Absn3OdO34aMdsDnP8WgKYisTqI6CkNGqZQo1XA6Ef6AU32SJzOcBukHPF07/xNSgmHKa5BOhtezv6mA/rYJpwXNAnbRZ1XuF3BzDcO3vpA3+ny2909gbqE4hhD3LIPhLLyBNhPZvbZ3B+3tPYa18A7auSlXQayKwTPNLKDcuOB0xPYKDPFTkWsevQPRZ1J8Hji9I1KQ34r7hZhrwNwOZ97QxNx0drwn4QI0wQk1DcEsfKCWKdxVvxPSNUIp/knmAXT+nT+Ko3+0H96rcNb3m1fx7MBTJdeBJ7uFcWsc0wvgAsC4pROW0l2inbAmIBv/7GZmuhQH6API2rr8T0e6yuZJ+80A9LZeG62T3tik31XwxtwZcizKuTHkMjB1WdZde4Kmic/A5ZI3rr1ae21d08PlVHYfAaxw9G9CYRbJ+8ZdbTcMRV1XM3VdF0M32vtoTdZ0+u29s0OttJ5bz64UwinjaFMVY9vkqc3KKSxN21Xl+0L4Q3Vuv1tYl0pqnX6ms4XetFz7gdZVAgUEoJntfOUe4ZwsHd9FzqQ3Vv6xe41l0XJcqcKl6TZvlv7ClAW3BsqQW4X7ypApB8dmTgK4IX5wvqIVj33HtD2qSG4BqznxdIefL27Y4sahi0MdIdvUsDva8agGGbCtITmCY31MHD2O0uIdh/0rJDQ1VX5Zdxz3rR2QDbv6qXl9vudzqQtGm1Jv9LDXOsfvvB7VcZ8PDKD0mQ1VHPYQ9O+Yj4hR1IUD8rBnn3ho2m8oQMxbCFiKlL2ioSW5heeJqegED52CzxCtcGD3Kv8Wms9EYLyUhwaFIhSMBClevWEmiK/Iaogu4H7sg6ppQhQG8RUqivuTGOAJOg6FfgW0q0M0PQMRMEgXaeNf3SYDZ8PIMI0+wHgr/MgN7wYwpiLjCCqM6ydUDZLQiB6nDdNC8SDyig3jPPpFXGcC9O8BUBDVmgBY59E7Md/35Loe/UVEECEJwYggJjELZ4J71SaQSBeC02n4Da29CayJNA28SAhd2CQyC1Xw6pSmGSINQVuMhAZp4DClan9MgmkDDNmezqwS8sgtlXK/EPBhoaSmYVC/F7IO1jQEdHOlabpKh3+jzLQSTUiq4X2I+Ip/zU8rlaqAvkS21ElR+gqu3zbjjL+hIAiCIAiCIAiCIAiCsCf/AKrfVhSbvA+DAAAAAElFTkSuQmCC',
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
    right:110,
    top:90,
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

