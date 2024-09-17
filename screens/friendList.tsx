import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getCurrentUser } from "../services/userService";
import { supabase } from "../supabaseClient";
import SearchBar from "@/components/SearchBar";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

// Define the profile and friendship types
interface Profile {
  first_name: string;
  last_name: string;
  username: string;
  profile_image_url: string | null;
  user_id: string;
}

interface Friendship {
  user_profile: Profile;
  friend_profile: Profile;
}

export default function ShowContacts() {
  const [acceptedFriends, setAcceptedFriends] = useState<Profile[]>([]);

  const [searchText, setSearchText] = useState<string>("");
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      fetchAcceptedFriends();
    }, [])
  );

  useEffect(() => {
    const setupRealTimeSubscription = async () => {
      const user = await getCurrentUser();

      const subscription = supabase
        .channel("public:friendships")
        .on(
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
          "postgres_changes",
          {
            event: "update",
            schema: "public",
            table: "friendships",
            filter: `friend_id=eq.${user.id},user_id=eq.${user.id}`,
          },
          (payload: any) => {
            console.log("Update event detected:", payload);
            fetchAcceptedFriends();
          }
        )
        .on(
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
        .subscribe((status: string) => {
          console.log("Subscription status:", status);
        });

      return () => {
        supabase.removeChannel(subscription);
      };
    };

    setupRealTimeSubscription();
  }, []);

  const fetchAcceptedFriends = async () => {
    setLoading(true);
    const user = await getCurrentUser();

    const { data: friendships, error } = await supabase
      .from("friendships")
      .select(
        `
        id,
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

    setLoading(false);

    if (error) {
      console.error("Error fetching accepted friends:", error);
    } else {
      const allProfiles = (friendships as Friendship[]).flatMap(
        (friendship) => [friendship.user_profile, friendship.friend_profile]
      );

      const filteredFriends = allProfiles.filter(
        (profile) => profile.user_id !== user.id
      );

      setAcceptedFriends(filteredFriends);
      setFilteredProfiles(filteredFriends);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filtered = acceptedFriends.filter(
        (profile) =>
          profile.first_name.toLowerCase().includes(text.toLowerCase()) ||
          profile.last_name.toLowerCase().includes(text.toLowerCase()) ||
          profile.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(acceptedFriends);
    }
  };

  const deleteFriend = async (friendID: string, name: string) => {
    const user = await getCurrentUser();

    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("user_id", user.id)
      .eq("friend_id", friendID);

    if (error) {
      console.error("Error deleting friend:", error);
      Toast.show({
        type: "tomatoToast",
        text1: "That didn’t work, please try again!",
        position: "bottom",
      });
    }

    fetchAcceptedFriends();

    Toast.show({
      type: "successToast",
      text1: `${name} has been removed as a friend!`,
      position: "bottom",
    });
  };

  return (
    <ImageBackground
      style={{
        flex: 1,
        paddingTop: 50,
        marginTop: -100,
      }}
      source={require("../assets/images/friends-back.png")}
    >
      <View style={styles.box}>
        <SearchBar
          value={searchText}
          setValue={handleSearch}
          placeholder="Search friends"
        />

        <FlatList
          data={filteredProfiles}
          keyExtractor={(item) => item.username}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={styles.profileContainer}>
                <Image
                  source={{
                    uri:
                      item.profile_image_url ||
                      "https://via.placeholder.com/50",
                  }}
                  style={styles.profilePicture}
                />
                <View style={[styles.profileInfo, { flex: 1 }]}>
                  <Text style={styles.profileName}>
                    {item.first_name} {item.last_name}
                  </Text>
                  <Text style={styles.profileUsername}>{item.username}</Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        `Are you sure you want to remove ${item.username} from your friends?`,
                        "You will no longer be able to see the shows that each other is attending.",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "Remove",
                            onPress: () =>
                              deleteFriend(item.user_id, item.username),
                            style: "destructive",
                          },
                        ]
                      )
                    }
                  >
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <Text style={styles.text}>
                Friends{" "}
                {(!loading || acceptedFriends.length > 0) &&
                  `(${acceptedFriends.length})`}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View>
              {loading ? (
                <ActivityIndicator color={"#6A74FB"} size="large" />
              ) : (
                <Text style={styles.noProfilesText}>
                  No matching profiles found
                </Text>
              )}
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
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
    paddingVertical: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    gap: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileInfo: {
    flex: 1,
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
