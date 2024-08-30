import { scaleWidth } from "@/constants/layout";
import React from "react";
import { View } from "react-native";

interface PaddedViewProps {}

const PaddedView = (props: PaddedViewProps) => {
  return (
    <View
      style={{
        alignItems: "center",
        width: scaleWidth(343),
        alignSelf: "center",
      }}
      {...props}
    />
  );
};

export { PaddedView };
