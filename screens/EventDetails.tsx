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
import DropDownPicker from "react-native-dropdown-picker";
import { getCurrentUser } from "../services/userService";
import { supabase } from "../supabaseClient";
import BackButton from "@/components/backButton";
import CalendarIcon from "@/svg/calendar";
import PinIcon from "@/svg/pin";
import CheckIcon from "@/svg/check";
import StarIcon from "@/svg/star";
import ButtonContained from "@/components/buttons/contained";
import ButtonOutlined from "@/components/buttons/outlined";

const EventDetails = () => {
  // Get params from expo-router
  const params = useLocalSearchParams();
  const eventString = params?.event || "";
  const eventAttendeesString = params?.eventAttendees || "";

  // TODO: it's recommended to not do this, instead,
  // we should pass only the id of the event and grab the event details, ideally from react-query
  // https://reactnavigation.org/docs/params/#what-should-be-in-params

  // Parse the event and attendees data passed through params
  const event = eventString ? JSON.parse(eventString) : {};
  const eventAttendees = eventAttendeesString
    ? JSON.parse(eventAttendeesString)
    : {};

  const [goingStatus, setGoingStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Los Angeles");
  const [items, setItems] = useState([
    { label: "Los Angeles", value: "Los Angeles" },
    { label: "New York", value: "New York" },
    { label: "San Francisco", value: "San Francisco" },
  ]);
  const [currentTab, setCurrentTab] = useState("Friends of Friends");
  const [attendeesData, setAttendeesData] = useState(eventAttendees); // Initialize with eventAttendees if provided
  const [loading, setLoading] = useState(!eventAttendees); // If eventAttendees is passed, skip loading

  useEffect(() => {
    // If eventAttendees is not passed, query the database
    if (!attendeesData) {
      fetchEventAttendees();
    }
  }, []);

  const fetchEventAttendees = async () => {
    setLoading(true);
    try {
      const { data: fetchedAttendees, error }: any = await supabase
        .from("event_attendees")
        .select(
          "event_id, status, profiles!event_attendees_user_id_fkey(profile_image_url, first_name)"
        )
        .eq("event_id", event.id)
        .or("status.eq.going,status.eq.interested");

      if (error) {
        console.error("Error fetching event attendees:", error);
      } else {
        const attendingFriends = fetchedAttendees
          .filter((att: any) => att.status === "going")
          .map((att: any) => ({
            firstName: att.profiles.first_name,
            profileImage: att.profiles.profile_image_url,
          }));

        const interestedFriends = fetchedAttendees
          .filter((att: any) => att.status === "interested")
          .map((att: any) => ({
            firstName: att.profiles.first_name,
            profileImage: att.profiles.profile_image_url,
          }));

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
          Alert.alert("Hey!", "You're already going to the event!");
        } else {
          Alert.alert("Error", "There was an issue adding you to the event.");
          console.error(error);
        }
      } else {
        setGoingStatus(true);
        Alert.alert("Success", "You are now going to this event!");
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
          Alert.alert("Hey!", "You're already interested in the event!");
        } else {
          Alert.alert("Error", "There was an issue adding you to the event.");
          console.error(error);
        }
      } else {
        Alert.alert("Success", "You are now interested in this event!");
        fetchEventAttendees(); // Refresh the attendees list
      }
    } catch (err) {
      console.error("Error marking interest in event:", err);
    }
  };

  const openSearchPage = () => {
    router.push("/SearchScreen");
  };

  const openLocationInMaps = (venue: any, city: any) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${venue}, ${city}`
    )}`;
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't open Google Maps", err)
    );
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ marginTop: 50 }}
      />
    );
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/friends-back.png")}
    >
      {/* Top Section with Back Button and Dropdown Picker */}
      <BackButton />
      {/* <View style={styles.pickerWrapper}>
          <DropDownPicker
            open={open}
            value={selectedLocation}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedLocation}
            setItems={setItems}
            containerStyle={styles.pickerContainer}
            style={styles.picker}
            placeholder="Select a location"
            zIndex={1000}
            textStyle={styles.dropdownText}
          />
        </View> */}
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
          <TouchableOpacity onPress={handleInterested}>
            <StarIcon />
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
              {event.attendingFriends &&
                event.attendingFriends.slice(0, 3).map((friend, idx) => (
                  <View key={idx} style={styles.friendInfo}>
                    <Image
                      source={{ uri: friend.profileImage }}
                      style={styles.friendProfileImage}
                    />
                  </View>
                ))}
              {event.attendingFriends && event.attendingFriends.length > 3 && (
                <Text style={styles.seeMore}>
                  +{event.attendingFriends.length - 3} more
                </Text>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
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
              {event.interestedFriends &&
                event.interestedFriends.slice(0, 3).map((friend, idx) => (
                  <View key={idx} style={styles.friendInfo}>
                    <Image
                      source={{ uri: friend.profileImage }}
                      style={styles.friendProfileImage}
                    />
                  </View>
                ))}
              {event.interestedFriends &&
                event.interestedFriends.length > 3 && (
                  <Text style={styles.seeMore}>
                    +{event.interestedFriends.length - 3} more
                  </Text>
                )}
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
    flexDirection: "row",
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
    color: "#3D4353",
    fontWeight: "500",
    fontFamily: "poppins",
  },
});

export default EventDetails;
