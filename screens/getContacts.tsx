import { router } from "expo-router";
import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GetContacts = () => {
  useEffect(() => {
    Alert.alert(
      '"Doost" Would Like to Access Your Contacts',
      "We’ll check your contacts to see who from your friends is already on the app. Your contacts won’t be stored.",
      [
        {
          text: "Don’t Allow",
          onPress: () => console.log("Don’t Allow Pressed"),
          style: "cancel",
        },
        {
          text: "Allow",
          onPress: () => console.log("Allow Pressed"),
          style: "default",
        },
      ],
      { cancelable: false } // wont be dismissed by tapping outside
    );
  }, []);

  const handleNext = () => {
    router.push("/ShowContactsScreen");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Skip</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Find Friends</Text>
      <Text style={styles.textother}>
        Let’s find friends already on Doost to{"\n"} see what events they’re
        going to!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 19,
    fontWeight: "bold",
    fontFamily: "poppins",
    textAlign: "center",
    color: "#3B429F",
    marginTop: 2,
  },
  textother: {
    fontSize: 17,
    fontWeight: "400",
    fontFamily: "Proxima Nova",
    textAlign: "center",
    color: "#3D4353",
    marginTop: 13,
    zIndex: 1,
  },
  button: {
    width: "20%",
    position: "absolute",
    top: 50,
    left: 368,
    zIndex: 1, // Ensure the button is above the image
  },
  buttonText: {
    color: "##3B429F",
    fontSize: 15,
    fontWeight: 400,
  },
});

export default GetContacts;
