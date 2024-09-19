import { router, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";

import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "@/components/backButton";
import { AntDesign } from "@expo/vector-icons";
import { getCurrentUser } from "@/services/userService";

const EventDetails = () => {
  const params = useLocalSearchParams();
  const eventAttendeesString = params?.eventAttendees || "";
  const ct = params?.currentTab || "attendingFriends";

  const [currentTab, setCurrentTab] = useState(ct);
  const [currentUser, setCurrentUser] = useState({});
  const [requests, setRequests] = useState([]);

  // const data = JSON.parse(eventAttendeesString);

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser();

      setCurrentUser(user);
    };

    getUser();
  }, []);

  const data = useMemo(() => {
    const dt = JSON.parse(eventAttendeesString);

    console.log(dt[currentTab]);

    return dt[currentTab];
  }, [eventAttendeesString, currentTab]);

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/friends-back.png")}
    >
      <BackButton />

      <View style={styles.box}>
        <View style={styles.tabContainer}>
          <View style={styles.tabWrapper}>
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setCurrentTab("attendingFriends")}
            >
              <Text
                style={
                  currentTab === "attendingFriends"
                    ? styles.tabTextActive
                    : styles.tabTextInactive
                }
              >
                Going
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setCurrentTab("interestedFriends")}
            >
              <Text
                style={
                  currentTab === "interestedFriends"
                    ? styles.tabTextActive
                    : styles.tabTextInactive
                }
              >
                Interested
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={data}
          renderItem={({ item }) => {
            const isAdded = item?.invite
              ? false
              : requests.findIndex((r) => r?.friend_id === item.user_id) >= 0;
            return (
              <>
                <TouchableOpacity
                  onPress={() => {
                    if (currentUser.id === item.user_id) return;

                    router.push({
                      pathname: "/FirendsProfile",
                      params: { user_id: item.user_id },
                    });
                  }}
                  style={styles.profileContainer}
                  disabled={currentUser.id === item.user_id}
                >
                  <Image
                    source={{
                      uri:
                        item.profileImage || "https://via.placeholder.com/50",
                    }}
                    style={styles.profilePicture}
                  />
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <AntDesign name="user" size={15} color="black" />
                      <Text style={styles.profileUsername}>
                        {item.username}
                      </Text>
                    </View>
                  </View>

                  {currentUser.id !== item.user_id && (
                    <TouchableOpacity
                      style={[
                        styles.buttonAdd,
                        isAdded && { backgroundColor: "#F5F5F5" },
                      ]}
                      // onPress={() => handleAddFriend(item.user_id)}
                      // disabled={isAdded}
                    >
                      <Text
                        style={[
                          styles.buttonTextAdd,
                          isAdded && { color: "#3F407C" },
                        ]}
                      >
                        {isAdded ? "Pending" : "Add"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </>
            );
          }}
        />
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

  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 15,
    borderBottomColor: "#E6E6E6",
    borderBottomWidth: 1,
  },
  tabWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  tabButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
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
    height: "80%",
    maxHeight: "80%",
    paddingBottom: 10,
    paddingHorizontal: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,

    marginTop: 80,
  },

  profileContainer: {
    marginVertical: 5,
    paddingVertical: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 5,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileUsername: {
    fontSize: 15,
    fontWeight: "400",
  },
  buttonAdd: {
    width: "34%",
    paddingVertical: 12,
    backgroundColor: "#3F407C",
    borderRadius: 26,
    alignItems: "center",
    marginTop: 8,
  },
  buttonTextAdd: {
    color: "#FFFF",
    fontSize: 15,
    fontWeight: "400",
  },
  inviteButton: {
    width: "34%",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 26,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#3F407C",
  },
  inviteButtonText: {
    color: "#3F407C",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default EventDetails;
