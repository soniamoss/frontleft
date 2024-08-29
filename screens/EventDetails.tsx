import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
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

const EventDetails = () => {
  // get params from expo-router

  const params = useLocalSearchParams();
  console.log("params: ", typeof params.event);

  const eventString = params?.event || "";
  const eventAttendeesString = params?.eventAttendees || "";

  // TODO: it's recommended to not do this, instead,
  // we should pass only the id of the event and grab the event details, ideally from react-query
  // https://reactnavigation.org/docs/params/#what-should-be-in-params
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
          "event_id, status, profiles!event_attendees_user_id_fkey(profile_image_url)"
        )
        .eq("event_id", event.id)
        .or("status.eq.going,status.eq.interested"); // Get both 'going' and 'interested' statuses

      if (error) {
        console.error("Error fetching event attendees:", error);
      } else {
        const attendingFriends = fetchedAttendees
          .filter((att: any) => att.status === "going")
          .map((att: any) => att.profiles.profile_image_url);

        const interestedFriends = fetchedAttendees
          .filter((att: any) => att.status === "interested")
          .map((att: any) => att.profiles.profile_image_url);

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
        setGoingStatus(true);
        Alert.alert("Success", "You are INTERESTED in going to this event!");
      }
    } catch (err) {
      console.error("Error going to event:", err);
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
    <View style={styles.container}>
      {/* Top Section with Back Button and Dropdown Picker */}
      <View style={styles.topSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>{"< Back"}</Text>
        </TouchableOpacity>

        <View style={styles.pickerWrapper}>
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
        </View>

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
          <TouchableOpacity onPress={openSearchPage}>
            <Image
              source={require("@/assets/images/search.png")}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.box}>
        <ImageBackground
          source={{
            uri: event.image_url || "https://via.placeholder.com/344x257",
          }}
          style={styles.imageBackground}
          imageStyle={styles.imageBackgroundStyle}
        ></ImageBackground>
        <View style={styles.artistInfo}>
          <Text style={styles.artistName}>
            {event.artist || "Unknown Artist"}
          </Text>
        </View>

        <View style={styles.boxContent}>
          <View style={styles.eventDetailsContainer}>
            <Image
              source={require("@/assets/images/calender.png")}
              style={styles.iconSmall}
            />
            <Text style={styles.eventDetails}>
              {moment(`${event.date} ${event.time}`).format("MMM DD @ hh:mmA ")}
            </Text>
            <Image
              source={require("@/assets/images/pin.png")}
              style={styles.iconSmall}
            />
            <TouchableOpacity
              onPress={() => openLocationInMaps(event.venue, event.city)}
            >
              <Text style={styles.eventDetailsLink}>
                {event.venue || "Venue not available"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Image
                source={require("@/assets/images/checkmark.png")}
                style={styles.iconSmall2}
              />
              <Text style={styles.iconLabel}>Going</Text>
              <View style={styles.attendingFriendsContainer}>
                {/* @ts-ignore */}
                {attendeesData?.attendingFriends?.length > 0 &&
                  //@ts-ignore
                  attendeesData.attendingFriends.map((imageUrl, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: imageUrl }}
                      style={styles.friendProfileImage}
                    />
                  ))}
              </View>
              <Image
                source={require("@/assets/images/star.png")}
                style={styles.iconSmall2}
              />
              <Text style={styles.iconLabel}>Interested</Text>
              <View style={styles.interestedFriendsContainer}>
                {/* @ts-ignore */}
                {attendeesData?.interestedFriends?.length > 0 &&
                  // @ts-ignore
                  attendeesData.interestedFriends.map((imageUrl, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: imageUrl }}
                      style={styles.friendProfileImage}
                    />
                  ))}
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.goingButton} onPress={handleGoing}>
          <Text style={styles.goingButtonText}>
            {goingStatus ? "You are Going" : "Going?"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.starButton} onPress={handleInterested}>
          <Image
            source={require("@/assets/images/star.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  topSection: {
    marginBottom: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 10,
    zIndex: 1001,
  },
  backText: {
    fontSize: 16,
    color: "#6A74FB",
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
  searchIcon: {
    marginLeft: 20,
    marginTop: 13,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    width: width - 40,
    height: 478,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  imageBackground: {
    height: 180,
    justifyContent: "flex-end",
  },
  imageBackgroundStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
  },
  eventDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  eventDetails: {
    marginLeft: 5,
    fontSize: 11,
    color: "#3D4353",
    fontWeight: "400",
    fontFamily: "Poppins",
  },
  eventDetailsLink: {
    marginLeft: 5,
    fontSize: 11,
    color: "#3D4353",
    fontWeight: "500",
    flexShrink: 1,
    flexWrap: "wrap",
    width: width * 0.4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 10,
  },
  iconSmall: {
    width: 24,
    height: 24,
  },
  iconSmall2: {
    width: 24,
    height: 24,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  iconWrapper: {
    flexDirection: "column",
    alignItems: "center",
  },
  iconLabel: {
    fontSize: 9,
    color: "#3D4353",
    fontWeight: "600",
    marginTop: 5,
  },
  attendingFriendsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  interestedFriendsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  friendProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  goingButton: {
    marginTop: 10,
    backgroundColor: "#3F407C",
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: "center",
    width: "50%",
    alignSelf: "center",
  },
  goingButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  starButton: {
    position: "absolute",
    top: 190,
    right: 20,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default EventDetails;
