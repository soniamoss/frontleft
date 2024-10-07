import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getCurrentUser } from "../services/userService";
import { supabase } from "../supabaseClient";
import BackButton from "@/components/backButton";
import FriendsIcon from "@/svg/friends";
import UserArrorDoubleIcon from "@/svg/userArrorDouble";
import BookmarkIcon from "@/svg/bookmark";
import BellIcon from "@/svg/bell";
import Toast from "react-native-toast-message";

const PrivacySettings = () => {
  const navigation = useNavigation();
  const [contactSyncEnabled, setContactSyncEnabled] = useState(false);
  const [notificationSyncEnabled, setNotificationSyncEnabled] = useState(false);
  const [privacySetting, setPrivacySetting] = useState("friends_of_friends");

  useEffect(() => {
    const fetchSettings = async () => {
      const user = await getCurrentUser();
      const { data, error }: any = await supabase
        .from("profiles")
        .select("contact_sync, privacy, notifications")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching settings:", error);
      } else {
        setContactSyncEnabled(data.contact_sync);
        setNotificationSyncEnabled(data.notifications);
        setPrivacySetting(data.privacy);
      }
    };

    fetchSettings();
  }, []);

  const handleContactSyncToggle = async () => {
    try {
      const updatedValue = !contactSyncEnabled;
      setContactSyncEnabled(updatedValue);
      const user = await getCurrentUser();
      const { error }: any = await supabase
        .from("profiles")
        .update({ contact_sync: updatedValue })
        .eq("user_id", user.id);

      if (error) throw error;

      Toast.show({
        type: "successToast",
        text1: `Contact Sync is now ${updatedValue ? "enabled" : "disabled"}`,
        position: "bottom",
      });
    } catch (error) {
      console.error("Error updating contact sync:", error);
      setContactSyncEnabled(!contactSyncEnabled);
      Toast.show({
        type: "tomatoToast",
        text1: "That didn’t work, please try again!",
        position: "bottom",
      });
    }
  };

  const handleNotificationSyncToggle = async () => {
    try {
      const updatedValue = !notificationSyncEnabled;
      setNotificationSyncEnabled(updatedValue);
      const user = await getCurrentUser();
      const { error }: any = await supabase
        .from("profiles")
        .update({ notifications: updatedValue })
        .eq("user_id", user.id);

      if (error) throw error;

      Toast.show({
        type: "successToast",
        text1: `Notification Sync is now ${
          updatedValue ? "enabled" : "disabled"
        }`,
        position: "bottom",
      });
    } catch (error) {
      console.error("Error updating notification sync:", error);
      setNotificationSyncEnabled(!notificationSyncEnabled);
      Toast.show({
        type: "tomatoToast",
        text1: "That didn’t work, please try again!",
        position: "bottom",
      });
    }
  };

  const handlePrivacyChange = async (newPrivacySetting: any) => {
    try {
      const user = await getCurrentUser();
      const { error }: any = await supabase
        .from("profiles")
        .update({ privacy: newPrivacySetting })
        .eq("user_id", user.id);

      if (error) throw error;

      setPrivacySetting(newPrivacySetting);

      Toast.show({
        type: "successToast",
        text1: `Your privacy setting is now ${newPrivacySetting.replace(
          "_",
          " "
        )}`,
        position: "bottom",
      });
    } catch (error) {
      console.error("Error updating privacy setting:", error);
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

      {/* Contact Sync */}
      <View style={styles.settingContainer}>
        <View style={styles.settingRow}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <BookmarkIcon />
            <Text style={styles.settingTitle}>Contact Sync</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#6A74FB" }}
            thumbColor={contactSyncEnabled ? "#f4f3f4" : "#f4f3f4"}
            onValueChange={handleContactSyncToggle}
            value={contactSyncEnabled}
          />
        </View>
      </View>
      <Text style={styles.settingDescription}>
        Contact syncing allows you to find friends on the app through your
        contacts.
      </Text>

      {/* Contact Sync */}
      <View style={styles.settingContainer}>
        <View style={styles.settingRow}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <BellIcon />
            <Text style={styles.settingTitle}>Notifications</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#6A74FB" }}
            thumbColor={notificationSyncEnabled ? "#f4f3f4" : "#f4f3f4"}
            onValueChange={handleNotificationSyncToggle}
            value={notificationSyncEnabled}
          />
        </View>
      </View>
      <Text style={styles.settingDescription}>
        By keeping your notifications on, you’ll be the first to know about
        exciting events, new friend requests, and important updates.
      </Text>

      {/* Privacy Settings */}
      <View style={styles.privacyContainer}>
        <Text style={styles.sectionTitle}>Default Privacy Settings</Text>
        <TouchableOpacity
          style={[
            styles.privacyOption,
            privacySetting === "friends_of_friends" &&
              styles.selectedPrivacyOption,
          ]}
          onPress={() => handlePrivacyChange("friends_of_friends")}
        >
          <UserArrorDoubleIcon />
          <View style={{ maxWidth: "75%" }}>
            <Text style={styles.privacyOptionText}>Friends of friends</Text>
            <Text style={styles.privacyOptionDescription}>
              Visible to your friends and their friends on the app
            </Text>
          </View>
          {privacySetting === "friends_of_friends" && (
            <Text style={styles.checkmark}>✔️</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.privacyOption,
            privacySetting === "friends_only" && styles.selectedPrivacyOption,
          ]}
          onPress={() => handlePrivacyChange("friends_only")}
        >
          <FriendsIcon />
          <View style={{ maxWidth: "75%" }}>
            <Text style={styles.privacyOptionText}>Friends</Text>
            <Text style={styles.privacyOptionDescription}>
              Visible to your friends on the app
            </Text>
          </View>
          {privacySetting === "friends_only" && (
            <Text style={styles.checkmark}>✔️</Text>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    flex: 1,
    padding: 20,
    paddingTop: Constants.statusBarHeight + 85,
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
  settingContainer: {
    marginBottom: 5,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 19,
    fontWeight: "700",
    fontFamily: "Poppins",
    color: "#3D4353",
  },
  settingDescription: {
    marginBottom: 30,
    fontSize: 11,
    color: "#666",
    fontFamily: "Poppins",
  },
  privacyContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Poppins",
  },
  privacyOption: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,

    flexDirection: "row",
    gap: 10,
  },
  selectedPrivacyOption: {
    borderColor: "#6A74FB",
    backgroundColor: "#f0f4ff",
  },
  privacyOptionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3D4353",
  },
  privacyOptionDescription: {
    fontSize: 11,
    color: "#666",
    marginTop: 5,
  },
  checkmark: {
    position: "absolute",
    right: 15,
    top: 15,
    fontSize: 18,
    color: "#6A74FB",
  },
});

export default PrivacySettings;
