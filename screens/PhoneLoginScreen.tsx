// PhoneLoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity} from 'react-native';
import { supabase } from '../supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';




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
      //navigation.navigate('FirstNameScreen');
    }
  };

  console.log('PhoneLoginScreen rendered'); // checks if its rendering 

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
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
          <Button title="Send Code" onPress={handleSendOtp} />
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
          <Button title="Confirm" onPress={handleVerifyOtp} />
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
  },
  text: {
    marginBottom: 30, // Adjust as needed
    fontSize: 20, // Adjust font size
    fontWeight: 'bold', // Make text bold
  },
  backButton: {
    position: 'absolute',
    top: 20, // Adjust as necessary
    left: 20, // Adjust as necessary
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    marginVertical: 10,
  },
});

export default PhoneLoginScreen;
