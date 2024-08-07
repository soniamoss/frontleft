import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';


const UsernameScreen  = ({navigation}) => {
  const [username, setUsername] = useState('');

  const setUserNameInDB = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
    .from('profiles')
    .upsert({ phonenumber_id: user.phone, phonenumber: user.phone, username: username, onboarding_complete: true })
    .select()
  }

  const handleNext = async () => {
    if (!username) {
      console.error('Username is required.');
      return;
    }
    await setUserNameInDB(); 
    navigation.navigate('getContacts');
  };

  const handleExit = () => {
    navigation.navigate('IntroScreen');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };


  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={handleExit}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <Image source={require('@/assets/images/user.png')} style={styles.image} />
      <Text style={styles.text}>Create a username</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.textsmaller}>Have fun with it</Text>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>    
      </View>
      </TouchableWithoutFeedback>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    marginBottom: 30,
    fontSize: 20, 
    fontWeight: 'bold',
    fontFamily: 'poppins',
    color: '#3F407C',
    textAlign: 'left', // Align text center
    bottom: 22,
    left: 20,
  },
  textsmaller: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'poppins',
    textAlign: 'center',
    color: '#3B429F',
    marginBottom: 16,
    zIndex: 1, // Ensure the text is above the image
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1, // Ensure the button is above the image
  },
  input: {
    width: '74%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: 'black',
    marginBottom: 60,
  },
  button: {
    width: '60%',
    paddingVertical: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    alignItems: 'center',
    top:16,
    zIndex: 1, // Ensure the button is above the image
  },
  buttonText: {
    color: '#3D4353',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1, // Ensure the button is above the image
  },
  image: {
    position: 'absolute',
    width: 40, // Adjust width as needed
    height: 40, // Adjust height as needed
    top: 260, // Adjust top position as needed
    left: 48,
  
  },
});

export default UsernameScreen;



