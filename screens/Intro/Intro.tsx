import { DoostButton } from "@/screens/Intro/components/DoostButton";
import { HeaderText } from "@/screens/Intro/components/HeaderText";
import { PaddedView } from "@/screens/Intro/components/PaddedView";
import { PrivacyAgreement } from "@/screens/Intro/components/PrivacyAgreement";
import { ScreenContainer } from "@/screens/Intro/components/ScreenContainer";
import { Spacer } from "@/screens/Intro/components/Spacer";
import { router } from "expo-router";
import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";

const IntroScreen = () => {
  const onPress = async () => {
    router.push("/PhoneLoginScreen"); // Navigate to the phone login screen
    // router.push("/UsernameScreen"); // Navigate to the phone login screen
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/images/friends-back.png")}
    >
      <HeaderText>Doost</HeaderText>
      <Text style={styles.textsmaller}>Where events and friends meet</Text>

      <View
        style={{
          position: "absolute",
          bottom: 70,
          left: 20,
          right: 20,
          alignItems: "center",
          gap: 40,
        }}
      >
        <PrivacyAgreement />
        <DoostButton onPress={onPress} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight + 200,
  },
  textsmaller: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Chicle",
    color: "#3F407C",
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
