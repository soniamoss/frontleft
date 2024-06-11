import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const FirstNameScreen: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const navigation = useNavigation();

  const handleNext = () => {
    // Navigate to the last name screen passing the first name
    navigation.navigate('LastNameScreen');
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
      <Text style={styles.text}>What's your first name?</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text style={styles.text}>What your friends call you</Text>
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
  },
  text: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily:'poppins',
    color:'#3F407C',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    marginVertical: 10,
  },
  button: {
    position: 'absolute',
    bottom: 260,
    width: '60%',
    paddingVertical: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 30, 
    alignItems: 'center',
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
  },
});

export default FirstNameScreen;
