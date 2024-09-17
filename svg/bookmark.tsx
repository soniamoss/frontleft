import * as React from "react";
import Svg, { Path } from "react-native-svg";
const BookmarkIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#3D4353"
      d="M18 2H8a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM6 6a2 2 0 0 1 2-2h10v10H8a3.91 3.91 0 0 0-2 .56V6Zm2 14a2 2 0 1 1 0-4h10v4H8Zm2-12h4a1 1 0 1 0 0-2h-4a1 1 0 0 0 0 2Z"
    />
  </Svg>
);
export default BookmarkIcon;
