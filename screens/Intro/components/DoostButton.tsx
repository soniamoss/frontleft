import { scaleWidth } from "@/constants/layout";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface DoostButtonProps {}

// TODO: I recommend doing restyle instead =>https://shopify.github.io/restyle/
const DoostButton = ({}: DoostButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("/PhoneLoginScreen")}
    >
      <Text style={styles.buttonText}>Create Account/Sign In</Text>
    </TouchableOpacity>
  );
};

export { DoostButton };

const styles = StyleSheet.create({
  button: {
    paddingVertical: scaleWidth(15),
    paddingHorizontal: scaleWidth(30),
    backgroundColor: "#3F407C",
    borderRadius: scaleWidth(30),
    padding: scaleWidth(15),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins",
  },
});
