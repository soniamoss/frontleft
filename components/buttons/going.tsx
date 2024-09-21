import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import CheckIcon from "@/svg/check";

type GoingButtonProps = {
  goingStatus?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  cusStyle?: ViewStyle;
};

const GoingButton: React.FC<GoingButtonProps> = ({
  goingStatus = false,
  onPress,
  disabled = false,
  cusStyle = {},
}) => {
  return (
    <TouchableOpacity
      style={{
        borderColor: goingStatus ? "#3F407C" : "#fff",
        borderWidth: 1,
        backgroundColor: goingStatus ? "#fff" : "#3F407C",
        padding: 11,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        opacity: disabled ? 0.5 : 1,
        ...cusStyle,
      }}
      disabled={disabled}
      onPress={onPress}
    >
      {goingStatus && <CheckIcon />}
      <Text
        style={{
          color: goingStatus ? "#3F407C" : "#fff",
          textAlign: "center",
          fontWeight: "500",
          fontFamily: "Poppins",
          zIndex: 1,
          fontSize: 14,
        }}
      >
        {goingStatus ? "Going" : "Going?"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default GoingButton;
