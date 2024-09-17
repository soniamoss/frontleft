import { useNavigation } from "expo-router";
import Constants from "expo-constants";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

export default function BackButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.backText}>{"< Back"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: Constants.statusBarHeight,
    left: 20,
    zIndex: 1,
  },
  backText: {
    fontSize: 16,
    color: "#6A74FB",
  },
});
