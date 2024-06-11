import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../styles/colors';
import PhoneLoginScreen from '../screens/PhoneLoginScreen';


const IntroScreen: React.FC = () => {
    const navigation = useNavigation(); 
  
    const handleCreateAccount = () => {
      navigation.navigate('PhoneLoginScreen'); // Navigate to the phone login screen
    };

  return (
    <View style={styles.container}>
       <Text style={styles.text}>Doost</Text> 
       <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28397E33', 
  },
  signInButtonContainer: {
    position: 'absolute',
    bottom: 30,
    fontSize: 15,
    backgroundColor: 'transparent',
    fontFamily:'Proxima Nova',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold', 
    color:'#3F407C',
  },
  button: {
    position: 'absolute',
    bottom: 68,
    width: '60%',
    paddingVertical: 15,
    backgroundColor: '#3F407C',
    borderRadius: 30, 
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default IntroScreen;

//when we add logo
//<Image source={require('../assets/logo.png')} style={styles.logo} />
/*logo: {
    width: 200,  
    height: 200, 
    resizeMode: 'contain',
  }*/

