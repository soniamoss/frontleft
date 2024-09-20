import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../supabaseClient";
import GroupUsersIcon from "@/svg/groupUsers";
import PostCard from "@/components/card/post";
import ProfilePostCard from "@/components/card/profilePost";
import MusicIcon from "@/svg/music";
import ButtonContained from "@/components/buttons/contained";
import BackButton from "@/components/backButton";
import { getCurrentUser } from "@/services/userService";
import { addFriend } from "@/services/friendshipService";
import Toast from "react-native-toast-message";

const ProfilePage = () => {
  const params = useLocalSearchParams();
  const userId = params?.user_id || "";
  const [currentTab, setCurrentTab] = useState("going"); // State for tab selection
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>({});
  const [eventsGoing, setEventsGoing] = useState<any>([]);
  const [eventsInterested, setEventsInterested] = useState([]);
  const [contacts, setContacts] = useState<any>([]);
  const [initalLoad, setInitalLoad] = useState(false);

  useEffect(() => {
    fetchProfileData();
    fetchContacts();
  }, []);

  const handleAddFriend = async () => {
    const user = await getCurrentUser();

    const result = await addFriend(user.id, userId);
    if (result.success) {
      Toast.show({
        type: "successToast",
        text1: "Friend request sent!",
        position: "bottom",
      });

      fetchContacts();
    } else {
      Toast.show({
        type: "tomatoToast",
        text1: "That didn’t work, please try again!",
        position: "bottom",
      });
    }
  };

  const fetchContacts = async () => {
    const user = await getCurrentUser();

    const { data, error }: any = await supabase
      .from("friendships")
      .select("*")
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    if (error) {
      console.error("Error fetching contacts:", error);
    } else {
      console.log("Contacts Data:", data);
      setContacts(data);
    }
  };

  const fetchProfileData = async () => {
    try {
      setInitalLoad(true);
      const user: any = await supabase.auth.getUser();

      const { data: profile, error: profileError }: any = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      const { data: friendsData, error: friendsError }: any = await supabase
        .from("friendships")
        .select("*")
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq("status", "accepted");

      const isFr = friendsData?.find(
        (friend: any) =>
          friend.user_id === user.id || friend.friend_id === user.id
      );

      if (isFr?.status !== "accepted") {
        setProfileData({
          profilePicture: profile.profile_image_url,
          name: `${profile.first_name} ${profile.last_name}`,
          username: `@${profile.username}`,
          numOfFriends: friendsData.length,
        });
        // setIsFriend(false);
        setLoading(false);
        return;
      }

      const { data: eventsGoingData, error: eventsGoingError }: any =
        await supabase
          .from("event_attendees")
          .select("event_id, events!event_attendees_event_id_fkey(*), status")
          .eq("user_id", userId)
          .eq("status", "going");

      const { data: eventsInterestedData, error: eventsInterestedError } =
        await supabase
          .from("event_attendees")
          .select("event_id, events!event_attendees_event_id_fkey(*), status")
          .eq("user_id", userId)
          .eq("status", "interested");

      if (
        profileError ||
        friendsError ||
        eventsGoingError ||
        eventsInterestedError
      ) {
        console.error(
          profileError ||
            friendsError ||
            eventsGoingError ||
            eventsInterestedError
        );
      } else {
        setProfileData({
          profilePicture: profile.profile_image_url,
          name: `${profile.first_name} ${profile.last_name}`,
          username: `@${profile.username}`,
          numOfFriends: friendsData.length,
        });
        setEventsGoing(eventsGoingData.map((event: any) => event.events));
        setEventsInterested(
          // @ts-ignore
          eventsInterestedData.map((event: any) => event.events)
        );
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setInitalLoad(false);
    }
    setLoading(false);
  };

  const handleTabChange = (tab: any) => {
    setCurrentTab(tab);
  };

  const isFriend = useMemo(() => {
    return contacts?.find(
      (contact: any) =>
        contact?.friend_id === userId || contact?.user_id === userId
    );
  }, [contacts, userId]);

  if (initalLoad) {
    return (
      <ImageBackground
        style={[styles.container, { justifyContent: "center" }]}
        source={require("../assets/images/friends-back.png")}
      >
        <BackButton />

        <ActivityIndicator size="large" color="#0000ff" />
      </ImageBackground>
    );
  }
  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={require("../assets/images/friends-back.png")}
    >
      <BackButton />
      <View style={styles.container}>
        {/* Box */}
        <View style={styles.box}>
          <Image
            source={{ uri: profileData.profilePicture }}
            style={styles.profilePicture}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profileData.name}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={styles.username}>{profileData.username}</Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <GroupUsersIcon />
                  <Text style={styles.numOfFriends}>
                    {profileData.numOfFriends} friends
                  </Text>
                </View>
              </View>
              {isFriend?.status !== "accepted" &&
                isFriend?.status !== "declined" && (
                  <ButtonContained
                    title={isFriend?.status === "pending" ? "Pending" : "Add"}
                    cusStyle={{
                      borderRadius: 50,
                      alignSelf: "flex-end",
                    }}
                    onPress={() => handleAddFriend()}
                    disabled={
                      isFriend?.status === "pending" ||
                      loading ||
                      isFriend?.status === "declined"
                    }
                  />
                )}
            </View>
          </View>
        </View>
        {/* Tabs */}
        <View style={styles.eventsTabsContainer}>
          <TouchableOpacity
            style={[styles.eventTab, { paddingLeft: 20 }]}
            onPress={() => handleTabChange("going")}
          >
            <Text
              style={
                currentTab === "going"
                  ? styles.eventTabActive
                  : styles.eventsTabInactive
              }
            >
              Going
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eventTab}
            onPress={() => handleTabChange("interested")}
          >
            <Text
              style={
                currentTab === "interested"
                  ? styles.eventTabActive
                  : styles.eventsTabInactive
              }
            >
              Interested
            </Text>
          </TouchableOpacity>
        </View>

        {/* Events Section */}
        <ScrollView
          style={styles.eventsContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading && <ActivityIndicator size="large" color="#0000ff" />}

          {!loading && isFriend?.status === "accepted" && (
            <React.Fragment>
              {currentTab === "going" &&
                (eventsGoing.length > 0 ? (
                  eventsGoing.map((event: any, index: number) => {
                    return (
                      <ProfilePostCard
                        key={event.id}
                        event={event}
                        index={index}
                      />
                    );
                  })
                ) : (
                  <Text style={styles.noEventsText}>
                    No events they're going to at this time.
                  </Text>
                ))}

              {currentTab === "interested" &&
                (eventsInterested.length > 0 ? (
                  eventsInterested.map((event: any, index: number) => (
                    <ProfilePostCard
                      key={event.id}
                      event={event}
                      index={index}
                      isInterested={true}
                    />
                  ))
                ) : (
                  <View style={styles.noEventsContainer}>
                    <Text style={[styles.noEventsText, { marginTop: 0 }]}>
                      No events they're interested in at this time.
                    </Text>
                    <MusicIcon />
                  </View>
                ))}
            </React.Fragment>
          )}

          {!loading && isFriend?.status !== "accepted" && (
            <View style={styles.noEventsContainer}>
              <Text style={[styles.noEventsText, { marginTop: 0 }]}>
                You gotta be friends to see their events!
              </Text>
              <Image
                source={require("../assets/icons/emoji.png")}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                }}
              />
            </View>
          )}
        </ScrollView>
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
    paddingVertical: 40,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3D4353",
    fontFamily: "Poppins",
  },
  username: {
    fontSize: 12,
    color: "#3D4353",
    fontFamily: "Poppins",
    marginBottom: 5,
  },
  numOfFriends: {
    fontSize: 12,
    color: "#3D4353",
    fontFamily: "Poppins",
  },
  box: {
    width: "96%",
    backgroundColor: "#ffff",
    borderRadius: 20,
    marginTop: 80,
    flexDirection: "row",
    padding: 10,
    paddingVertical: 20,
    alignItems: "center",
    gap: 10,
  },
  eventsTabsContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    marginBottom: 5,
  },
  eventTab: {
    paddingHorizontal: 40,
    paddingVertical: 40,
    paddingBottom: 10,
  },
  eventTabActive: {
    color: "#3B429F",
    fontWeight: "700",
    fontSize: 14,
  },
  eventsTabInactive: {
    color: "#9E9E9E",
    fontWeight: "700",
    fontSize: 14,
  },
  eventsContainer: {
    flexGrow: 1,
    width: "100%",
  },
  noEventsText: {
    color: "#3B429F",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  eventBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventDetails: {
    fontSize: 14,
    color: "#666",
  },
  eventVenue: {
    fontSize: 14,
    color: "#999",
  },
  statusButton: {
    backgroundColor: "#3B429F",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1,
  },
  eventImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  noEventsContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    gap: 10,
  },
});

export default ProfilePage;
