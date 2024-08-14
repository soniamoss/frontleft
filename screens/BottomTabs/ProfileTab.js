
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfilePage = () => {
  const [currentTab, setCurrentTab] = useState('going'); // State for tab selection
  const navigation = useNavigation();

  const profileData = {
    profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEXk5ueutLepsLPo6uursbXJzc/p6+zj5ea2u76orrKvtbi0ubzZ3N3O0dPAxcfg4uPMz9HU19i8wcPDx8qKXtGiAAAFTElEQVR4nO2d3XqzIAyAhUD916L3f6+f1m7tVvtNINFg8x5tZ32fQAIoMcsEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQTghAJD1jWtnXJPP/54IgNzZQulSmxvTH6oYXX4WS+ivhTbqBa1r26cvCdCu6i0YXbdZ0o4A1rzV+5IcE3YE+z58T45lqo7g1Aa/JY5tgoqQF3qb382x7lNzBLcxft+O17QUYfQI4IIeklKsPSN4i6LKj/7Zm8n99RbHJpEw9gEBXNBpKIYLJqKYRwjOikf//r+J8ZsVuacbqCMNleI9TqGLGqMzhnVdBOdd6F/RlrFijiCoVMk320CBIahUxTWI0KKEcJqKbMdpdJb5QvdHq6wCI5qhKlgGMS/RBHkubWDAE+QZxB4xhCyDiDkLZxgGEVdQldzSKbTIhmZkFkSEPcVvmBn2SMuZB9od7fQDsMiDdKJjFUSCQarM5WirZ3C2TT/htYnyPcPfgrFHWz0BI74gr6J/IZiGUxAZGQLqmvQLTrtE/Go4YxhVRIpEw+sww1IIcqr5NKmUUzLF3d4/qPkYIp2T/obPuemlojFUR4t9Q2Vojhb7BmgElWHzLPH8hucfpefPNFTVgs9h1AdU/Pin96vwWbWdf+X9Absn3OdO34aMdsDnP8WgKYisTqI6CkNGqZQo1XA6Ef6AU32SJzOcBukHPF07/xNSgmHKa5BOhtezv6mA/rYJpwXNAnbRZ1XuF3BzDcO3vpA3+ny2909gbqE4hhD3LIPhLLyBNhPZvbZ3B+3tPYa18A7auSlXQayKwTPNLKDcuOB0xPYKDPFTkWsevQPRZ1J8Hji9I1KQ34r7hZhrwNwOZ97QxNx0drwn4QI0wQk1DcEsfKCWKdxVvxPSNUIp/knmAXT+nT+Ko3+0H96rcNb3m1fx7MBTJdeBJ7uFcWsc0wvgAsC4pROW0l2inbAmIBv/7GZmuhQH6API2rr8T0e6yuZJ+80A9LZeG62T3tik31XwxtwZcizKuTHkMjB1WdZde4Kmic/A5ZI3rr1ae21d08PlVHYfAaxw9G9CYRbJ+8ZdbTcMRV1XM3VdF0M32vtoTdZ0+u29s0OttJ5bz64UwinjaFMVY9vkqc3KKSxN21Xl+0L4Q3Vuv1tYl0pqnX6ms4XetFz7gdZVAgUEoJntfOUe4ZwsHd9FzqQ3Vv6xe41l0XJcqcKl6TZvlv7ClAW3BsqQW4X7ypApB8dmTgK4IX5wvqIVj33HtD2qSG4BqznxdIefL27Y4sahi0MdIdvUsDva8agGGbCtITmCY31MHD2O0uIdh/0rJDQ1VX5Zdxz3rR2QDbv6qXl9vudzqQtGm1Jv9LDXOsfvvB7VcZ8PDKD0mQ1VHPYQ9O+Yj4hR1IUD8rBnn3ho2m8oQMxbCFiKlL2ioSW5heeJqegED52CzxCtcGD3Kv8Wms9EYLyUhwaFIhSMBClevWEmiK/Iaogu4H7sg6ppQhQG8RUqivuTGOAJOg6FfgW0q0M0PQMRMEgXaeNf3SYDZ8PIMI0+wHgr/MgN7wYwpiLjCCqM6ydUDZLQiB6nDdNC8SDyig3jPPpFXGcC9O8BUBDVmgBY59E7Md/35Loe/UVEECEJwYggJjELZ4J71SaQSBeC02n4Da29CayJNA28SAhd2CQyC1Xw6pSmGSINQVuMhAZp4DClan9MgmkDDNmezqwS8sgtlXK/EPBhoaSmYVC/F7IO1jQEdHOlabpKh3+jzLQSTUiq4X2I+Ip/zU8rlaqAvkS21ElR+gqu3zbjjL+hIAiCIAiCIAiCIAiCsCf/AKrfVhSbvA+DAAAAAElFTkSuQmCC',
    name: 'Faryar Jon',
    username: '@Faryar',
    numOfFriends: 123,
  };

  const handleSettings = () => {
    navigation.navigate('settings');
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.image} onPress={handleSettings}>
        <Image source={require('@/assets/images/settings.png')} />
      </TouchableOpacity>
      
      {/* Box */}
      <View style={styles.box} />

      {/* Profile Details */}
      <View style={styles.profileDetails}>
        <Image source={{ uri: profileData.profilePicture }} style={styles.profilePicture} />
        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.username}>{profileData.username}</Text>
        <Text style={styles.numOfFriends}>{profileData.numOfFriends} friends</Text>
      </View>

      {/* Tabs */}
      <View style={styles.eventsTabsContainer}>
        <TouchableOpacity style={styles.eventTab} onPress={() => handleTabChange('going')}>
          <Text style={currentTab === 'going' ? styles.eventTabActive : styles.eventsTabInactive}>Going</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.eventTab} onPress={() => handleTabChange('interested')}>
          <Text style={currentTab === 'interested' ? styles.eventTabActive : styles.eventsTabInactive}>Interested</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.eventTab} onPress={() => handleTabChange('extraTickets')}>
          <Text style={currentTab === 'extraTickets' ? styles.eventTabActive : styles.eventsTabInactive}>Extra Tickets</Text>
        </TouchableOpacity> */}
      </View>

      {/* Events Section */}
      <ScrollView style={styles.eventsContainer}>
        {currentTab === 'going' ? (
          // Render "Going" content here
          <Text style={styles.noEventsText}>No events you're going to at this time.</Text>
        ) : currentTab === 'interested' ? (
          // Render "Interested" content here
          <Text style={styles.noEventsText}>No events you're interested in at this time.</Text>
        ) : currentTab === 'extraTickets' ? (
          // Render "Extra Tickets" content here
          <Text style={styles.noEventsText}>No events with extra tickets at this time.</Text>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </ScrollView>

      
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
    top:94,
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
  eventsTabsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  eventTab: {
    paddingHorizontal: 40,
    paddingVertical:40,
  },
  eventTabActive: {
    color: '#3B429F',
    fontWeight: '700',
    fontSize:14,
  },
  eventsTabInactive: {
    color: '#9E9E9E',
    fontWeight: '700',
    fontSize:14,

  },
  eventsContainer: {
    flexGrow: 1,
    width: '100%',
  },
  noEventsText: {
    color: '#3B429F',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusButton: {
    backgroundColor: '#3B429F',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
});

export default ProfilePage;

