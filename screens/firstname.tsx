import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
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

const FirstNameScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [fontSize, setFontSize] = useState(36); // Default font size
  const [error, setError] = useState("");

  useEffect(() => {
    const adjustFontSize = () => {
      const maxFontSize = 36; // Max font size for shorter usernames
      const minFontSize = 18; // Minimum font size to keep text readable
      const maxCharacters = 10; // Max characters before scaling down
      const length = firstName.length;

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
  }, [firstName]);

  const setFirstNameInDB = async () => {
    const user = await getCurrentUser();

    await supabase.auth.updateUser({
      data: {
        firstName: firstName,
        fullName: firstName,
      },
    });

    const { data, error }: any = await supabase
      .from("profiles")
      .upsert({
        user_id: user.uid,
        phonenumber: user.phone,
        first_name: firstName,
      })
      .select();
  };

  const handleNext = async () => {
    const regex = /^[a-zA-Z\s]*$/;

    if (!firstName) {
      setError("Please enter at least 3 letters for your name.");
      return;
    } else if (!regex.test(firstName)) {
      setError("Please use letters only for your name.");
      return;
    } else if (firstName.length < 3) {
      setError("Please enter at least 3 letters for your name.");
      return;
    } else {
      setError("");
    }

    await setFirstNameInDB();
    router.push("/LastNameScreen");
  };

  const handleExit = () => {
    router.push("/"); //go to introscreen.
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
          <Text style={styles.text}>What's your first name?</Text>
        </View>
        <View
          style={{
            width: "74%",
            height: 150,
            justifyContent: "flex-end",
          }}
        >
          <TextInput
            style={[styles.input, { fontSize, marginBottom: error ? 30 : 60 }]} // Apply dynamic font size
            placeholder=""
            value={firstName}
            onChangeText={(text) => {
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
              setFirstName(text);
            }}
            multiline={true}
            autoFocus
          />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        <Text style={styles.textSmaller}>What your friends call you</Text>
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
    width: "60%",
    paddingVertical: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
    alignItems: "center",
    zIndex: 1,
    marginTop: 20,
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
    marginBottom: 30,
  },
});

export default FirstNameScreen;
