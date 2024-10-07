import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { router, useNavigation } from "expo-router";
import PhoneInput from "react-native-phone-number-input";
import { OtpInput } from "react-native-otp-entry";

import Constants from "expo-constants";

import React, { useState } from "react";
import {
  Keyboard,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { supabase } from "../supabaseClient";
import Toast from "react-native-toast-message";
import ShieldIcon from "@/svg/shield";

interface Data {
  phone: string;
  countryCode: string;
  phNumWithCode: string;
}

const PhoneLoginScreen = () => {
  const navigation = useNavigation();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [data, setData] = useState<Data>({
    phone: "",
    countryCode: "",
    phNumWithCode: "",
  });

  const handleSendOtp = async () => {
    let phone = data.phNumWithCode;

    const { error, data: phoneRes }: any = await supabase.auth.signInWithOtp({
      phone,
    });
    console.log("phoneRes", phoneRes);
    console.log("error", error);
    if (error) {
      Toast.show({
        type: "tomatoToast",
        text1: error.message,
        position: "bottom",
      });
    } else {
      setIsOtpSent(true);
      Toast.show({
        type: "successToast",
        text1: `Verification code on its way!`,
        position: "bottom",
      });
    }
  };

  const handleResendOtp = async () => {
    let phone = data.phNumWithCode;

    // if (phone.includes("+")) {
    //   phone = phone.slice(1)
    // }

    const { error }: any = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      Toast.show({
        type: "tomatoToast",
        text1: error.message,
        position: "bottom",
      });
    } else {
      Toast.show({
        type: "successToast",
        text1: `New code sent to your phone.`,
        position: "bottom",
      });
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const {
        data: { user },
        error: userError,
      }: any = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: profile, error: profileError }: any = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("phonenumber", user.phone)
        .select();

      if (profile.length === 0) {
        const { data, error }: any = await supabase
          .from("profiles")
          .upsert({ user_id: user.uid, phonenumber: user.phone })
          .select();
        router.push("/FirstNameScreen");
      }

      if (profile.length > 0) {
        if (profile[0].onboarding_complete) {
          // router.push("/(tabs)");
          // reset all routes
          navigation.reset({
            index: 0,
            routes: [{ name: "(tabs)" }], // your stack screen name
          });
        } else {
          router.push("/FirstNameScreen");
        }
      }
    } catch (error: any) {
      console.error("Error checking onboarding status:", error.message);
    }
  };

  const handleVerifyOtp = async () => {
    let phone = data.phNumWithCode;

    // if (phone.includes("+")) {
    //   phone = phone.slice(1)
    // }

    const { error }: any = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });
    if (error) {
      Toast.show({
        type: "tomatoToast",
        text1: error.message,
        position: "bottom",
      });
    } else {
      Toast.show({
        type: "successToast",
        text1: `Phone number verified!`,
        position: "bottom",
      });
      checkOnboardingStatus();
    }
  };

  const handleBack = () => {
    if (isOtpSent) {
      setIsOtpSent(false);
      return;
    }

    router.back();
  };

  const handleExit = () => {
    router.push("/"); //go to intro screen.
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={handleExit}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        {!isOtpSent ? (
          <View
            style={{
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                marginBottom: 50,
              }}
            >
              <Feather name="phone" size={40} color={"#3F407C"} />
              <Text style={styles.text}>What's your phone {"\n"} number?</Text>
            </View>
            <PhoneInput
              containerStyle={styles.phoneNumber}
              defaultValue={data.phone}
              onChangeText={(text) => {
                // without country code
                setPhone(text);
              }}
              defaultCode={"US"}
              onChangeFormattedText={(text) => {
                // with countryCode
                setData({ ...data, phNumWithCode: text });
              }}
              onChangeCountry={(text) => {
                setData({ ...data, countryCode: text.cca2 });
              }}
              autoFocus
            />
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                marginHorizontal: 50,
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: 50,
              }}
            >
              <Text style={styles.textsmaller}>
                By continuing, you agree to our
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL("https://supabase.com/privacy")}
              >
                <Text
                  style={[
                    styles.textsmaller,
                    { color: "#3B429F", textDecorationLine: "underline" },
                  ]}
                >
                  {" "}
                  Privacy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL("https://supabase.com/privacy")}
              >
                <Text
                  style={[
                    styles.textsmaller,
                    { color: "#3B429F", textDecorationLine: "underline" },
                  ]}
                >
                  {" "}
                  Policy
                </Text>
              </TouchableOpacity>
              <Text style={styles.textsmaller}>and </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL("https://supabase.com/terms")}
              >
                <Text
                  style={[
                    styles.textsmaller,
                    { color: "#3B429F", textDecorationLine: "underline" },
                  ]}
                >
                  Terms of Service.
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Send Verification Text</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <ShieldIcon />
              <Text style={styles.text2}>Verify your number</Text>
            </View>

            {/* <OTPInputView
              style={{ width: "80%", height: 150 }}
              pinCount={6}
              autoFocusOnLoad
              codeInputFieldStyle={styles.borderStyleBase}
              codeInputHighlightStyle={styles.borderStyleHighLighted}
              onCodeFilled={(code) => {
                // console.log(`Code is ${code}, you are good to go!`);
                setOtp(code);
                Keyboard.dismiss();
              }}
            /> */}

            <OtpInput
              numberOfDigits={6}
              focusColor="#3B429F"
              focusStickBlinkingDuration={500}
              onTextChange={(text) => console.log(text)}
              onFilled={(text) => {
                setOtp(text);
                Keyboard.dismiss();
              }}
              textInputProps={{
                accessibilityLabel: "One-Time Password",
              }}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: styles.pinCodeContainer,
              }}
              autoFocus
            />

            <TouchableOpacity
              style={styles.buttonresend}
              onPress={handleResendOtp}
            >
              <Text style={styles.textresend}>Resend Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Constants.statusBarHeight + 120,
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "poppins",
    color: "#3F407C",
    textAlign: "left",
  },
  text2: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "poppins",
    color: "#3F407C",
    textAlign: "left",
  },
  textsmaller: {
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "poppins",
    textAlign: "center",
    color: "#3D4353",
    zIndex: 1,
  },
  textresend: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "poppins",
    textAlign: "center",
    color: "#3B429F",
    marginBottom: 60,
    textDecorationLine: "underline",
    letterSpacing: 0.5,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  input: {
    width: "80%",
    padding: 15,
    borderWidth: 1,
    marginVertical: 8,
    bottom: 44,
  },
  buttonresend: {
    width: "26%",
    paddingVertical: 2,
    backgroundColor: "transparent",
    borderRadius: 30,
    alignItems: "center",
  },
  button: {
    // width: "60%",
    paddingVertical: 10,
    minWidth: 200,
    paddingHorizontal: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#3D4353",
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Poppins",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  image: {
    width: 40,
    height: 40,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 50, // Reduced marginBottom
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#3D4353",
    borderRadius: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  phoneNumber: {
    borderWidth: 1,
    borderColor: "#CEDBEA",
    borderRadius: 2,
    marginTop: 10,
    backgroundColor: "#fff",
    width: "100%",
    marginBottom: 44,
  },

  borderStyleBase: {
    width: 50,
    height: 50,
    marginHorizontal: 2,
    color: "#3D4353",
  },

  borderStyleHighLighted: {
    borderColor: "#3F407C",
  },

  pinCodeContainer: {
    borderRadius: 2,
  },
});

export default PhoneLoginScreen;
