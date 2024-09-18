import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";

type ButtonContainedProps = {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  cusStyle?: ViewStyle;
};

const ButtonContained: React.FC<ButtonContainedProps> = ({
  title = "",
  onPress = () => {},
  disabled = false,
  cusStyle = {},
}) => {
  return (
    <TouchableOpacity
      style={{
        borderColor: "#3F407C",
        borderWidth: 1,
        backgroundColor: "#3F407C",
        padding: 11,
        borderRadius: 5,
        ...cusStyle,
      }}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={{
          color: "#fff",
          textAlign: "center",
          fontWeight: "600",
          fontFamily: "Poppins",
          zIndex: 1,
          fontSize: 14,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default ButtonContained;
