import * as React from "react";
import Svg, { Path } from "react-native-svg";

function CrossCircleIcon(props: any) {
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
        d="M15.71 8.29a.999.999 0 00-1.42 0L12 10.59l-2.29-2.3a1.004 1.004 0 00-1.42 1.42l2.3 2.29-2.3 2.29a1 1 0 000 1.42.998.998 0 001.42 0l2.29-2.3 2.29 2.3a.999.999 0 001.42 0 1 1 0 000-1.42L13.41 12l2.3-2.29a1.001 1.001 0 000-1.42zm3.36-3.36A10 10 0 104.93 19.07 10 10 0 1019.07 4.93zm-1.41 12.73A8 8 0 1120 12a7.949 7.949 0 01-2.34 5.66z"
        fill="#3D4353"
      />
    </Svg>
  );
}

export default CrossCircleIcon;
