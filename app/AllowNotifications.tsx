import ButtonContained from "@/components/buttons/contained";
import ButtonOutlined from "@/components/buttons/outlined";
import { getCurrentUser } from "@/services/userService";
import { supabase } from "@/supabaseClient";
import { router, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Alert, ImageBackground, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const AllowNotifications = () => {
  const navigation = useNavigation();
  // useEffect(() => {

  // }, []);

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "(tabs)" }], // your stack screen name
    });
  };

  const handleAllow = () => {
    Alert.alert(
      '"Allow Notifications',
      "We’ll notify you when your friends are attending, interested in, or have tickets for an event, along with other exciting updates!",
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

  const allowNotifications = async () => {
    try {
      const user = await getCurrentUser();
      const { error }: any = await supabase
        .from("profiles")
        .update({ notifications: true })
        .eq("user_id", user.id);

      if (error) throw error;

      Toast.show({
        type: "successToast",
        text1: `Notification Sync is now enabled`,
        position: "bottom",
      });
    } catch (error) {
      console.error("Error updating notification sync:", error);

      Toast.show({
        type: "tomatoToast",
        text1: "That didn’t work, please try again!",
        position: "bottom",
      });
    } finally {
      navigation.reset({
        index: 0,
        routes: [{ name: "(tabs)" }], // your stack screen name
      });
    }
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
        <ButtonOutlined
          title="Skip for Now"
          onPress={handleSkip}
          cusStyle={{ flex: 1 }}
        />
        <ButtonContained
          title="Allow Notifications"
          onPress={handleAllow}
          cusStyle={{ flex: 1 }}
        />
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
