import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getCurrentUser } from "../services/userService";
import { supabase } from "../supabaseClient";

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
      Alert.alert(
        "Error",
        "There was an issue updating your profile. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>{"< Back"}</Text>
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <View style={styles.cameraIcon}>
            <Image
              source={require("@/assets/images/camera-icon.png")}
              style={styles.cameraIconImage}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.nameText}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.usernameText}>@{username}</Text>
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
          style={[styles.input, styles.disabledInput]}
          value={phoneNumber}
          editable={false}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "#f5f5f5",
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
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6A74FB",
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
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#6A74FB",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  saveButton: {
    backgroundColor: "#6A74FB",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfilePage;
