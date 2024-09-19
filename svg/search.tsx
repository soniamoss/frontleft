import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SearchIcon(props: any) {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M23.083 21.917L20 18.833c2.583-3.25 2.083-8-1.167-10.583s-8-2-10.583 1.167c-2.583 3.25-2 8 1.167 10.583a7.634 7.634 0 009.416 0l3.084 3.083a.806.806 0 001.166 0 .806.806 0 000-1.166zM14.167 20a5.797 5.797 0 01-5.834-5.833 5.797 5.797 0 015.834-5.834A5.797 5.797 0 0120 14.167 5.798 5.798 0 0114.167 20z"
        fill="#3F407C"
      />
    </Svg>
  );
}

export default SearchIcon;
