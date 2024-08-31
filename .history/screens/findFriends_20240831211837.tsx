import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Toast from "react-native-toast-message";

import * as Contacts from "expo-contacts";
import * as SMS from "expo-sms";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { addFriend } from "../services/friendshipService";
import { getCurrentUser } from "../services/userService";
import { supabase } from "../supabaseClient";
import SearchBar from "@/components/SearchBar";

interface Contact {
  id: string;
  first_name: string;
  last_name?: string;
  phone_number: string;
  invite?: boolean;
}

interface Profile {
  user_id: string;
  first_name: string;
  last_name?: string;
  username: string;
  profile_image_url?: string;
  invite?: boolean;
}

interface Friendship {
  friend_id: string;
  user_id: string;
  status: string;
}

export default function ShowContacts() {
  const [appContacts, setAppContacts] = useState<Profile[]>([]);
  const [nonAppContacts, setNonAppContacts] = useState<Contact[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [requests, setRequests] = useState<Friendship[]>([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [])
  );

  useEffect(() => {
    const subscription = supabase
      .channel("public:profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          console.log("Real-time change:", payload);
          fetchContacts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchContacts = async () => {
    const user = await getCurrentUser();

    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissions Denied",
        "Access to contacts is required to find friends."
      );
      return;
    }

    const { data: deviceContacts } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    if (!deviceContacts?.length) {
      Alert.alert("No Contacts Found", "No contacts found on your device.");
      return;
    }

    const phoneNumbers = deviceContacts
      .flatMap((contact) =>
        contact.phoneNumbers
          ? contact.phoneNumbers.map((phoneNumber) =>
              phoneNumber?.number
                .replace(/[+() -]/g, "")
                .replace(/^\d{10}$/, "1$&")
            )
          : []
      )
      .filter(Boolean);

    const { data: profiles, error: profilesError } = await supabase.rpc(
      "get_profiles_by_phonenumbers",
      {
        phone_numbers: phoneNumbers,
      }
    );

    if (profilesError) {
      console.error(profilesError);
    }

    const { data: friendshipIds, error: friendshipError } = await supabase
      .from("friendships")
      .select("friend_id, user_id, status")
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    if (friendshipError) {
      console.error("Error fetching friendship IDs:", friendshipError);
    } else {
      console.log("friendshipIds:", friendshipIds);
    }

    let idsToExclude: string[] = [];

    for (const friendship of friendshipIds || []) {
      if (friendship.status === "accepted") {
        idsToExclude.push(friendship.friend_id);
      }
    }

    const filteredProfiles = (profiles || []).filter(
      (profile: Profile) =>
        !idsToExclude.includes(profile.user_id) && profile.user_id !== user.id
    );

    const nonAppContactsSample = deviceContacts.slice(0, 10).map((contact) => ({
      id: contact.id,
      first_name: contact.name,
      phone_number: contact.phoneNumbers ? contact.phoneNumbers[0].number : "",
      username: contact.phoneNumbers
        ? "+1" + " " + contact.phoneNumbers[0].number
        : "",
      invite: true,
    }));

    setRequests(friendshipIds || []);
    setAppContacts(filteredProfiles.concat(nonAppContactsSample));
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleAddFriend = async (friendID: string) => {
    const user = await getCurrentUser();

    const result = await addFriend(user.id, friendID);
    if (result.success) {
      Toast.show({
        type: "successToast",
        text1: "Friend request sent!",
        position: "bottom",
      });

      fetchContacts();
    } else {
      Toast.show({
        type: "tomatoToast",
        text1: "That didn’t work, please try again!",
        position: "bottom",
      });
    }
  };

  const handleInvite = async (contact: Contact) => {
    const message = `Hi ${contact.first_name}, I invite you to join our app! Click the link to download: [Your App Link]`;
    console.log("set up the app link");

    const { result } = await SMS.sendSMSAsync([contact.phone_number], message);

    if (result === "sent") {
      console.log("Invite sent to:", contact.first_name, contact.phone_number);
      Alert.alert(
        "Invite Sent",
        `An invite has been sent to ${contact.first_name}`
      );
    }
  };

  const filteredProfiles = useMemo(() => {
    let filData = appContacts;

    if (searchText) {
      filData = filData.filter(
        (profile: Profile) =>
          profile.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
          (profile.last_name &&
            profile.last_name
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
          profile.username.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filData;
  }, [appContacts, searchText]);

  return (
    <ImageBackground
      style={{
        flex: 1,
        paddingTop: 50,
        marginTop: -100,
      }}
      source={require("../assets/images/friends-back.png")}
    >
      <View style={styles.box}>
        <SearchBar value={searchText} setValue={handleSearch} />

        <FlatList
          data={filteredProfiles}
          keyExtractor={(item) => item.username}
          renderItem={({ item, index }) => {
            const isAdded = item?.invite
              ? false
              : requests.findIndex((r) => r?.friend_id === item.user_id) >= 0;

            return (
              <View key={index} style={styles.profileContainer}>
                <Image
                  source={{
                    uri:
                      item.profile_image_url ||
                      "https://via.placeholder.com/50",
                  }}
                  style={styles.profilePicture}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {item.first_name} {item.last_name}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AntDesign name="user" size={24} color="black" />
                    <Text style={styles.profileUsername}>{item.username}</Text>
                  </View>
                </View>
                {item.invite ? (
                  <TouchableOpacity
                    style={styles.inviteButton}
                    onPress={() => handleInvite(item as Contact)}
                  >
                    <Text style={styles.inviteButtonText}>Invite</Text>
                  </TouchableOpacity>
                ) : (
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
                      {isAdded ? "Pending" : "Add"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <Text style={styles.text}>Find Friends</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  box: {
    flex: 1,
    width: "90%",
    maxHeight: "80%", // Limit the height of the box
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginTop: 70, // Space from top of the screen
    alignSelf: "center",
    justifyContent: "flex-start",

    shadowColor: "#00000012",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.07,
    shadowRadius: 13,
    elevation: 2,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 50,
    borderColor: "#EBF1F7",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  text: {
    color: "#3D4353",
    fontSize: 24,
    fontWeight: "700",
  },
  scrollView: {
    flexGrow: 1,
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
    marginLeft: 10,
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
  nonAppContactsContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#3D4353",
  },
  noProfilesText: {
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
});
