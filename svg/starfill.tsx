import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

function StarFillIcon(props: any) {
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
        d="M21.551 9.67a1 1 0 00-.324-.462A.968.968 0 0020.71 9l-5.574-.83L12.637 3a.993.993 0 00-.362-.411.965.965 0 00-1.04 0 .993.993 0 00-.361.411L8.375 8.16 2.802 9a.97.97 0 00-.492.224c-.14.12-.245.278-.302.456a1.02 1.02 0 00.245 1l4.046 4-.98 5.68a1.02 1.02 0 00.053.559c.07.177.187.33.339.441a.966.966 0 001.029.07l5.015-2.67 4.996 2.68c.137.08.293.12.45.12.208 0 .41-.066.579-.19a.997.997 0 00.339-.441 1.02 1.02 0 00.052-.559l-.98-5.68 4.047-4a1.02 1.02 0 00.313-1.02zm-6.024 4a1.004 1.004 0 00-.285.89l.706 4.19-3.684-2a.964.964 0 00-.92 0l-3.684 2 .706-4.19a1.02 1.02 0 00-.284-.89l-2.94-3 4.125-.61a.968.968 0 00.44-.18.995.995 0 00.304-.37l1.744-3.81 1.842 3.82c.07.147.175.274.305.37.13.096.28.158.44.18l4.123.61-2.938 2.99z"
        fill="#6A74FB"
      />
      <Path fill="#6A74FB" d="M7 9H17V18H7z" />
      <Rect x={10} y={5} width={4} height={5} rx={2} fill="#6A74FB" />
      <Rect x={15} y={9} width={4} height={5} rx={2} fill="#6A74FB" />
      <Rect x={5} y={9} width={4} height={5} rx={2} fill="#6A74FB" />
      <Rect x={6} y={15} width={5} height={5} rx={2.5} fill="#6A74FB" />
      <Rect x={13} y={15} width={4} height={5} rx={2} fill="#6A74FB" />
    </Svg>
  );
}

export default StarFillIcon;
