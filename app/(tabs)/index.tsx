// index.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from '../../supabaseClient';
import HomeScreen from '../HomeScreen';
import PhoneLoginScreen from '../../screens/PhoneLoginScreen';


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
      <Stack.Navigator initialRouteName="PhoneLogin">
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} options={{ title: 'Doost' }} />
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







