import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";

type ButtonOutlinedProps = {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  cusStyle?: ViewStyle;
};

const ButtonOutlined: React.FC<ButtonOutlinedProps> = ({
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
        flex: 1,
        padding: 11,
        borderRadius: 5,
        ...cusStyle,
      }}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={{
          color: "#3F407C",
          textAlign: "center",
          fontWeight: "600",
          fontFamily: "Poppins",
          fontSize: 14,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default ButtonOutlined;
