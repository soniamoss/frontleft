import ButtonContained from "@/components/buttons/contained";
import ButtonOutlined from "@/components/buttons/outlined";
import { router } from "expo-router";
import * as Contacts from "expo-contacts";

import React, { useEffect } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "@/supabaseClient";
import { getCurrentUser } from "@/services/userService";

const GetContacts = () => {
  // useEffect(() => {

  // }, []);

  const handleSkip = () => {
    router.push("/AllowNotifications");
  };

  const handleAllow = async () => {
    Alert.alert(
      '"Doost" Would Like to Access Your Contacts',
      "We’ll check your contacts to see who from your friends is already on the app. Your contacts won’t be stored.",
      [
        {
          text: "Don’t Allow",
          onPress: () => handleSkip(),
          style: "cancel",
        },
        {
          text: "Allow",
          onPress: () => saveContact(),
          style: "default",
        },
      ],
      { cancelable: false } // wont be dismissed by tapping outside
    );
  };

  const saveContact = async () => {
    // update the contact status to "accepted"

    console.log("saving contacts");

    try {
      const user = await getCurrentUser();

      const { data, error } = await supabase
        .from("profiles")
        .update({
          contact_sync: true,
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        return null;
      }

      router.push("/GetContactsScreen");

      console.log("Profile updated successfully:", data);
      return data;
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/friends-back.png")}
    >
      <Text style={styles.text}>Find Friends</Text>
      <Text style={styles.textother}>
        Let’s find friends already on Doost to{"\n"} see what events they’re
        going to!
      </Text>
      <View
        style={{
          flexDirection: "row",
          gap: 20,
          marginHorizontal: 20,
          marginTop: 50,
        }}
      >
        <ButtonOutlined title="Skip for Now" onPress={handleSkip} />
        <ButtonContained title="Allow Contacts" onPress={handleAllow} />
      </View>
    </ImageBackground>
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
    position: "absolute",
    top: 50,
    right: 10,
    zIndex: 1, // Ensure the button is above the image
  },
  buttonText: {
    color: "##3B429F",
    fontSize: 15,
    fontWeight: 400,
  },
});

export default GetContacts;
