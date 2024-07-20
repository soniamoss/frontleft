// index.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IntroScreen from '../../screens/intro';

import Home from '../../screens/Home';
import HomeTab from '../screens/BottomTabs/HomeTab';
import FriendsTab from '../screens/BottomTabs/FriendsTab';
import ProfileTab from '../screens/BottomTabs/ProfileTab';




import { registerRootComponent } from 'expo';
import { supabase } from '../../supabaseClient';
import PhoneLoginScreen from '../../screens/PhoneLogin';
import FirstNameScreen from '../../screens/firstname';
import LastNameScreen from '../../screens/lastname';
import EmailScreen from '../../screens/email';
import UsernameScreen from '../../screens/username';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export default function AppNavigation(){
  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={MyTabs} />
      </Stack.Navigator>
    );
  }


  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="HomeTab" component={HomeTab} />
        <Tab.Screen name="FriendsTab" component={FriendsTab} />
        <Tab.Screen name="ProfileTab" component={ProfileTab} />
      </Tab.Navigator>
    );
  }


  return(
    <NavigationContainer>
      <MyStack/>

    </NavigationContainer>
  )
}


/*
// Initialize Stack Navigator



const App = () => {
  const [data, setData] = useState([]);


  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(data);
    }
  };

console.log("hello");

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="IntroScreen">
      <Stack.Screen name="IntroScreen" component={IntroScreen} options={{ headerShown: false}} />
      <Stack.Screen name="PhoneLoginScreen" component={PhoneLoginScreen} options={{ headerShown: false}} />
      <Stack.Screen name="FirstNameScreen" component={FirstNameScreen} options={{ headerShown: false}} />
      <Stack.Screen name="LastNameScreen" component={LastNameScreen} options={{ headerShown: false}} />
      <Stack.Screen name="EmailScreen" component={EmailScreen} options={{ headerShown: false}} />
      <Stack.Screen name="UsernameScreen" component={UsernameScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="Data" options={{ title: 'Data from Supabase' }}>
          {() => (
            <View style={styles.container}>
              <Text>Data from Supabase:</Text>
              {data.map((item, index) => (
                <Text key={index}>{JSON.stringify(item)}</Text>
              ))}
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});


registerRootComponent(App);


export default App;


*/