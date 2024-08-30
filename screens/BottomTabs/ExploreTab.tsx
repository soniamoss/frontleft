import { router } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { supabase } from "../../supabaseClient";

const ExploreTab = () => {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Los Angeles");
  const [items, setItems] = useState([
    { label: "Los Angeles", value: "Los Angeles" },
    { label: "New York", value: "New York" },
    { label: "San Francisco", value: "San Francisco" },
  ]);
  const [currentTab, setCurrentTab] = useState("Friends of Friends");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [selectedLocation]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch events in the selected city
      const { data: eventsData, error: eventsError }: any = await supabase
        .from("events")
        .select("*")
        .eq("city", selectedLocation);

      if (eventsError) {
        console.error("Error fetching events:", eventsError);
      } else {
        const upcomingEvents = eventsData
          .filter((event: any) =>
            moment(`${event.date} ${event.time}`).isAfter(moment())
          )
          .sort((a: any, b: any) =>
            moment(`${a.date} ${a.time}`).diff(moment(`${b.date} ${b.time}`))
          );

        // Fetch event attendees with their profile images and statuses
        const eventIds = upcomingEvents.map((event: any) => event.id);
        const { data: attendeesData, error: attendeesError }: any =
          await supabase
            .from("event_attendees")
            .select(
              "event_id, status, profiles!event_attendees_user_id_fkey(profile_image_url)"
            )
            .in("event_id", eventIds)
            .or("status.eq.going,status.eq.interested"); // Correct usage of the 'or' function

        console.log("HEREHERE", attendeesData);

        if (attendeesError) {
          console.error("Error fetching attendees:", attendeesError);
        } else {
          // Add attendees' profile images to events and group by status
          const eventsWithAttendees = upcomingEvents.map((event: any) => {
            const attendingFriends = attendeesData
              .filter(
                (att: any) =>
                  att.event_id === event.id && att.status === "going"
              )
              .map((att: any) => att.profiles.profile_image_url);
            const interestedFriends = attendeesData
              .filter(
                (att: any) =>
                  att.event_id === event.id && att.status === "interested"
              )
              .map((att: any) => att.profiles.profile_image_url);
            return { ...event, attendingFriends, interestedFriends };
          });

          // Sort events by those with friends attending/interested first, then by date
          const eventsWithFriends = eventsWithAttendees.filter(
            (event: any) =>
              event.attendingFriends.length > 0 ||
              event.interestedFriends.length > 0
          );
          const eventsWithoutFriends = eventsWithAttendees.filter(
            (event: any) =>
              event.attendingFriends.length === 0 &&
              event.interestedFriends.length === 0
          );

          const finalSortedEvents = [
            ...eventsWithFriends.sort((a: any, b: any) =>
              moment(`${a.date} ${a.time}`).diff(moment(`${b.date} ${b.time}`))
            ),
            ...eventsWithoutFriends.sort((a: any, b: any) =>
              moment(`${a.date} ${a.time}`).diff(moment(`${b.date} ${b.time}`))
            ),
          ];

          // @ts-ignore
          setEvents(finalSortedEvents);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    setLoading(false);
  };

  const handleTabChange = (tab: any) => {
    setCurrentTab(tab);
  };

  const openSearchPage = () => {
    router.push("/SearchScreen");
  };

  const openEventDetailsPage = (event: any) => {
    const eventAttendees = {
      attendingFriends: event.attendingFriends,
      interestedFriends: event.interestedFriends,
    };

    router.push({
      // @ts-ignore
      pathname: "/EventDetailsScreen",
      // @ts-ignore
      params: {
        event: JSON.stringify(event),
        eventAttendees: JSON.stringify(eventAttendees),
      },
    });
  };

  const openLocationInMaps = (venue: any, city: any) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${venue}, ${city}`
    )}`;
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't open Google Maps", err)
    );
  };

  return (
    <View style={styles.container}>
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
            onPress={() => handleTabChange("Friends of Friends")}
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
            onPress={() => handleTabChange("My Friends")}
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

      {loading ? (
        <Text>Loading events...</Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.eventsContainer}
          horizontal={false}
        >
          {events.map((event: any, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openEventDetailsPage(event)}
            >
              <View style={styles.box}>
                <ImageBackground
                  source={{
                    uri:
                      event.image_url || "https://via.placeholder.com/344x257",
                  }}
                  style={styles.imageBackground}
                  imageStyle={{
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
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
                      {moment(`${event.date} ${event.time}`).format(
                        "MMM DD @ hh:mmA "
                      )}
                    </Text>
                    <Image
                      source={require("@/assets/images/pin.png")}
                      style={styles.iconSmall}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        openLocationInMaps(event.venue, event.city)
                      }
                    >
                      <Text style={styles.eventDetailsLink}>
                        {event.venue || "Venue not available"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.eventDetailsContainer}>
                    <Image
                      source={require("@/assets/images/checkmark.png")}
                      style={styles.iconSmall}
                    />
                    <View style={styles.attendingFriendsContainer}>
                      {event.attendingFriends &&
                        event.attendingFriends.map(
                          (imageUrl: any, idx: number) => (
                            <Image
                              key={String(idx)}
                              source={{ uri: imageUrl }}
                              style={styles.friendProfileImage}
                            />
                          )
                        )}
                    </View>
                    <Image
                      source={require("@/assets/images/star.png")}
                      style={styles.iconSmall}
                    />
                    <View style={styles.interestedFriendsContainer}>
                      {event.interestedFriends &&
                        event.interestedFriends.map(
                          (imageUrl: any, idx: any) => (
                            <Image
                              key={idx}
                              source={{ uri: imageUrl }}
                              style={styles.friendProfileImage}
                            />
                          )
                        )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
    left: 20,
    top: 13,
  },
  eventsContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    width: width - 40,
    overflow: "hidden",
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
    fontWeight: "500",
    fontFamily: "poppins",
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
    marginTop: 10,
  },
  friendProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
});

export default ExploreTab;
