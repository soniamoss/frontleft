import { DoostButton } from "@/screens/Intro/components/DoostButton";
import { HeaderText } from "@/screens/Intro/components/HeaderText";
import { PaddedView } from "@/screens/Intro/components/PaddedView";
import { PrivacyAgreement } from "@/screens/Intro/components/PrivacyAgreement";
import { ScreenContainer } from "@/screens/Intro/components/ScreenContainer";
import { Spacer } from "@/screens/Intro/components/Spacer";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";

const IntroScreen = () => {
  const onPress = () => {
    // if (true) return router.push("/UsernameScreen");

    router.push("/PhoneLoginScreen"); // Navigate to the phone login screen
  };

  return (
    <ScreenContainer>
      <HeaderText>Doost</HeaderText>
      <PaddedView>
        <Text style={styles.textsmaller}>Where events and friends meet</Text>
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <PrivacyAgreement />
        <Spacer />
        <Spacer />
        <DoostButton onPress={onPress} />
      </PaddedView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
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
