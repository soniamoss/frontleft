import * as React from "react";
import Svg, { Path } from "react-native-svg";

function PinIcon(props: any) {
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
        d="M12 2a8 8 0 00-8 8c0 5.4 7.05 11.5 7.35 11.76a1 1 0 001.3 0C13 21.5 20 15.4 20 10a8 8 0 00-8-8zm0 17.65c-2.13-2-6-6.31-6-9.65a6 6 0 0112 0c0 3.34-3.87 7.66-6 9.65zM12 6a4 4 0 100 8 4 4 0 000-8zm0 6a2 2 0 110-4 2 2 0 010 4z"
        fill="#3D4353"
      />
    </Svg>
  );
}

export default PinIcon;
