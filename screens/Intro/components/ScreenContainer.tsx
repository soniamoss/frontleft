import React from "react";
import { ImageBackground } from "react-native";

interface ScreenContainerProps {}

const ScreenContainer = (props: ScreenContainerProps) => {
  return (
    <ImageBackground
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      source={require("../../../assets/images/splash.png")}
      {...props}
    />
  );
};

export { ScreenContainer };
