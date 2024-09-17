import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ChevronIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#3D4353"
      d="M15.54 11.29 9.88 5.64a1 1 0 1 0-1.42 1.41l4.95 5L8.46 17a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.3.999.999 0 0 0 .71-.3l5.66-5.65a1 1 0 0 0 0-1.47Z"
    />
  </Svg>
);
export default ChevronIcon;
