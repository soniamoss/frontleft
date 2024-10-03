import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { decode } from "base64-arraybuffer";

import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { useFocusEffect } from "expo-router";

const EditProfilePage = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(""); // Placeholder profile image
  const [avatar, setAvatar] = useState({});
  const [initalLoading, setInitialLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        setInitialLoading(true);
        try {
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

          console.log(data);

          setFirstName(data.first_name);
          setLastName(data.last_name);
          setUsername(data.username);
          setProfileImage(
            data.profile_image_url || "https://via.placeholder.com/100"
          ); // Set a default placeholder if no image exists
          setPhoneNumber(data.phonenumber);
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setInitialLoading(false);
        }
      };

      fetchProfile();
    }, [])
  );

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
      base64: true,
    });

    if (!result.canceled) {
      // @ts-ignore
      console.log(result.assets[0]?.fileName);
      setAvatar(result.assets[0]);
    }
  };

  const uploadImage = async (image: any, userId: any) => {
    try {
      const base64Image = image.base64;
      const imageExtension = image.fileName.split(".").pop();
      const base64Str = base64Image.includes("base64,")
        ? base64Image.substring(
            base64Image.indexOf("base64,") + "base64,".length
          )
        : base64Image;

      const res = decode(base64Str);

      if (!(res.byteLength > 0)) {
        console.error("[uploadToSupabase] ArrayBuffer is null");
        throw new Error("ArrayBuffer is null");
      }

      const { data, error } = await supabase.storage
        .from("profile")
        .upload(`${Date.now()}.${imageExtension}`, res, {
          contentType: `image/${imageExtension}`,
        });

      if (!data) {
        console.error("[uploadToSupabase] Data is null", error);
        return null;
      }

      const res2 = await getDownloadUrl(data.path);

      return {
        success: true,
        url: res2.data.publicUrl,
      };
    } catch (error: any) {
      console.log("error", error);
      return {
        success: false,
        message: error?.message,
      };
    }
  };

  const getDownloadUrl = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("profile")
        .getPublicUrl(path);

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const saveProfile = async () => {
    try {
      const user = await getCurrentUser();

      let pfp = profileImage;

      if (avatar?.uri) {
        const uploadedImage = await uploadImage(avatar, user.id);

        if (!uploadedImage.url) {
          return;
        }

        pfp = uploadedImage.url;
      }

      console.log(pfp);

      const { error }: any = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          username: username,
          profile_image_url: pfp,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      // console.log(user?.user_metadata);

      await supabase.auth.updateUser({
        data: {
          firstName: firstName,
          lastName: lastName,
          fullName: firstName + " " + lastName,
        },
      });

      Toast.show({
        type: "successToast",
        text1: "Your profile has been updated!",
        position: "bottom",
      });
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

  if (initalLoading && !username) {
    return (
      <ImageBackground
        style={[
          styles.container,
          { alignItems: "center", justifyContent: "center" },
        ]}
        source={require("../assets/images/friends-back.png")}
      >
        <BackButton />
        <ActivityIndicator size="large" color="#3F407C" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/friends-back.png")}
    >
      <BackButton />

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: avatar?.uri || profileImage }}
            style={styles.profileImage}
          />
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
