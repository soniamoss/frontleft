
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

const GetContacts = () => {
  useEffect(() => {
    Alert.alert(
      '"Doost" Would Like to Access Your Contacts',
      'We’ll check your contacts to see who from your friends is already on the app. Your contacts won’t be stored.',
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Find Friends</Text>
      <Text style={styles.textother}>
        Let’s find friends already on Doost to{'\n'} see what events they’re going to!
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
});

export default GetContacts;
