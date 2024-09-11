import ButtonContained from "@/components/buttons/contained";
import ButtonOutlined from "@/components/buttons/outlined";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AllowNotifications = () => {
  // useEffect(() => {

  // }, []);

  const handleSkip = () => {
    router.push("/(tabs)");
  };

  const handleAllow = () => {
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
          onPress: () => allowNotifications(),
          style: "default",
        },
      ],
      { cancelable: false } // wont be dismissed by tapping outside
    );
  };

  const allowNotifications = () => {
    router.push("/(tabs)");
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/friends-back.png")}
    >
      <Text style={styles.text}>Allow Notifications</Text>
      <Text style={styles.textother}>
        We’ll notify you when your friends are attending, interested in, or have
        tickets for an event, along with other exciting updates!
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
        <ButtonContained title="Allow Notifications" onPress={handleAllow} />
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

export default AllowNotifications;
