import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import Constants from "expo-constants";

import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getCurrentUser } from "../services/userService";
import { supabase } from "../supabaseClient";
import PrivacyIcon from "@/svg/privacy";
import ChevronIcon from "@/svg/chevron";
import ContactIcon from "@/svg/contact";
import BackButton from "@/components/backButton";

const ProfilePage = () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [profileData, setProfileData] = useState({
    profilePicture: "",
    firstName: "",
    lastName: "",
    username: "",
    numOfFriends: 0,
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const user: any = await getCurrentUser();
      const { data: profile, error }: any = await supabase
        .from("profiles")
        .select("profile_image_url, first_name, last_name, username")
        .eq("user_id", user.id)
        .single();

      const { data: friendsCount, error: friendsError }: any = await supabase
        .from("friendships")
        .select("*", { count: "exact" })
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq("status", "accepted");

      if (error || friendsError) throw error || friendsError;

      setProfileData({
        profilePicture: profile.profile_image_url,
        firstName: profile.first_name,
        lastName: profile.last_name,
        username: profile.username,
        numOfFriends: friendsCount.length || 0,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleProfileEdit = () => {
    router.push("/ProfileEditScreen"); // Navigate to the profile edit page
  };

  const handlePrivacySettings = () => {
    router.push("/PrivacySettingsScreen"); // Navigate to the privacy settings page
  };

  const handleContactUs = () => {
    const email = "faryar48@gmail.com";
    const subject = "[App Name]: I have a question...";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailtoUrl);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/friends-back.png")}
    >
      <BackButton />

      {/* Profile Details */}
      <TouchableOpacity
        style={styles.profileDetails}
        onPress={handleProfileEdit}
      >
        <Image
          source={{ uri: profileData.profilePicture }}
          style={styles.profilePicture}
        />
        <View style={styles.profileTextContainer}>
          <Text
            style={styles.name}
          >{`${profileData.firstName} ${profileData.lastName}`}</Text>
          <Text style={styles.username}>{profileData.username}</Text>
          <Text style={styles.numOfFriends}>
            {profileData.numOfFriends} friends
          </Text>
        </View>
      </TouchableOpacity>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePrivacySettings}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <PrivacyIcon />
            <Text style={styles.buttonText}>Privacy</Text>
          </View>
          <ChevronIcon />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleContactUs}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <ContactIcon />
            <Text style={styles.buttonText}>Contact Us</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.text}>Name</Text>
        <Text style={styles.textsmaller}>Where events and friends meet</Text>

        <TouchableOpacity
          style={styles.buttonLog}
          onPress={() => {
            logout();
          }}
        >
          <Text style={styles.buttonTextLog}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 2.1.12</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Constants.statusBarHeight + 100,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileDetails: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
  },
  profileTextContainer: {
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  username: {
    fontSize: 18,
    color: "#666",
  },
  numOfFriends: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 19,
    color: "#3D4353",
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 80,
    fontWeight: "bold",
    fontFamily: "Chicle",
    color: "#3F407C",
    marginBottom: 5,
  },
  textsmaller: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Chicle",
    color: "#3F407C",
  },
  buttonLog: {
    paddingVertical: 10,
  },
  buttonTextLog: {
    color: "#DF5A76",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "poppins",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  versionText: {
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "poppins",
    textAlign: "center",
    color: "#838383",
    marginBottom: 16,
    zIndex: 1,
  },
});

export default ProfilePage;
