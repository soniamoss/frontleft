import { router } from "expo-router";
import Constants from "expo-constants";
import AntDesign from "@expo/vector-icons/AntDesign";

import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../supabaseClient";
import BackButton from "@/components/backButton";
import SearchIcon from "@/svg/search";
import CrossCircleIcon from "@/svg/crossCover";
import PinIcon from "@/svg/pin";
import CalendarIcon from "@/svg/calendar";
import ButtonContained from "@/components/buttons/contained";

const SearchPage = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [bottomPosition, setBottomPosition] = useState(20);
  const [modal, setModal] = useState(true);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setBottomPosition(e.endCoordinates.height + 10); // Move the circle up when the keyboard is shown
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setBottomPosition(20); // Reset the circle to its original position
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const { data, error }: any = await supabase.from("events").select("*");

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        // Filter out past events
        const upcomingEvents = data.filter((event: any) =>
          moment(`${event.date} ${event.time}`).isAfter(moment())
        );
        setAllEvents(upcomingEvents);
        setFilteredEvents(upcomingEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    filterEvents(searchQuery);
  }, [searchQuery, allEvents]);

  const filterEvents = (query: any) => {
    if (query.trim() === "") {
      setFilteredEvents(allEvents);
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filtered = allEvents.filter(
        (event: any) =>
          event.artist.toLowerCase().includes(lowercasedQuery) ||
          event.venue.toLowerCase().includes(lowercasedQuery) ||
          moment(event.date)
            .format("MMM DD")
            .toLowerCase()
            .includes(lowercasedQuery)
      );
      setFilteredEvents(filtered);
    }
  };

  // @ts-ignore
  const highlightText = (text, query) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    // @ts-ignore
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <Text key={index} style={styles.highlight}>
          {part}
        </Text>
      ) : (
        part
      )
    );
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleCancel = () => {
    setSearchQuery("");
    setIsFocused(false); // Reset to default size when cancel is pressed
    Keyboard.dismiss(); // Dismiss the keyboard
    router.push("../");
  };

  const handleEventPress = (event: any) => {
    router.push({
      pathname: "/EventDetailsScreen",
      params: { event: JSON.stringify(event) },
    });
  };

  const handleContactUs = () => {
    const email = "faryar48@gmail.com";
    const subject = "[Doost]: I’d like to add an event!";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailtoUrl);
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/friends-back.png")}
    >
      <BackButton />
      <View>
        {/* New White Box Below Search Bar */}
        <View style={styles.whiteBox}>
          <View style={styles.searchBoxContainer}>
            <View
              style={[
                styles.searchBox,
                {
                  width: isFocused || searchQuery.length > 0 ? "80%" : "100%",
                },
              ]}
            >
              <View style={styles.searchIcon}>
                <SearchIcon />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search events"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                  }}
                  style={styles.clearButton}
                >
                  <CrossCircleIcon />
                </TouchableOpacity>
              )}
            </View>
            {(isFocused || searchQuery.length > 0) && (
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View style={styles.eventsContainer}>
        <Text style={styles.recentSearches}>Recent Searches</Text>
        <FlatList
          data={filteredEvents}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEventPress(item)}>
              <View style={styles.eventCard}>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>
                    {highlightText(item.artist, searchQuery)}
                  </Text>
                  <View style={styles.eventDetailsContainer}>
                    <CalendarIcon />
                    <Text style={styles.eventDetails}>
                      {moment(`${item.date} ${item.time}`).format(
                        "MMM DD @ hh:mm A"
                      )}
                    </Text>
                    <PinIcon />
                    <Text style={styles.eventDetails}>
                      {highlightText(item.venue, searchQuery)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.scrollView}
          ListEmptyComponent={() =>
            loading && <Text style={styles.loadingText}>Loading events...</Text>
          }
        />
      </View>
      {modal && (
        <View
          style={{
            position: "absolute",
            borderRadius: 20,

            bottom: bottomPosition,
            left: 20,
            right: 20,
            backgroundColor: "#fff",

            padding: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setModal(false)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
          >
            <AntDesign name="close" size={20} color="#838383" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 19,
              fontWeight: "bold",
              marginBottom: 10,
              fontFamily: "poppins",
              color: "#3D4353",
            }}
          >
            Don’t see your event? Add it!
          </Text>
          <ButtonContained
            title="Add"
            cusStyle={{
              borderRadius: 50,
              alignSelf: "center",
              paddingHorizontal: 50,
            }}
            onPress={handleContactUs}
          />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingTop: Constants.statusBarHeight + 20,
  },
  backText: {
    color: "#6A74FB",
    fontSize: 15,
    left: 14,
  },
  searchBoxContainer: {
    padding: 20,
    position: "relative",
  },
  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#CEDBEA",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 26,
    fontSize: 16,
    marginRight: 10,
    color: "#3D4353",
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButton: {
    // padding: 5,
  },
  cancelButton: {
    position: "absolute",
    right: 18,
    top: 35,
  },
  iconSmall: {
    width: 20,
    height: 20,
  },
  cancelText: {
    color: "#3B429F",
    fontSize: 16,
  },
  whiteBox: {
    backgroundColor: "#fff",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    borderColor: "#CEDBEA",
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  eventsContainer: {
    marginTop: 20, // Ensures space between the search box and "Recent Searches" text
    flex: 1,
  },
  recentSearches: {
    fontSize: 15,
    fontWeight: "700", // Bold text
    color: "#000000",
    marginHorizontal: 20,
    marginBottom: 10, // Space below the "Recent Searches" text
    fontFamily: "poppins",
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventInfo: {
    flexDirection: "column",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3D4353",
    marginBottom: 8,
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
    flexShrink: 1,
    flexWrap: "wrap",
    width: Dimensions.get("window").width * 0.6,
    fontFamily: "poppins",
  },
  highlight: {
    backgroundColor: "#8E9BFD",
  },
  noResultsText: {
    fontSize: 16,
    color: "#3D4353",
    textAlign: "center",
    marginTop: 20,
  },
});

export default SearchPage;
