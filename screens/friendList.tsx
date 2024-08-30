import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getCurrentUser } from "../services/userService";
import { supabase } from "../supabaseClient";

export default function ShowContacts() {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  useFocusEffect(
    useCallback(() => {
      // Fetch the latest data every time the screen comes into focus
      fetchAcceptedFriends();
    }, [])
  );

  useEffect(() => {
    // Real-time subscription to changes in the 'friendships' table
    const setupRealTimeSubscription = async () => {
      const user = await getCurrentUser();

      const subscription = supabase
        .channel("public:friendships")
        .on(
          // @ts-ignore
          "postgres_changes",
          {
            event: "insert",
            schema: "public",
            table: "friendships",
            filter: `friend_id=eq.${user.id},user_id=eq.${user.id}`,
          },
          (payload: any) => {
            console.log("Insert event detected:", payload);
            fetchAcceptedFriends();
          }
        )
        .on(
          // @ts-ignore
          "postgres_changes",
          {
            event: "update",
            schema: "public",
            table: "friendships",
            filter: `friend_id=eq.${user.id},user_id=eq.${user.id}`,
          },
          // @ts-ignore
          (payload) => {
            console.log("Update event detected:", payload);
            fetchAcceptedFriends();
          }
        )
        .on(
          // @ts-ignore
          "postgres_changes",
          {
            event: "delete",
            schema: "public",
            table: "friendships",
            filter: `friend_id=eq.${user.id},user_id=eq.${user.id}`,
          },
          (payload: any) => {
            console.log("Delete event detected:", payload);
            fetchAcceptedFriends();
          }
        )
        .subscribe((status) => {
          console.log("Subscription status:", status);
        });

      // Clean up the subscription when the component unmounts
      return () => {
        supabase.removeChannel(subscription);
      };
    };

    setupRealTimeSubscription();
  }, []);

  const fetchAcceptedFriends = async () => {
    const user = await getCurrentUser();

    const { data: friendships, error }: any = await supabase
      .from("friendships")
      .select(
        `
        user_profile:profiles!friendships_user_id_fkey (
          first_name,
          last_name,
          username,
          profile_image_url,
          user_id
        ),
        friend_profile:profiles!friendships_friend_id_fkey (
          first_name,
          last_name,
          username,
          profile_image_url,
          user_id
        )
      `
      )
      .eq("status", "accepted")
      .or(`friend_id.eq.${user.id},user_id.eq.${user.id}`);

    if (error) {
      console.error("Error fetching accepted friends:", error);
    } else {
      // Flatten the profiles and filter out the authenticated user's profile by user_id
      const allProfiles = friendships.flatMap((friendship: any) => [
        friendship.user_profile,
        friendship.friend_profile,
      ]);

      const filteredFriends = allProfiles.filter(
        (profile: any) => profile.user_id !== user.id
      );

      setAcceptedFriends(filteredFriends);
      setFilteredProfiles(filteredFriends);
    }
  };

  const handleSearch = (text: any) => {
    setSearchText(text);
    if (text) {
      const filtered = acceptedFriends.filter(
        (profile: any) =>
          profile.first_name.toLowerCase().includes(text.toLowerCase()) ||
          profile.last_name.toLowerCase().includes(text.toLowerCase()) ||
          profile.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(acceptedFriends);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.box}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.text}>Friends</Text>
        </View>

        <ScrollView style={styles.profileListContainer}>
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile: any, index) => (
              <View key={index} style={styles.profileContainer}>
                <Image
                  source={{
                    uri:
                      profile.profile_image_url ||
                      "https://via.placeholder.com/50",
                  }}
                  style={styles.profilePicture}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {profile.first_name} {profile.last_name}
                  </Text>
                  <Text style={styles.profileUsername}>{profile.username}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noProfilesText}>
              No matching profiles found
            </Text>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  box: {
    flex: 1,
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginTop: 70,
    alignSelf: "center",
    justifyContent: "flex-start",
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 50,
    borderColor: "#EBF1F7",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    placeholderTextColor: "#3D4353",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  text: {
    color: "#3D4353",
    fontSize: 24,
    fontWeight: "700",
  },
  profileListContainer: {
    flexGrow: 1,
  },
  profileContainer: {
    marginVertical: 5,
    padding: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "absolute",
    left: 0,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 60,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileUsername: {
    fontSize: 15,
    fontWeight: "400",
  },
  noProfilesText: {
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
});
