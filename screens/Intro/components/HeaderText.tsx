import { Colors } from "@/constants/Colors";
import { Text } from "react-native";

interface HeaderTextProps {}

const HeaderText = (props: HeaderTextProps) => {
  return (
    <Text
      // sensible defaults
      style={{
        fontSize: 80,
        // fontWeight: "bold", //TODO: avoid using fontWeight, it is easy to cause crashes on Android when doing so,
        // use fontFamily instead
        fontFamily: "Chicle",
        color: Colors.dark.subtext,
      }}
      // allow overwrites
      {...props}
    />
  );
};

export { HeaderText };
