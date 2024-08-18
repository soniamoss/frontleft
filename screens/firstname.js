import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';
import { getCurrentUser } from '../services/userService'; 

const FirstNameScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [fontSize, setFontSize] = useState(36); // Default font size

  useEffect(() => {
    // Adjust font size based on the length of the text
    const calculateFontSize = () => {
      const maxLength = 20; // Maximum length for which the font size is large
      const minSize = 16;  // Minimum font size
      const sizeReductionFactor = 0.5; // Amount to reduce font size for each character above the max length
      const length = firstName.length;

      if (length > maxLength) {
        setFontSize(Math.max(minSize, 36 - (length - maxLength) * sizeReductionFactor));
      } else {
        setFontSize(36); // Reset to default size if length is within limit
      }
    };

    calculateFontSize();
  }, [firstName]);

  const setFirstNameInDB = async () => {
    const user = await getCurrentUser();
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ user_id: user.uid, phonenumber: user.phone, first_name: firstName })
      .select();
  };

  const handleNext = async () => {
    if (!firstName) {
      console.error('First name is required.');
      return;
    }
    await setFirstNameInDB();
    navigation.navigate('LastNameScreen');
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

        <Text style={styles.text}>What's your first name?</Text>
        <TextInput
          style={[styles.input, { fontSize }]} // Apply dynamic font size
          placeholder=""
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text style={styles.textSmaller}>What your friends call you</Text>
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
    textAlign: 'left',
    bottom: 22,
    left: 20,
  },
  textSmaller: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'poppins',
    textAlign: 'center',
    color: '#3B429F',
    marginBottom: 16,
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  input: {
    width: '74%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: 'black',
    marginBottom: 60,
    textAlign: 'center',
  },
  button: {
    width: '60%',
    paddingVertical: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    alignItems: 'center',
    top: 16,
    zIndex: 1,
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
    zIndex: 1,
  },
  image: {
    position: 'absolute',
    width: 40,
    height: 40,
    top: 246,
    left: 48,
  },
});

export default FirstNameScreen;
