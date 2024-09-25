import { router } from "expo-router";
import moment from "moment";

import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Linking,
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { supabase } from "../../supabaseClient";
import PostCard from "@/components/card/post";
import useExplore from "@/hooks/useExplore";

const ExploreFoFriendsTab = () => {
  const { selectedLocation } = useExplore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Fetch the authenticated user's data
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData.user) {
          console.error("Error fetching user data 01:", userError);
          return;
        }

        setCurrentUser(userData.user);

        // Fetch friends and events after the user is set
        await fetchFriends(userData.user.id);
        // await fetchEvents(userData.user);
      } catch (error) {
        console.error("Error during initial data load:", error);
      }
    };

    loadUserData();
  }, [selectedLocation]);

  const fetchFriends = async (userId: string) => {
    try {
      console.log("User ID:", userId);

      const { data: friendsData, error } = await supabase
        .from("friendships")
        .select("friend_id, user_id")
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq("status", "accepted");

      if (error) {
        console.error("Error fetching friends:", error);
      } else {
        const friendIds = friendsData.map((friend: any) =>
          friend.user_id === userId ? friend.friend_id : friend.user_id
        );
        console.log("Friends Data:", friendIds);

        // setFriends(friendIds);
        await getFriendsofFriends(userId, friendIds);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const getFriendsofFriends = async (userId: string, friendIds: string[]) => {
    try {
      // Fetch friends of each friend from the provided friendIds array
      const { data: friendsOfFriendsData, error } = await supabase
        .from("friendships")
        .select("friend_id, user_id")
        .or(
          friendIds.map((id) => `user_id.eq.${id},friend_id.eq.${id}`).join(",")
        )
        .eq("status", "accepted");

      if (error) {
        console.error("Error fetching friends of friends:", error);
        return;
      }

      // Extract the friend IDs while excluding the original friends (friendIds)
      const friendsOfFriends = friendsOfFriendsData.map((relation: any) =>
        friendIds.includes(relation.user_id)
          ? relation.friend_id
          : relation.user_id
      );

      // Remove duplicates by creating a Set
      const uniqueFriendsOfFriends = [...new Set(friendsOfFriends)].filter(
        (id) => !friendIds.includes(id) // Exclude the friends we already know
      );

      // Optionally, you can set state with the friends of friends data or do other operations
      fetchEvents({ id: userId }, uniqueFriendsOfFriends);
    } catch (error) {
      console.error("Error fetching friends of friends:", error);
    }
  };

  const fetchEvents = async (user: any, friendIds: string[]) => {
    setLoading(true);
    try {
      const { data: eventsData, error: eventsError } = await supabase
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

        const eventIds = upcomingEvents.map((event: any) => event.id);
        const { data: attendeesData, error: attendeesError } = await supabase
          .from("event_attendees")
          .select(
            "event_id, status, user_id, profiles!event_attendees_user_id_fkey(profile_image_url, first_name, username, last_name)"
          )
          .in("event_id", eventIds)
          .or("status.eq.going,status.eq.interested");

        if (attendeesError) {
          console.error("Error fetching attendees:", attendeesError);
        } else {
          const eventsWithAttendees = upcomingEvents.map((event: any) => {
            const attendingFriends = attendeesData
              .filter(
                (att: any) =>
                  att.event_id === event.id &&
                  att.status === "going" &&
                  (friendIds.includes(att.user_id) || att.user_id === user.id)
              )
              .map((att: any) => ({
                profileImage: att.profiles.profile_image_url,
                firstName: att.profiles.first_name,
              }));

            const interestedFriends = attendeesData
              .filter(
                (att: any) =>
                  att.event_id === event.id &&
                  att.status === "interested" &&
                  (friendIds.includes(att.user_id) || att.user_id === user.id)
              )
              .map((att: any) => ({
                profileImage: att.profiles.profile_image_url,
                firstName: att.profiles.first_name,
              }));

            return { ...event, attendingFriends, interestedFriends };
          });

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

          setEvents(finalSortedEvents);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    setLoading(false);
  };

  const openEventDetailsPage = (event: any) => {
    const eventAttendees = {
      attendingFriends: event.attendingFriends,
      interestedFriends: event.interestedFriends,
    };

    router.push({
      pathname: "/EventDetailsScreen",
      params: {
        event: JSON.stringify(event),
        eventAttendees: JSON.stringify(eventAttendees),
        tab: "fof",
      },
    });
  };

  const openLocationInMaps = (venue: string, city: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${venue}, ${city}`
    )}`;
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't open Google Maps", err)
    );
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/images/friends-back.png")}
    >
      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <PostCard
            event={item}
            index={index}
            openEventDetailsPage={openEventDetailsPage}
            openLocationInMaps={openLocationInMaps}
          />
        )}
        contentContainerStyle={styles.eventsContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color="#3F407C" size="large" />
          ) : (
            <View />
          )
        }
      />
    </ImageBackground>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    marginTop: -142,
    paddingTop: 140,
    paddingBottom: 0,
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
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
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
});

export default ExploreFoFriendsTab;
