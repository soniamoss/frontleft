import * as React from "react";
import Svg, { Path } from "react-native-svg";
const EmailIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Path
      fill="#3D4353"
      d="M28.334 18.333H30a1.667 1.667 0 0 0 1.667-1.666V15A1.666 1.666 0 0 0 30 13.333h-1.666A1.667 1.667 0 0 0 26.667 15v1.667a1.667 1.667 0 0 0 1.667 1.666ZM10 20h8.334a1.667 1.667 0 0 0 0-3.333H10A1.667 1.667 0 0 0 10 20ZM36.667 6.667H3.334a1.667 1.667 0 0 0-1.667 1.666v23.334a1.667 1.667 0 0 0 1.667 1.666h33.333a1.667 1.667 0 0 0 1.667-1.666V8.333a1.667 1.667 0 0 0-1.667-1.666ZM35 30H5V10h30v20Zm-25-3.333h8.334a1.667 1.667 0 0 0 0-3.334H10a1.667 1.667 0 0 0 0 3.334Z"
    />
  </Svg>
);
export default EmailIcon;
