import * as React from "react";
import Svg, { Path } from "react-native-svg";
const UserIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Path
      fill="#3F407C"
      d="M26.183 21.183a10 10 0 1 0-12.366 0A16.668 16.668 0 0 0 3.45 34.817a1.677 1.677 0 0 0 3.333.366 13.333 13.333 0 0 1 26.5 0 1.667 1.667 0 0 0 1.667 1.484h.183a1.667 1.667 0 0 0 1.467-1.834 16.666 16.666 0 0 0-10.417-13.65ZM20 20a6.666 6.666 0 1 1 0-13.333A6.666 6.666 0 0 1 20 20Z"
    />
  </Svg>
);
export default UserIcon;
