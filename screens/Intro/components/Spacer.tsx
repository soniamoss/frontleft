import { scaleHeight } from "@/constants/layout";
import React from "react";
import { View } from "react-native";

interface SpacerProps {}

const Spacer = (props: SpacerProps) => {
  return <View style={{ height: scaleHeight(15) }} {...props} />;
};

export { Spacer };
