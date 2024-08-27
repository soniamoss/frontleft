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
        //  Note: the fontFamily is not available, so Chicle is not applied.
        // fontFamily: "Chicle-Bold",
        fontFamily: "Chicle",
        color: "#3F407C",
      }}
      // allow overwrites
      {...props}
    />
  );
};

export { HeaderText };
