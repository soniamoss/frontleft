import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getCurrentUser } from "../services/userService";
import { supabase } from "../supabaseClient";
import BackButton from "@/components/backButton";
import CameraIcon from "@/svg/camera";
import Toast from "react-native-toast-message";

const EditProfilePage = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(""); // Placeholder profile image

  useEffect(() => {
    const fetchProfile = async () => {
      const user = await getCurrentUser();
      const { data, error }: any = await supabase
        .from("profiles")
        .select(
          "first_name, last_name, username, phonenumber, profile_image_url"
        )
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setFirstName(data.first_name);
      setLastName(data.last_name);
      setUsername(data.username);
      setProfileImage(
        data.profile_image_url || "https://via.placeholder.com/100"
      ); // Set a default placeholder if no image exists
      setPhoneNumber(data.phonenumber);
    };

    fetchProfile();
  }, []);

  const pickImage = async () => {
    // Request permission to access photos
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access the gallery is required!");
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // @ts-ignore
      setProfileImage(result.uri);
    }
  };

  const saveProfile = async () => {
    try {
      const user = await getCurrentUser();
      const { error }: any = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          username: username,
          profile_image_url: profileImage,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      Alert.alert("Success", "Your profile has been updated!");
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast.show({
        type: "tomatoToast",
        text1: "That didn’t work, please try again!",
        position: "bottom",
      });
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/friends-back.png")}
    >
      <BackButton />

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <View style={styles.cameraIcon}>
            <CameraIcon />
          </View>
        </TouchableOpacity>
        <View style={{ marginTop: 5 }}>
          <Text style={styles.nameText}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.usernameText}>@{username}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text style={styles.inputLabel}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
        <Text style={styles.inputLabel}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={[styles.input, { borderBottomWidth: 0 }, styles.disabledInput]}
          value={phoneNumber}
          editable={false}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    paddingTop: Constants.statusBarHeight + 100,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 1,
  },
  backText: {
    fontSize: 16,
    color: "#6A74FB",
  },
  profileContainer: {
    marginBottom: 30,
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    borderRadius: 10,
    gap: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -5,
    backgroundColor: "#3F407C",
    borderRadius: 15,
    padding: 5,
  },
  cameraIconImage: {
    width: 20,
    height: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  usernameText: {
    fontSize: 18,
    color: "#666",
  },
  inputContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
    paddingBottom: 0,
  },
  inputLabel: {
    fontSize: 14,
    color: "#3B429F",
    marginLeft: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderBottomWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    // backgroundColor: "#f0f0f0",
    color: "#999",
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#3F407C",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 40,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfilePage;
