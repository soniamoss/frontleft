import { router, useLocalSearchParams } from "expo-router"
import Constants from "expo-constants"

import React, { useEffect, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import BackButton from "@/components/backButton"
import { AntDesign } from "@expo/vector-icons"
import { getCurrentUser } from "@/services/userService"
import Toast from "react-native-toast-message"
import { addFriend } from "@/services/friendshipService"
import { supabase } from "@/supabaseClient"
import { sendNotifications } from "@/utils/notification"
import FriendsIcon from "@/svg/friends"
import FriendsTwo from "@/svg/friendsTwo"

const EventDetails = () => {
  const params = useLocalSearchParams()
  const eventAttendeesString = params?.eventAttendees || ""
  const ct = params?.currentTab || "attendingFriends"

  const [currentTab, setCurrentTab] = useState(ct)
  const [currentUser, setCurrentUser] = useState({})
  const [requests, setRequests] = useState([])
  const [contacts, setContacts] = useState<any>([])
  const [initalLoading, setInitialLoading] = useState(true)

  // const data = JSON.parse(eventAttendeesString);

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser()

      setCurrentUser(user)
    }

    getUser()
    fetchContacts()
  }, [])

  const data = useMemo(() => {
    const dt = JSON.parse(eventAttendeesString)

    console.log(dt[currentTab])

    return dt[currentTab]
  }, [eventAttendeesString, currentTab])

  const handleAddFriend = async (userId: string) => {
    const user = await getCurrentUser()

    const result = await addFriend(user.id, userId)
    if (result.success) {
      Toast.show({
        type: "successToast",
        text1: "Friend request sent!",
        position: "bottom",
      })

      const res = await sendNotifications({
        userId: userId,
        title: "Friend Request",
        body: `${user?.user_metadata?.fullName} sent you a friend request!`,
        data: {
          url: "(tabs)/Friends",
          params: { screen: "Requests" },
        },
      })

      fetchContacts()
    } else {
      Toast.show({
        type: "tomatoToast",
        text1: "That didn’t work, please try again!",
        position: "bottom",
      })
    }
  }

  const fetchContacts = async () => {
    try {
      const user = await getCurrentUser()

      const { data, error }: any = await supabase
        .from("friendships")
        .select("*")
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

      if (error) {
        console.error("Error fetching contacts:", error)
      } else {
        console.log("Contacts Data:", data)
        setContacts(data)
      }
    } catch (error) {
    } finally {
      setInitialLoading(false)
    }
  }

  if (initalLoading) {
    return (
      <ImageBackground
        style={styles.container}
        source={require("../assets/images/friends-back.png")}
      >
        <BackButton />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#3F407C" />
        </View>
      </ImageBackground>
    )
  }

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
            const isAdded = contacts.find(
              (r) =>
                r?.friend_id === item.user_id || r?.user_id === item.user_id
            )
            return (
              <>
                <TouchableOpacity
                  onPress={() => {
                    if (currentUser.id === item.user_id) return

                    router.push({
                      pathname: "/(tabs)/Home/FirendsProfile",
                      params: { user_id: item.user_id },
                    })
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

                  {currentUser.id !== item.user_id &&
                    isAdded?.status !== "accepted" &&
                    isAdded?.status !== "declined" && (
                      <TouchableOpacity
                        style={[
                          styles.buttonAdd,
                          isAdded && { backgroundColor: "#F5F5F5" },
                        ]}
                        onPress={() => handleAddFriend(item.user_id)}
                        disabled={isAdded}
                      >
                        <Text
                          style={[
                            styles.buttonTextAdd,
                            isAdded && { color: "#3F407C" },
                          ]}
                        >
                          {isAdded?.status === "pending" ? "Pending" : "Add"}
                        </Text>
                      </TouchableOpacity>
                    )}

                  {currentUser.id !== item.user_id &&
                    isAdded?.status === "accepted" && (
                      <View
                        style={{
                          width: "34%",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FriendsTwo />
                      </View>
                    )}
                </TouchableOpacity>
              </>
            )
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  )
}

const { width } = Dimensions.get("window")

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
})

export default EventDetails
