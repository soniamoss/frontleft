// // import React, { useState } from 'react';
// // import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert, Image } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { useNavigation } from '@react-navigation/native';
// // import { supabase } from '../supabaseClient';

// // const PhoneLoginScreen  = ({navigation}) => {
// //   const [phone, setPhone] = useState('+1'); // Initialize phone state with '+1'
// //   const [otp, setOtp] = useState('');
// //   const [isOtpSent, setIsOtpSent] = useState(false);

// //   const handleSendOtp = async () => {
// //     const { error }: any = await supabase.auth.signInWithOtp({ phone });
// //     if (error) {
// //       Alert.alert('Error', error.message);
// //     } else {
// //       setIsOtpSent(true);
// //     }
// //   };

// //   const checkOnboardingStatus = async () => {
// //     try {
// //       const { data: { user }, error: userError }: any = await supabase.auth.getUser();
// //       if (userError) throw userError;

// //       const { data: profile, error: profileError }: any = await supabase
// //         .from('profiles')
// //         .select('onboarding_complete')
// //         .eq('phonenumber', user.phone)
// //         .select();

// //       if ( profile.length === 0 ) {

// //         const { data, error }: any = await supabase
// //         .from('profiles')
// //         .upsert({ user_id: user.uid, phonenumber: user.phone, })
// //         .select()

// //         router.push('FirstNameScreen');

// //       }

// //       if (profile.length > 0 ) {

// //         if (profile[0].onboarding_complete == true) {

// //           router.push('Tabs');
// //         }

// //         if (profile[0].onboarding_complete == false) {

// //           router.push('FirstNameScreen');
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error checking onboarding status:', error.message);
// //     }

// //   }

// //   const handleVerifyOtp = async () => {
// //     const { error }: any = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
// //     if (error) {
// //       Alert.alert('Error', error.message);
// //     } else {
// //       Alert.alert('Success', 'Phone number verified!');
// //       checkOnboardingStatus();
// //     }
// //   };

// //   const handleBack = () => {
// //     navigation.goBack();
// //   };

// //   const handleExit = () => {
// //     router.push('IntroScreen');
// //   };

// //   const dismissKeyboard = () => {
// //     Keyboard.dismiss();
// //   };

// //   return (
// //     <TouchableWithoutFeedback onPress={dismissKeyboard}>
// //       <View style={styles.container}>
// //         <TouchableOpacity style={styles.backButton} onPress={handleBack}>
// //           <Ionicons name="arrow-back" size={24} color="black" />
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.closeButton} onPress={handleExit}>
// //           <Ionicons name="close" size={24} color="black" />
// //         </TouchableOpacity>
// //         {!isOtpSent ? (
// //           <>

// //             <Text style={styles.text}> What's your phone {'\n'} number? </Text>
// //             <Image source={require('../assets/images/phone.png')} style={styles.image} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Phone Number"
// //               value={phone}
// //               onChangeText={setPhone}
// //               keyboardType="phone-pad"
// //             />
// //             <Text style={styles.textsmaller}>
// //             By continuing, you agree to our Privacy {'\n'}Policy and Terms of Service.
// //             </Text>
// //             <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
// //               <Text style={styles.buttonText}>Send Verification Text</Text>
// //             </TouchableOpacity>
// //           </>
// //         ) : (
// //           <>

// //             <Text style={styles.text2}>Verify your number</Text>
// //             <Image source={require('../assets/images/shield.png')} style={styles.image} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Enter 6 digit code"
// //               value={otp}
// //               onChangeText={setOtp}
// //               keyboardType="number-pad"
// //             />
// //             <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
// //               <Text style={styles.buttonText}>Confirm</Text>
// //             </TouchableOpacity>
// //           </>
// //         )}
// //       </View>
// //     </TouchableWithoutFeedback>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#FFFFFF',
// //   },
// //   text: {
// //     marginBottom: 30,
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     fontFamily: 'poppins',
// //     color: '#3F407C',
// //     textAlign: 'left', // Align text center
// //     bottom: 42,
// //   },
// //   text2: {
// //     marginBottom: 30,
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     fontFamily: 'poppins',
// //     color: '#3F407C',
// //     textAlign: 'left', // Align text center
// //     bottom: 80,
// //   },
// //   textsmaller: {
// //     fontSize: 11,
// //     fontWeight: 'bold',
// //     fontFamily: 'poppins',
// //     textAlign: 'center',
// //     color: '#3D4353',
// //     marginBottom: 60,
// //     zIndex: 1, // Ensure the text is above the image
// //   },
// //   backButton: {
// //     position: 'absolute',
// //     top: 60,
// //     left: 20,
// //   },
// //   input: {
// //     width: '80%',
// //     padding: 15,
// //     borderWidth: 1,
// //     marginVertical: 8,
// //     bottom: 44,
// //   },
// //   button: {
// //     position: 'absolute',
// //     bottom: 260,
// //     width: '60%',
// //     paddingVertical: 15,
// //     backgroundColor: '#F5F5F5',
// //     borderRadius: 30,
// //     alignItems: 'center',
// //   },
// //   buttonText: {
// //     color: '#3D4353',
// //     fontSize: 18,
// //     fontWeight: 700 ,
// //   },
// //   closeButton: {
// //     position: 'absolute',
// //     top: 60,
// //     right: 20,
// //   },
// //   image: {
// //     position: 'absolute',
// //     width: 40, // Adjust width as needed
// //     height: 40, // Adjust height as needed
// //     top: 260, // Adjust top position as needed
// //     left: 60,

// //   },
// // });

// // export default PhoneLoginScreen;

import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import PhoneInput from "react-native-phone-number-input";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import Constants from "expo-constants";

import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { supabase } from "../supabaseClient";
import { Colors } from "@/constants/Colors";

// interface PhoneLoginScreenProps {
//   navigation: any;
// }

interface Data {
  phone: string;
  countryCode: string;
  phNumWithCode: string;
}

const PhoneLoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("789012");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [data, setData] = useState<Data>({
    phone: "",
    countryCode: "",
    phNumWithCode: "+923022321605",
  });

  const handleSendOtp = async () => {
    let phone = data.phNumWithCode;

    if (phone.includes("+")) {
      phone = phone.slice(1);
    }

    const { error }: any = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setIsOtpSent(true);
    }
  };

  const handleResendOtp = async () => {
    let phone = data.phNumWithCode;

    if (phone.includes("+")) {
      phone = phone.slice(1);
    }

    const { error }: any = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "New code sent to your phone.");
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
          router.push("/(tabs)");
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

    if (phone.includes("+")) {
      phone = phone.slice(1);
    }

    const { error }: any = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Phone number verified!");
      checkOnboardingStatus();
    }
  };

  const handleBack = () => {
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
              <TouchableOpacity>
                <Text style={[styles.textsmaller, { color: "#6A74FB" }]}>
                  {" "}
                  Privacy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={[styles.textsmaller, { color: "#6A74FB" }]}>
                  {" "}
                  Policy
                </Text>
              </TouchableOpacity>
              <Text style={styles.textsmaller}>and </Text>
              <TouchableOpacity>
                <Text style={[styles.textsmaller, { color: "#6A74FB" }]}>
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
              <Ionicons name="shield-outline" size={40} color="#3F407C" />
              <Text style={styles.text2}>Verify your number</Text>
            </View>

            <OTPInputView
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
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#3D4353",
    fontSize: 18,
    fontWeight: "bold",
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
    width: "80%",
    marginBottom: 180, // Reduced marginBottom
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
});

export default PhoneLoginScreen;
