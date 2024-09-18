import * as React from "react";
import Svg, { Path } from "react-native-svg";
const MusicIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#3B429F"
      d="M21.65 2.24a1 1 0 0 0-.8-.23l-13 2A1 1 0 0 0 7 5v10.35a3.448 3.448 0 0 0-3.445.24A3.5 3.5 0 1 0 9 18.5v-7.64l11-1.69v4.18a3.448 3.448 0 0 0-3.445.24A3.5 3.5 0 1 0 22 16.5V3a1 1 0 0 0-.35-.76ZM5.5 20a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm13-2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM20 7.14 9 8.83v-3l11-1.66v2.97Z"
    />
  </Svg>
);
export default MusicIcon;
