
import React from 'react';
import FriendsTabScreen from '../findFriends';
import FriendsListTabScreen from '../friendList';
import RequestTabScreen from '../requests';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';

const FriendsTopTab = createMaterialTopTabNavigator();

const FriendsTab = () => (
  <FriendsTopTab.Navigator
    screenOptions={{
      swipeEnabled: true, // Enable swipe gestures
      tabBarStyle: styles.tabBar, // Apply tabBar styles
      tabBarIndicatorStyle: styles.tabBarIndicator, // Apply tabBarIndicator styles
      tabBarLabelStyle: styles.tabBarLabel,
    }}
  >
    <FriendsTopTab.Screen name="Find Friends" component={FriendsTabScreen} />
    <FriendsTopTab.Screen name="Friends List" component={FriendsListTabScreen} />
    <FriendsTopTab.Screen name="Requests" component={RequestTabScreen} />
  </FriendsTopTab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent', // Transparent background
    elevation: 0, // Remove shadow for Android
    shadowOpacity: 0, // Remove shadow for iOS
    borderBottomWidth: 0, // Remove border
    paddingTop: 38, // Adjust this value to move the tab bar lower or higher
  },
  tabBarIndicator: {
    backgroundColor: '#000', // Adjust indicator color if needed
  },
  tabBarLabel: {
    color: '#9CA9B7', // Set the color of the tab names
    fontSize: 13, // Set the font size
    fontWeight: '700', // Set the font weight
    fontFamily: 'poppins',
    textTransform: 'none',
  },

});

export default FriendsTab;
