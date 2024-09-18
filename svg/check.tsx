import * as React from "react";
import Svg, { Path } from "react-native-svg";

function CheckIcon(props: any) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M14.72 8.79l-4.29 4.3-1.65-1.65a1 1 0 10-1.41 1.41l2.35 2.36a1 1 0 001.41 0l5-5a.999.999 0 000-1.42 1 1 0 00-1.41 0zM12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"
        fill="#3D4353"
      />
    </Svg>
  );
}

export default CheckIcon;
