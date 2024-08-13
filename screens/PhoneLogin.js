
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabaseClient';

const PhoneLoginScreen  = ({navigation}) => {
  const [phone, setPhone] = useState('+1'); // Initialize phone state with '+1'
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  

  const handleSendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setIsOtpSent(true);
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('onboarding_complete')
        .eq('phonenumber', user.phone)
        .select(); 

 
      if ( profile.length === 0 ) {
        
        const { data, error } = await supabase
        .from('profiles')
        .upsert({ user_id: user.uid, phonenumber: user.phone, })
        .select()

        navigation.navigate('FirstNameScreen');
      
      } 
      
      if (profile.length > 0 ) {
        
        if (profile[0].onboarding_complete == true) {
          
          navigation.navigate('Tabs');
        } 
        
        if (profile[0].onboarding_complete == false) {
          
          navigation.navigate('FirstNameScreen');
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error.message);
    }

  }

  const handleVerifyOtp = async () => {
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Phone number verified!');
      checkOnboardingStatus(); 
    }
  };

  const handleBack = () => {
    navigation.goBack();
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
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={handleExit}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        {!isOtpSent ? (
          <>
          
            <Text style={styles.text}> What's your phone {'\n'} number? </Text>
            <Image source={require('../assets/images/phone.png')} style={styles.image} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <Text style={styles.textsmaller}>
            By continuing, you agree to our Privacy {'\n'}Policy and Terms of Service.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Send Verification Text</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
          
            <Text style={styles.text2}>Verify your number</Text>
            <Image source={require('../assets/images/shield.png')} style={styles.image} />
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
    bottom: 42,
  },
  text2: {
    marginBottom: 30,
    fontSize: 20, 
    fontWeight: 'bold',
    fontFamily: 'poppins',
    color: '#3F407C',
    textAlign: 'left', // Align text center
    bottom: 80,
  },
  textsmaller: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'poppins',
    textAlign: 'center',
    color: '#3D4353',
    marginBottom: 60,
    zIndex: 1, // Ensure the text is above the image
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  input: {
    width: '80%',
    padding: 15,
    borderWidth: 1,
    marginVertical: 8,
    bottom: 44,
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
    fontWeight: 700 ,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  image: {
    position: 'absolute',
    width: 40, // Adjust width as needed
    height: 40, // Adjust height as needed
    top: 260, // Adjust top position as needed
    left: 60,
  
  },
});

export default PhoneLoginScreen;
