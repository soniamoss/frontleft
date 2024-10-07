import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Constants from "expo-constants";

import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { getCurrentUser } from "../services/userService";
import { supabase } from "../supabaseClient";
import UserIcon from "@/svg/user";

const LastNameScreen = ({ navigation }: any) => {
  const [lastName, setlastName] = useState("");
  const [fontSize, setFontSize] = useState(36); // Default font size
  const [error, setError] = useState("");

  useEffect(() => {
    const adjustFontSize = () => {
      const maxFontSize = 36; // Max font size for shorter usernames
      const minFontSize = 18; // Minimum font size to keep text readable
      const maxCharacters = 10; // Max characters before scaling down
      const length = lastName.length;

      if (length <= maxCharacters) {
        setFontSize(maxFontSize);
      } else {
        const newSize = Math.max(
          minFontSize,
          maxFontSize - (length - maxCharacters) * 1.5 // Adjust this factor for smoothness
        );
        setFontSize(newSize);
      }
    };

    adjustFontSize();
  }, [lastName]);

  const setLastNameInDB = async () => {
    const user = await getCurrentUser();

    await supabase.auth.updateUser({
      data: {
        lastName: lastName,
        fullName: user?.user_metadata?.fullName + " " + lastName,
      },
    });

    const { data, error }: any = await supabase
      .from("profiles")
      .upsert({
        user_id: user.uid,
        phonenumber: user.phone,
        last_name: lastName,
      })
      .select();
  };

  const handleNext = async () => {
    const regex = /^[a-zA-Z\s]*$/;

    if (!lastName) {
      setError("Please enter at least 3 letters for your name.");
      return;
    } else if (!regex.test(lastName)) {
      setError("Please use letters only for your name.");
      return;
    } else if (lastName.length < 3) {
      setError("Please enter at least 3 letters for your name.");
      return;
    } else {
      setError("");
    }

    await setLastNameInDB();
    router.push("/EmailScreen");
  };
  const handleExit = () => {
    router.push("/"); //intro screen.
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={handleExit}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>

        <View
          style={{
            marginBottom: 30,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <UserIcon />
          <Text style={styles.text}>What's your last name?</Text>
        </View>
        <View
          style={{
            width: "74%",
            height: 120,
            justifyContent: "flex-end",
          }}
        >
          <TextInput
            style={[styles.input, { fontSize, marginBottom: 30 }]} // Apply dynamic font size
            placeholder=""
            value={lastName}
            onChangeText={(text) => {
              // only allow letters and spaces
              const regex = /^[a-zA-Z\s]*$/;

              if (!text) {
                setError("Please enter at least 3 letters for your name.");
              } else if (!regex.test(text)) {
                setError("Please use letters only for your name.");
              } else if (text.length < 3) {
                setError("Please enter at least 3 letters for your name.");
              } else {
                setError("");
              }

              setlastName(text);
            }}
            multiline={true}
            autoFocus
          />
        </View>
        <View style={{ height: 40 }}>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
        <Text style={styles.textSmaller}>Your family’s claim to fame</Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingTop: Constants.statusBarHeight + 120,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "poppins",
    color: "#3F407C",
  },
  textSmaller: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "poppins",
    textAlign: "center",
    color: "#3B429F",
    marginBottom: 16,
    zIndex: 1,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  input: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "black",
    textAlign: "center",
  },
  button: {
    width: 280,
    paddingVertical: 10,
    paddingHorizontal: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
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
    zIndex: 1,
  },
  image: {
    position: "absolute",
    width: 40,
    height: 40,
    top: 246,
    left: 48,
  },
  error: {
    color: "#DF5A76",
    fontFamily: "poppins",
    fontSize: 11,
    fontWeight: "400",
  },
});

export default LastNameScreen;
