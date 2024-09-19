import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import Constants from "expo-constants";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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
import BackButton from "@/components/backButton";
import CalendarIcon from "@/svg/calendar";
import PinIcon from "@/svg/pin";
import CheckIcon from "@/svg/check";
import StarIcon from "@/svg/star";
import ButtonContained from "@/components/buttons/contained";
import StarFillIcon from "@/svg/starfill";
import Toast from "react-native-toast-message";

const EventDetails = () => {
  const user = getCurrentUser();
  const params = useLocalSearchParams();
  const eventString = params?.event || "";
  const eventAttendeesString = params?.eventAttendees || "";

  const event = eventString ? JSON.parse(eventString) : {};
  const eventAttendees = eventAttendeesString
    ? JSON.parse(eventAttendeesString)
    : {};

  const [goingStatus, setGoingStatus] = useState(false);
  const [interestedStatus, setInterestedStatus] = useState(false);

  const [currentTab, setCurrentTab] = useState("Friends of Friends");
  const [attendeesData, setAttendeesData] = useState(eventAttendees);
  const [loading, setLoading] = useState(!eventAttendees);

  useEffect(() => {
    fetchEventAttendees();
  }, []);

  const fetchEventAttendees = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      const { data: fetchedAttendees, error }: any = await supabase
        .from("event_attendees")
        .select(
          "event_id, status, profiles!event_attendees_user_id_fkey(profile_image_url, first_name, last_name, username, user_id)"
        )
        .eq("event_id", event.id)
        .or("status.eq.going,status.eq.interested");

      if (error) {
        console.error("Error fetching event attendees:", error);
      } else {
        const attendingFriends = fetchedAttendees
          .filter((att: any) => att.status === "going")
          .map((att: any) => ({
            user_id: att.profiles.user_id,
            firstName: att.profiles.first_name,
            lastName: att.profiles.last_name,
            username: att.profiles.username,
            profileImage: att.profiles.profile_image_url,
          }));

        if (
          attendingFriends.findIndex(
            (friend: any) => friend.user_id === user.id
          ) !== -1
        ) {
          setGoingStatus(true);
        }

        const interestedFriends = fetchedAttendees
          .filter((att: any) => att.status === "interested")
          .map((att: any) => ({
            user_id: att.profiles.user_id,
            firstName: att.profiles.first_name,
            lastName: att.profiles.last_name,
            username: att.profiles.username,
            profileImage: att.profiles.profile_image_url,
          }));

        if (
          interestedFriends.findIndex(
            (friend: any) => friend.user_id === user.id
          ) !== -1
        ) {
          setInterestedStatus(true);
        }

        setAttendeesData({ attendingFriends, interestedFriends });
      }
    } catch (error) {
      console.error("Error fetching event attendees:", error);
    }
    setLoading(false);
  };

  const handleGoing = async () => {
    try {
      const user = await getCurrentUser();
      const { data, error }: any = await supabase
        .from("event_attendees")
        .insert([{ event_id: event.id, user_id: user.id, status: "going" }]);

      if (error) {
        if (error.code === "23505") {
          Toast.show({
            type: "tomatoToast",
            text1: "You're already going to the show!",
            position: "bottom",
          });
        } else {
          Toast.show({
            type: "tomatoToast",
            text1: "That didn’t work, please try again!",
            position: "bottom",
          });
          console.error(error);
        }
      } else {
        setGoingStatus(true);
        Toast.show({
          type: "successToast",
          text1: `You’re going to the show!`,
          position: "bottom",
        });
        fetchEventAttendees(); // Refresh the attendees list
      }
    } catch (err) {
      console.error("Error going to event:", err);
    }
  };

  const handleInterested = async () => {
    try {
      const user = await getCurrentUser();
      const { data, error }: any = await supabase
        .from("event_attendees")
        .insert([
          { event_id: event.id, user_id: user.id, status: "interested" },
        ]);

      if (error) {
        if (error.code === "23505") {
          Toast.show({
            type: "tomatoToast",
            text1: "You're already interested in the show!",
            position: "bottom",
          });
        } else {
          Toast.show({
            type: "tomatoToast",
            text1: "That didn’t work, please try again!",
            position: "bottom",
          });
          console.error(error);
        }
      } else {
        setInterestedStatus(true);
        Toast.show({
          type: "successToast",
          text1: `You’re interested in the show!`,
          position: "bottom",
        });
        fetchEventAttendees(); // Refresh the attendees list
      }
    } catch (err) {
      console.error("Error marking interest in event:", err);
    }
  };

  const openLocationInMaps = (venue: any, city: any) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${venue}, ${city}`
    )}`;
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't open Google Maps", err)
    );
  };

  // if (loading) {
  //   return (
  //     <ActivityIndicator
  //       size="large"
  //       color="#0000ff"
  //       style={{ marginTop: 50 }}
  //     />
  //   );
  // }

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/friends-back.png")}
    >
      <BackButton />

      <View style={styles.tabContainer}>
        <View style={styles.tabWrapper}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setCurrentTab("Friends of Friends")}
          >
            <Text
              style={
                currentTab === "Friends of Friends"
                  ? styles.tabTextActive
                  : styles.tabTextInactive
              }
            >
              Friends of Friends
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setCurrentTab("My Friends")}
          >
            <Text
              style={
                currentTab === "My Friends"
                  ? styles.tabTextActive
                  : styles.tabTextInactive
              }
            >
              My Friends
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.box}>
        <ImageBackground
          source={{
            uri: event.image_url || "https://via.placeholder.com/344x257",
          }}
          style={styles.imageBackground}
          imageStyle={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        />
        <View style={styles.artistInfo}>
          <Text style={styles.artistName}>
            {event.artist || "Unknown Artist"}
          </Text>
          <TouchableOpacity
            onPress={handleInterested}
            disabled={interestedStatus}
          >
            {interestedStatus ? <StarFillIcon /> : <StarIcon />}
          </TouchableOpacity>
        </View>

        <View style={{ padding: 10 }}>
          <View style={styles.eventDetailsContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                gap: 5,
              }}
            >
              <CalendarIcon />
              <Text style={styles.eventDetails}>
                {moment(`${event.date} ${event.time}`).format(
                  "MMM DD @ hh:mmA "
                )}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                gap: 5,
              }}
            >
              <PinIcon />
              <TouchableOpacity
                onPress={() => openLocationInMaps(event.venue, event.city)}
              >
                {/* Add your function to open location maps here */}
                <Text style={styles.eventDetailsLink}>
                  {event.venue || "Venue not available"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 5,
            }}
          >
            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                width: 58,
              }}
            >
              <CheckIcon />
              <Text style={styles.eventDetails}>Going</Text>
            </View>
            <View style={styles.interestedFriendsContainer}>
              {attendeesData.attendingFriends &&
                attendeesData.attendingFriends
                  .slice(0, 3)
                  .map((friend, idx) => (
                    <View key={idx} style={styles.friendInfo}>
                      <Image
                        source={{ uri: friend.profileImage }}
                        style={styles.friendProfileImage}
                      />
                      <Text style={styles.friendName}>{friend.firstName}</Text>
                    </View>
                  ))}
              {attendeesData.attendingFriends &&
                attendeesData.attendingFriends.length > 3 && (
                  <Text style={styles.seeMore}>
                    +{attendeesData.attendingFriends.length - 3} more
                  </Text>
                )}
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/EventUsers",
                    params: {
                      eventAttendees: JSON.stringify(attendeesData),
                      currentTab: "attendingFriends",
                    },
                  });
                }}
              >
                <Text style={styles.seeMore}>See more &#62;</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                width: 58,
              }}
            >
              <StarIcon />
              <Text style={styles.eventDetails}>Interested</Text>
            </View>
            <View style={styles.interestedFriendsContainer}>
              {attendeesData.interestedFriends &&
                attendeesData.interestedFriends
                  .slice(0, 3)
                  .map((friend, idx) => (
                    <View key={idx} style={styles.friendInfo}>
                      <Image
                        source={{ uri: friend.profileImage }}
                        style={styles.friendProfileImage}
                      />
                      <Text style={styles.friendName}>{friend.firstName}</Text>
                    </View>
                  ))}
              {attendeesData.interestedFriends &&
                attendeesData.interestedFriends.length > 3 && (
                  <Text style={styles.seeMore}>
                    +{attendeesData.interestedFriends.length - 3} more
                  </Text>
                )}

              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/EventUsers",
                    params: {
                      eventAttendees: JSON.stringify(attendeesData),
                      currentTab: "interestedFriends",
                    },
                  });
                }}
              >
                <Text style={styles.seeMore}>See more &#62;</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ButtonContained
            title="Going?"
            cusStyle={{
              alignSelf: "center",
              borderRadius: 50,
              paddingHorizontal: 20,
            }}
            onPress={handleGoing}
            disabled={goingStatus}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    paddingTop: Constants.statusBarHeight + 30,
  },
  topSection: {
    marginBottom: 20,
    position: "relative",
  },

  pickerWrapper: {
    width: "50%",
    alignSelf: "center",
    marginBottom: 10,
    zIndex: 1000,
  },
  pickerContainer: {
    height: 50,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dropdownText: {
    color: "#3F407C",
    fontWeight: "700",
    fontSize: 15,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  tabWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 5,
  },
  tabTextActive: {
    color: "#6A74FB",
    fontWeight: "bold",
    fontSize: 16,
  },
  tabTextInactive: {
    color: "#9E9E9E",
    fontWeight: "bold",
    fontSize: 16,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    width: width - 40,
    paddingBottom: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  imageBackground: {
    height: 180,
    justifyContent: "flex-end",
    paddingHorizontal: 1,
    paddingBottom: 10,
  },
  artistInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  artistName: {
    fontFamily: "poppins",
    fontWeight: "700",
    fontSize: 19,
    color: "#3D4353",
  },
  boxContent: {
    padding: 15,
    paddingTop: 5,
    paddingLeft: 10,
  },
  eventDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: "#DADADA",
  },
  eventDetails: {
    fontSize: 11,
    color: "#3D4353",
    fontWeight: "400",
    fontFamily: "poppins",
  },
  eventDetailsLink: {
    fontSize: 11,
    color: "#3D4353",
    fontWeight: "500",
    flexShrink: 1,
    flexWrap: "wrap",
    width: width * 0.4,
  },
  iconSmall: {
    width: 24,
    height: 24,
  },
  attendingFriendsContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginRight: 10,
  },
  interestedFriendsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  friendInfo: {
    alignItems: "center",
  },
  friendProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  friendName: {
    fontSize: 12,
    color: "#3D4353",
  },
  seeMore: {
    fontSize: 12,
    color: "#6A74FB",
    fontWeight: "500",
    fontFamily: "poppins",
  },
});

export default EventDetails;
