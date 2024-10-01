import { Colors } from "@/constants/Colors";
import { scaleFont, scaleHeight } from "@/constants/layout";
import {
  Linking,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
} from "react-native";

interface PrivacyAgreementProps {}

const PrivacyAgreement = ({}: PrivacyAgreementProps) => {
  return (
    <>
      <Text style={styles.textPrivacy}>
        By tapping ‘Sign in’ or ‘Create account’, you agree to our{" "}
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://www.doost.com/terms-of-service");
          }}
        >
          <Text style={styles.textsmaller}>Terms of Service</Text>
        </TouchableOpacity>
        . Learn how we process your {"\n"}data in our{" "}
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://www.doost.com/privacy-policy");
          }}
        >
          <Text style={styles.textsmaller}>Privacy Policy.</Text>
        </TouchableOpacity>
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  textsmaller: {
    fontSize: scaleFont(11),
    fontFamily: "PoppinsBold",
    color: Colors.dark.subtext,
    textDecorationLine: "underline",
  },
  textPrivacy: {
    fontSize: scaleFont(11), // Adjust font size
    lineHeight: scaleHeight(16.5),
    fontFamily: "PoppinsRegular",
    color: Colors.light.neutral,
  },
});

export { PrivacyAgreement };
