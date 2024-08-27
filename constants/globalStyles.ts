import { Colors } from "@/constants/Colors";
import { scaleFont } from "@/constants/layout";

export const GLOBAL_STYLES = {
  bodyText: {},
  linkText: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
    color: Colors.dark.subtext,
  },
};
