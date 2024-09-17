import * as React from "react";
import Svg, { Path } from "react-native-svg";
const FriendsIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#3D4353"
      d="M10 10a4.126 4.126 0 0 0 4.167-4.166A4.126 4.126 0 0 0 10 1.667a4.126 4.126 0 0 0-4.167 4.167A4.126 4.126 0 0 0 10 10Zm7.75 7.334c-1.083-4.25-5.416-6.917-9.666-5.834C5.25 12.25 3 14.417 2.25 17.334c-.083.416.167.916.667 1h14c.5 0 .833-.334.833-.834v-.166Z"
    />
  </Svg>
);
export default FriendsIcon;
