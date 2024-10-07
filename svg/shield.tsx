import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ShieldIcon(props: any) {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M32.717 6.083a1.667 1.667 0 00-1.4-.333A13.333 13.333 0 0120.95 3.633a1.667 1.667 0 00-1.9 0A13.334 13.334 0 018.683 5.75a1.667 1.667 0 00-2.016 1.633V19.8a15 15 0 006.283 12.217l6.083 4.333a1.667 1.667 0 001.934 0l6.083-4.333A15 15 0 0033.333 19.8V7.383a1.667 1.667 0 00-.616-1.3zM30 19.8a11.667 11.667 0 01-4.883 9.5L20 32.95l-5.117-3.65A11.665 11.665 0 0110 19.8V9.3a16.667 16.667 0 0010-2.317A16.667 16.667 0 0030 9.3v10.5z"
        fill="#3F407C"
      />
    </Svg>
  );
}

export default ShieldIcon;
