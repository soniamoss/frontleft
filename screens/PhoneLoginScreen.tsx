// PhoneLoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabaseClient';

const PhoneLoginScreen: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

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
    }
  };

  console.log('PhoneLoginScreen rendered'); // checks if its rendering 

  return (
    <View style={styles.container}>
      <Text>Phone Number Login</Text>
      {!isOtpSent ? (
        <>
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
          <TextInput
            style={styles.input}
            placeholder="OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
          />
          <Button title="Verify Code" onPress={handleVerifyOtp} />
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
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    marginVertical: 10,
  },
});

export default PhoneLoginScreen;
