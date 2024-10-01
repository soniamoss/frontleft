import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getCurrentUser } from "../services/userService";
import { supabase } from "../supabaseClient";
import SearchBar from "@/components/SearchBar";
import { AntDesign } from "@expo/vector-icons";
import ButtonOutlined from "@/components/buttons/outlined";
import Toast from "react-native-toast-message";
import { sendNotifications } from "@/utils/notification";

export default function ShowContacts() {
  const [matchingProfiles, setMatchingProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]); // State for friend requests
  const [sentRequests, setSentRequests] = useState([]); // State for sent requests
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("received"); // State for tab selection

  const fetchRequests = useCallback(async (setLoading?: any) => {
    if (setLoading) setLoading(true);
    const user = await getCurrentUser();
    if (!user) {
      console.error("Could not retrieve current user data.");
      return;
    }

    // Fetch received friend requests
    const { data: receivedData, error: receivedError }: any = await supabase
      .from("friendships")
      .select(
        `
        *,
        profiles!fk_user_id (
          user_id,
          first_name,
          last_name,
          username
        )
      `
      )
      .eq("friend_id", user.id)
      .eq("status", "pending");

    if (receivedError) {
      console.error("Error fetching received friend requests:", receivedError);

      if (setLoading) setLoading(false);
    } else {
      setFriendRequests(receivedData);
    }

    // Fetch sent friend requests
    const { data: sentData, error: sentError }: any = await supabase
      .from("friendships")
      .select(
        `
        *,
        profiles!fk_friend_id (
          user_id,
          first_name,
          last_name,
          username
        )
      `
      )
      .eq("user_id", user.id)
      .eq("status", "pending");

    if (sentError) {
      console.error("Error fetching sent friend requests:", sentError);
    } else {
      setSentRequests(sentData);
    }

    if (setLoading) setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Fetch the latest data every time the screen comes into focus
      fetchRequests(setLoading);
    }, [fetchRequests])
  );

  useEffect(() => {
    // Real-time subscription to changes in the 'friendships' table
    const subscription = supabase
      .channel("public:friendships")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friendships" },
        (payload) => {
          console.log("Real-time change detected:", payload);
          fetchRequests(); // Refresh the friend requests when a change is detected
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchRequests]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filtered = matchingProfiles.filter(
        (profile: any) =>
          profile.first_name.toLowerCase().includes(text.toLowerCase()) ||
          profile.last_name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(matchingProfiles);
    }
  };

  const handleAcceptRequest = async (
    requestId: any,
    name: any,
    friendId: any
  ) => {
    // Update the friendship status to "accepted"
    const user = await getCurrentUser();
    const { error }: any = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (error) {
      console.error("Error updating friendship status:", error);
      Toast.show({
        type: "tomatoToast",
        text1: "That didn’t work, please try again!",
        position: "bottom",
      });
    } else {
      // Refresh the friend requests list after the update

      Toast.show({
        type: "successToast",
        text1: `You and ${name} are now friends!`,
        position: "bottom",
      });

      const res = await sendNotifications({
        userId: friendId,
        title: "Friend Request",
        body: `${name} accepted your friend request!`,
        data: {
          url: "/FirendsProfile",
          params: {
            user_id: user.id,
          },
        },
      });

      fetchRequests();
    }
  };

  const handleTabChange = (tab: any) => {
    setCurrentTab(tab);
  };

  const handleDeclineRequest = async (requestId: any, name: any) => {
    const { error }: any = await supabase
      .from("friendships")
      .update({ status: "declined" })
      .eq("id", requestId);

    if (error) {
      console.error("Error updating friendship status:", error);
      Toast.show({
        type: "tomatoToast",
        text1: "That didn’t work, please try again!",
        position: "bottom",
      });
    } else {
      Toast.show({
        type: "successToast",
        text1: `You removed the request from ${name}`,
        position: "bottom",
      });

      fetchRequests();
    }
  };

  const handleDeleteRequest = async (requestId: any) => {
    const { error }: any = await supabase
      .from("friendships")
      .delete()
      .eq("id", requestId);

    if (error) {
      console.error("Error deleting friendship:", error);
      Toast.show({
        type: "tomatoToast",
        text1: "That didn’t work, please try again!",
        position: "bottom",
      });
    } else {
      Toast.show({
        type: "successToast",
        text1: "Friend request deleted",
        position: "bottom",
      });

      fetchRequests();
    }
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

        <View style={styles.headerContainer}>
          <Text style={styles.text}>
            Requests{" "}
            {(!loading ||
              (currentTab === "sent" && sentRequests.length > 0) ||
              (currentTab === "received" && friendRequests.length > 0)) &&
              `(${
                currentTab === "received"
                  ? friendRequests.length
                  : sentRequests.length
              })`}
          </Text>
        </View>

        <View style={styles.requestsTabsContainer}>
          <TouchableOpacity
            style={[styles.requestTab, { paddingLeft: 0 }]}
            onPress={() => handleTabChange("received")}
          >
            <Text
              style={
                currentTab === "received"
                  ? styles.requestTabActive
                  : styles.requestTabInactive
              }
            >
              Received
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.requestTab}
            onPress={() => handleTabChange("sent")}
          >
            <Text
              style={
                currentTab === "sent"
                  ? styles.requestTabActive
                  : styles.requestTabInactive
              }
            >
              Sent
            </Text>
          </TouchableOpacity>
        </View>

        {currentTab === "received" && (
          <FlatList
            data={friendRequests}
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
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {item?.profiles?.first_name} {item?.profiles?.last_name}
                    </Text>
                    <Text style={styles.profileUsername}>
                      {item?.profiles?.username}
                    </Text>
                  </View>
                  <ButtonOutlined
                    title="Accept"
                    onPress={() =>
                      handleAcceptRequest(
                        item.id,
                        item?.profiles?.username,
                        item?.profiles?.user_id
                      )
                    }
                    cusStyle={{
                      borderRadius: 50,
                    }}
                  />

                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        `Are you sure you want to delete the request from ${item?.profiles?.username}?`,
                        "You will no longer see this friend request.",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "Remove",
                            onPress: () =>
                              handleDeclineRequest(
                                item.id,
                                item?.profiles?.username
                              ),
                            style: "destructive",
                          },
                        ]
                      )
                    }
                  >
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              );
            }}
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
        )}
        {currentTab === "sent" && (
          <FlatList
            data={sentRequests}
            keyExtractor={(item) => item.username}
            renderItem={({ item, index }) => {
              const name = `${item?.profiles?.first_name} ${item?.profiles?.last_name}`;
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
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {item?.profiles?.first_name} {item?.profiles?.last_name}
                    </Text>
                    <Text style={styles.profileUsername}>
                      {item?.profiles?.username}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        `Are you sure you want to delete the request sent  to ${item?.profiles?.username}?`,
                        `${name} will no longer see this friend request.`,
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "Remove",
                            onPress: () => handleDeleteRequest(item.id),
                            style: "destructive",
                          },
                        ]
                      )
                    }
                  >
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              );
            }}
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
        )}

        {/* Friend Requests Section */}
        {/* <ScrollView style={styles.requestsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : currentTab === "received" ? (
            friendRequests.length > 0 ? (
              friendRequests.map((request: any, index) => (
                <View key={index} style={styles.requestContainer}>
                  <Text style={styles.profileName}>
                    {request.profiles.first_name} {request.profiles.last_name}{" "}
                    {request.profiles.username}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.statusButton}
                      onPress={() => handleAcceptRequest(request.id)}
                    >
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noRequestsText}>
                No requests received at this time. Go add some friends!
              </Text>
            )
          ) : sentRequests.length > 0 ? (
            sentRequests.map((request: any, index) => (
              <View key={index} style={styles.requestContainer}>
                <Text style={styles.profileName}>
                  {request.profiles.first_name} {request.profiles.last_name}{" "}
                  {request.profiles.username}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noRequestsText}>
              No requests sent at this time. Go add some friends!
            </Text>
          )}
        </ScrollView> */}
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
    gap: 2,
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
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10,
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

  requestsTabsContainer: {
    flexDirection: "row",
    marginBottom: 5, // Adjust margin to bring tabs closer to the text
    paddingHorizontal: 0, // Align tabs to the left
  },
  requestTab: {
    paddingHorizontal: 15, // Adjust padding to space tabs
  },
  requestTabActive: {
    color: "#3B429F",
    fontWeight: "bold",
  },
  requestTabInactive: {
    color: "#9E9E9E",
  },
  requestsText: {
    color: "#3D4353",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10, // Adjust margin to align with tabs
  },
  requestsContainer: {
    flexGrow: 1,
  },
  requestContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between", // Align items to the left and right
    alignItems: "center",
  },
});
