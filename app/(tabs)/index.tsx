// index.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { supabase } from '../../supabaseClient';
import HomeScreen from '../HomeScreen';
import PhoneLoginScreen from '../../screens/PhoneLoginScreen';
import IntroScreen from '../../screens/intro';
import FirstNameScreen from '../../screens/firstname';
import LastNameScreen from '../../screens/lastname';
import EmailScreen from '../../screens/email';
import UsernameScreen from '../../screens/username';



// Initialize Stack Navigator
const Stack = createStackNavigator();


const App: React.FC = () => {
  const [data, setData] = useState<any[]>([]);


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
