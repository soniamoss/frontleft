import { router } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../supabaseClient";

const SearchPage = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    fetchAllEvents();
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
  };

  const handleEventPress = (event: any) => {
    router.push({ pathname: "/EventDetailsScreen", params: { event } });
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>{"< Back"}</Text>
        </TouchableOpacity>
        {/* New White Box Below Search Bar */}
        <View style={styles.whiteBox}>
          <View style={styles.searchBoxContainer}>
            <View
              style={[
                styles.searchBox,
                { width: isFocused || searchQuery.length > 0 ? "80%" : "100%" },
              ]}
            >
              <Image
                source={require("@/assets/images/search.png")}
                style={styles.searchIcon}
              />
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
                  onPress={() => setSearchQuery("")}
                  style={styles.clearButton}
                >
                  <Image
                    source={require("@/assets/images/clear.png")}
                    style={styles.iconSmall}
                  />
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

      {loading ? (
        <Text style={styles.loadingText}>Loading events...</Text>
      ) : (
        <View style={styles.eventsContainer}>
          <Text style={styles.recentSearches}>Recent Searches</Text>
          <ScrollView style={styles.scrollView}>
            {filteredEvents.map((event: any, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleEventPress(event)}
              >
                <View style={styles.eventCard}>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>
                      {highlightText(event.artist, searchQuery)}
                    </Text>
                    <View style={styles.eventDetailsContainer}>
                      <Image
                        source={require("@/assets/images/calender.png")}
                        style={styles.iconSmall}
                      />
                      <Text style={styles.eventDetails}>
                        {moment(`${event.date} ${event.time}`).format(
                          "MMM DD @ hh:mm A"
                        )}
                      </Text>
                      <Image
                        source={require("@/assets/images/pin.png")}
                        style={styles.iconSmall}
                      />
                      <Text style={styles.eventDetails}>
                        {highlightText(event.venue, searchQuery)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {filteredEvents.length === 0 && (
              <Text style={styles.noResultsText}>No events found</Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
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
  },
  clearButton: {
    padding: 5,
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
