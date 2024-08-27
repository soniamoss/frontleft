import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getCurrentUser } from "../services/userService";
import { supabase } from "../supabaseClient";

const PrivacySettings = () => {
  const navigation = useNavigation();
  const [contactSyncEnabled, setContactSyncEnabled] = useState(false);
  const [privacySetting, setPrivacySetting] = useState("friends_of_friends");

  useEffect(() => {
    const fetchSettings = async () => {
      const user = await getCurrentUser();
      const { data, error }: any = await supabase
        .from("profiles")
        .select("contact_sync, privacy")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching settings:", error);
      } else {
        setContactSyncEnabled(data.contact_sync);
        setPrivacySetting(data.privacy);
      }
    };

    fetchSettings();
  }, []);

  const handleContactSyncToggle = async () => {
    try {
      const user = await getCurrentUser();
      const updatedValue = !contactSyncEnabled;
      const { error }: any = await supabase
        .from("profiles")
        .update({ contact_sync: updatedValue })
        .eq("user_id", user.id);

      if (error) throw error;

      setContactSyncEnabled(updatedValue);
      Alert.alert(
        "Success",
        `Contact Sync is now ${updatedValue ? "enabled" : "disabled"}`
      );
    } catch (error) {
      console.error("Error updating contact sync:", error);
      Alert.alert(
        "Error",
        "There was an issue updating your contact sync settings. Please try again."
      );
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
      Alert.alert(
        "Success",
        `Your privacy setting is now ${newPrivacySetting.replace("_", " ")}`
      );
    } catch (error) {
      console.error("Error updating privacy setting:", error);
      Alert.alert(
        "Error",
        "There was an issue updating your privacy setting. Please try again."
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

      {/* Contact Sync */}
      <View style={styles.settingContainer}>
        <View style={styles.settingRow}>
          <Text style={styles.settingTitle}>Contact Sync</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#6A74FB" }}
            thumbColor={contactSyncEnabled ? "#f4f3f4" : "#f4f3f4"}
            onValueChange={handleContactSyncToggle}
            value={contactSyncEnabled}
          />
        </View>
        <Text style={styles.settingDescription}>
          Contact syncing allows you to find friends on the app through your
          contacts.
        </Text>
      </View>

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
          <Text style={styles.privacyOptionText}>Friends of friends</Text>
          <Text style={styles.privacyOptionDescription}>
            Visible to your friends and their friends on the app
          </Text>
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
          <Text style={styles.privacyOptionText}>Friends</Text>
          <Text style={styles.privacyOptionDescription}>
            Visible to your friends on the app
          </Text>
          {privacySetting === "friends_only" && (
            <Text style={styles.checkmark}>✔️</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  settingContainer: {
    marginBottom: 30,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  settingDescription: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  privacyContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  privacyOption: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  selectedPrivacyOption: {
    borderColor: "#6A74FB",
    backgroundColor: "#f0f4ff",
  },
  privacyOptionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  privacyOptionDescription: {
    fontSize: 14,
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
