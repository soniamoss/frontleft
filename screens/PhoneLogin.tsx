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
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { supabase } from "../supabaseClient";

const PhoneLoginScreen = () => {
  const [phone, setPhone] = useState("+1");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Create refs for the OTP TextInputs
  const otpRefs = Array.from({ length: 6 }, () => useRef(null));

  const handleSendOtp = async () => {
    const { error }: any = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setIsOtpSent(true);
    }
  };

  const handleResendOtp = async () => {
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
    const otpCode = otp.join("");
    const { error }: any = await supabase.auth.verifyOtp({
      phone,
      token: otpCode,
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

  const handleOtpChange = (index: number, value: any) => {
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input field if the current one is filled
      if (index < otp.length - 1 && value) {
        // @ts-ignore
        otpRefs[index + 1].current.focus();
      }
    } else if (value === "") {
      // Move to the previous input field if the input is cleared
      if (index > 0) {
        // @ts-ignore
        otpRefs[index - 1].current.focus();
      }
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={handleExit}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        {!isOtpSent ? (
          <>
            <Text style={styles.text}>What's your phone {"\n"} number?</Text>
            <Image
              source={require("../assets/images/phone.png")}
              style={styles.image}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <Text style={styles.textsmaller}>
              By continuing, you agree to our Privacy {"\n"}Policy and Terms of
              Service.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Send Verification Text</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.text2}>Verify your number</Text>
            <Image
              source={require("../assets/images/shield.png")}
              style={styles.image}
            />
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={otpRefs[index]}
                  style={styles.otpBox}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  keyboardType="number-pad"
                  maxLength={1}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.buttonresend}
              onPress={handleResendOtp}
            >
              <Text style={styles.textresend}>Resend Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  text: {
    marginBottom: 15, // Reduced marginBottom
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "poppins",
    color: "#3F407C",
    textAlign: "left",
    bottom: 80,
  },
  text2: {
    marginBottom: 15, // Reduced marginBottom
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "poppins",
    color: "#3F407C",
    textAlign: "left",
    bottom: 40,
  },
  textsmaller: {
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "poppins",
    textAlign: "center",
    color: "#3D4353",
    marginBottom: 60,
    zIndex: 1,
  },
  textresend: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "poppins",
    textAlign: "center",
    color: "#3B429F",
    marginBottom: 10,
    //zIndex: 1,
    //textDecorationLine: 'underline', // Add this line
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
    position: "absolute",
    bottom: 360, // Adjusted bottom position
    width: "26%",
    paddingVertical: 2,
    backgroundColor: "transparent",
    borderRadius: 30,
    alignItems: "center",
    textDecorationLine: "underline",
  },
  button: {
    position: "absolute",
    bottom: 280, // Adjusted bottom position
    width: "60%",
    paddingVertical: 15,
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
    position: "absolute",
    width: 40,
    height: 40,
    top: 220,
    left: 60,
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
});

export default PhoneLoginScreen;
