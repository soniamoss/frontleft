import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../supabaseClient";

const ProfilePage = () => {
  const [currentTab, setCurrentTab] = useState("going"); // State for tab selection
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>({});
  const [eventsGoing, setEventsGoing] = useState<any>([]);
  const [eventsInterested, setEventsInterested] = useState([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const user: any = await supabase.auth.getUser();

      const { data: profile, error: profileError }: any = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.data.user.id)
        .single();

      const { data: friendsData, error: friendsError }: any = await supabase
        .from("friendships")
        .select("*")
        .or(`user_id.eq.${user.data.user.id},friend_id.eq.${user.data.user.id}`)
        .eq("status", "accepted");

      const { data: eventsGoingData, error: eventsGoingError }: any =
        await supabase
          .from("event_attendees")
          .select("event_id, events!event_attendees_event_id_fkey(*), status")
          .eq("user_id", user.data.user.id)
          .eq("status", "going");

      const { data: eventsInterestedData, error: eventsInterestedError } =
        await supabase
          .from("event_attendees")
          .select("event_id, events!event_attendees_event_id_fkey(*), status")
          .eq("user_id", user.data.user.id)
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
    }
    setLoading(false);
  };

  const handleSettings = () => {
    router.push("/SettingsScreen");
  };

  const handleTabChange = (tab: any) => {
    setCurrentTab(tab);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.image} onPress={handleSettings}>
        <Image source={require("@/assets/images/settings.png")} />
      </TouchableOpacity>

      {/* Box */}
      <View style={styles.box} />

      {/* Profile Details */}
      <View style={styles.profileDetails}>
        <Image
          source={{ uri: profileData.profilePicture }}
          style={styles.profilePicture}
        />
        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.username}>{profileData.username}</Text>
        <Text style={styles.numOfFriends}>
          {profileData.numOfFriends} friends
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.eventsTabsContainer}>
        <TouchableOpacity
          style={styles.eventTab}
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
      <ScrollView style={styles.eventsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : currentTab === "going" ? (
          eventsGoing.length > 0 ? (
            eventsGoing.map((event: any) => (
              <View key={event.id} style={styles.eventBox}>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text
                  style={styles.eventDetails}
                >{`${event.date} @ ${event.time}`}</Text>
                <Text style={styles.eventVenue}>{event.venue}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noEventsText}>
              No events you're going to at this time.
            </Text>
          )
        ) : currentTab === "interested" ? (
          eventsInterested.length > 0 ? (
            eventsInterested.map((event: any) => (
              <View key={event.id} style={styles.eventBox}>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text
                  style={styles.eventDetails}
                >{`${event.date} @ ${event.time}`}</Text>
                <Text style={styles.eventVenue}>{event.venue}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noEventsText}>
              No events you're interested in at this time.
            </Text>
          )
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </ScrollView>
    </View>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    right: 110,
    top: 94,
  },
  profileDetails: {
    position: "absolute",
    top: 44,
    right: 140,
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
  box: {
    width: "96%",
    height: 140,
    backgroundColor: "#ffff",
    borderRadius: 20,
    marginTop: 80,
  },
  eventsTabsContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  eventTab: {
    paddingHorizontal: 40,
    paddingVertical: 40,
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
});

export default ProfilePage;
