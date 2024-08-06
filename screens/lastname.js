import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';

const LastNameScreen  = ({navigation}) => {
  const [lastName, setlastName] = useState('');
  
  const setLastNameInDB = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, last_name: lastName })
    .select()

  }

  const handleNext = async () => {
    if (!lastName) {
      console.error('Last name is required.');
      return;
    }
    await setLastNameInDB(); 
    navigation.navigate('EmailScreen');
  };
  const handleExit = () => {
    navigation.navigate('IntroScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={handleExit}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <Image source={require('@/assets/images/user.png')} style={styles.image} />
      <Text style={styles.text}>What's your last name?</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={lastName}
        onChangeText={setlastName}
      />
      <Text style={styles.textsmaller}>Your family's claim to fame</Text>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
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



export default LastNameScreen;
