// PhoneLoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity} from 'react-native';
import { supabase } from '../supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import {useNavigation } from '@react-navigation/native';


const PhoneLoginScreen: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigation = useNavigation();


  const handleSendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
        console.log('send otp');
      Alert.alert('Error', error.message);
    } else {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOtp = async () => {
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms'});
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Phone number verified!');
      navigation.navigate('FirstNameScreen');
    }
  };

  const handleBack = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };


  const handleExit = () => {
    navigation.navigate('IntroScreen');
  };

  //console.log('PhoneLoginScreen rendered'); // checks if its rendering 

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>  
      <TouchableOpacity style={styles.closeButton} onPress={handleExit}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      {!isOtpSent ? (
        <>
        <Text style={styles.text}>What's your phone number </Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Send Verification Text</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
        <Text style={styles.text}>Verify your number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6 digit code"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </>
      )}
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
    marginBottom: 30, // Adjust as needed
    fontSize: 20, // Adjust font size
    fontWeight: 'bold', // Make text bold
    fontFamily:'poppins',
    color:'#3F407C',
  },
  backButton: {
    position: 'absolute',
    top: 60, // Adjust as necessary
    left: 20, // Adjust as necessary
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

export default PhoneLoginScreen;
