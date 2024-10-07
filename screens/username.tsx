import { AntDesign, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Constants from "expo-constants";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import UserCheckIcon from "@/svg/userCheck";
import UserExclaimIcon from "@/svg/userExclaim";

const UsernameScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isUsernameCheck, setIsUsernameCheck] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [unChecking, setUnChecking] = useState(false);
  const [fontSize, setFontSize] = useState(36); // Default font size

  useEffect(() => {
    const adjustFontSize = () => {
      const maxFontSize = 36; // Max font size for shorter usernames
      const minFontSize = 18; // Minimum font size to keep text readable
      const maxCharacters = 10; // Max characters before scaling down
      const length = username.length;

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
  }, [username]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getUserName();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [username]);

  const setUserNameInDB = async () => {
    const user = await getCurrentUser();

    const { data, error }: any = await supabase
      .from("profiles")
      .upsert({
        user_id: user.uid,
        phonenumber: user.phone,
        username: username,
        onboarding_complete: true,
      })
      .select();
  };

  const handleNext = async () => {
    if (username.length < 3) {
      setError("Please enter at least 3 letters for your username.");
      return;
    } else {
      setError("");
    }

    if (!isUsernameAvailable) {
      return;
    }

    await setUserNameInDB();
    router.push("/AllowContactsScreen");
  };

  const handleExit = () => {
    router.push("/"); //go to introscreen.
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const getUserName = async () => {
    if (!username || username.length < 3 || username.trim() === "") {
      setIsUsernameCheck(false);
      setIsUsernameAvailable(false);
      return;
    }
    try {
      setUnChecking(true);

      const { data, error }: any = await supabase
        .from("profiles")
        .select("username")
        .ilike("username", username)
        .single();

      console.log(data);

      if (data) {
        setIsUsernameAvailable(false);
      } else {
        setIsUsernameAvailable(true);
      }
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setIsUsernameCheck(true);
      setUnChecking(false);
    }
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
          <Text style={styles.text}>Create a username</Text>
        </View>
        <View
          style={{
            width: "74%",
            height: 150,
            justifyContent: "flex-end",
          }}
        >
          <TextInput
            style={[styles.input, { fontSize, marginBottom: 30 }]} // Apply dynamic font size
            placeholder=""
            value={username}
            onChangeText={(text) => {
              setIsUsernameCheck(false);
              if (text.length < 3) {
                setError("Please enter at least 3 letters for your username.");
              } else {
                setError("");
              }

              setUsername(text);
            }}
            multiline={true}
            autoFocus
          />
        </View>
        <View style={{ height: 40 }}>
          {isUsernameCheck ? (
            <React.Fragment>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {isUsernameAvailable ? <UserCheckIcon /> : <UserExclaimIcon />}
                <Text
                  style={[
                    styles.textSmaller,
                    { marginBottom: 0 },
                    { color: isUsernameAvailable ? "#009C5F" : "#DF5A76" },
                  ]}
                >
                  {isUsernameAvailable ? "Available" : "Not Available"}
                </Text>
              </View>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {error && (
                <Text style={[styles.error, { marginBottom: 0 }]}>{error}</Text>
              )}
            </React.Fragment>
          )}
        </View>
        <Text style={[styles.textSmaller]}>Have fun with it</Text>
        <TouchableOpacity
          style={[styles.button, !isUsernameAvailable && { opacity: 0.5 }]}
          onPress={handleNext}
          disabled={!isUsernameAvailable && unChecking}
        >
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
    marginBottom: 30,
  },
});

export default UsernameScreen;
