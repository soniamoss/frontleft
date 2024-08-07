
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Notifications = () => {
  const navigation = useNavigation();


  useEffect(() => {
    Alert.alert(
      '"Doost" Would Like to Send You Notifications',
      'Notifications may include alerts, sounds and icon badges. These can be configured in Settings.',
      [
        {
          text: "Don’t Allow",
          onPress: () => console.log('Don’t Allow Pressed'),
          style: 'cancel', 
        },
        {
          text: 'Allow',
          onPress: () => console.log('Allow Pressed'),
          style: 'default', 
        },
      ],
      { cancelable: false } // wont be dismissed by tapping outside
    );
  }, []);

  const handleNext = () => {
    navigation.navigate('Tabs');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Skip</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Allow Notifications</Text>
      <Text style={styles.textother}>
        We'll notify you when your friends are {'\n'}attending, intrested in, or have tickets {'\n'}for an event, along with other exciting{'\n'} updates!
      </Text>
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
    fontSize: 19,
    fontWeight: 'bold',
    fontFamily: 'poppins',
    textAlign: 'center',
    color: '#3B429F',
    marginTop: 2,
  },
  textother: {
    fontSize: 17,
    fontWeight: '400',
    fontFamily: 'Proxima Nova',
    textAlign: 'center',
    color: '#3D4353',
    marginTop: 13,
    zIndex: 1,
  },
  button: {
    width: '20%',
    position: 'absolute',
    top: 50,
    left: 368,
    zIndex: 1,// Ensure the button is above the image
  },
  buttonText: {
    color: '##3B429F',
    fontSize: 15,
    fontWeight: 400,
  },
});

export default Notifications;
