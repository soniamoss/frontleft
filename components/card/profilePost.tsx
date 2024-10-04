import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import moment from "moment";
import CalendarIcon from "@/svg/calendar";
import PinIcon from "@/svg/pin";
import CheckIcon from "@/svg/check";
import StarIcon from "@/svg/star";
import { useRouter } from "expo-router";

interface Friend {
  profileImage: string;
  firstName: string;
}

interface Event {
  image_url?: string;
  artist?: string;
  date: string;
  time: string;
  venue?: string;
  city?: string;
  attendingFriends?: Friend[];
  interestedFriends?: Friend[];
}

interface PostCardProps {
  event: Event;
  index: number;
  isInterested?: boolean;
  isFriend?: boolean;
}

const ProfilePostCard: React.FC<PostCardProps> = ({
  event,
  index,
  isInterested = false,
  isFriend = true,
}) => {
  const router = useRouter();

  const openEventDetailsPage = (event: any) => {
    const eventAttendees = {
      attendingFriends: event.attendingFriends,
      interestedFriends: event.interestedFriends,
    };

    router.push({
      pathname: isFriend
        ? "/(tabs)/Home/EventDetailsScreen"
        : "/(tabs)/Profile/EventDetailsScreen",
      params: {
        event: JSON.stringify(event),
        eventAttendees: JSON.stringify(eventAttendees),
        tab: "fof",
      },
    });
  };

  return (
    <TouchableOpacity key={index} onPress={() => openEventDetailsPage(event)}>
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
        </View>
        <View style={styles.boxContent}>
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
              <TouchableOpacity>
                {/* Add your function to open location maps here */}
                <Text style={styles.eventDetailsLink}>
                  {event.venue || "Venue not available"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {!isInterested && (
            <View style={styles.eventDetailsContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                  gap: 5,
                }}
              >
                <CheckIcon />
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
                  {event.attendingFriends &&
                    event.attendingFriends.length > 3 && (
                      <Text style={styles.seeMore}>
                        +{event.attendingFriends.length - 3}
                      </Text>
                    )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                  gap: 5,
                }}
              >
                <StarIcon />
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
                        +{event.interestedFriends.length - 3}
                      </Text>
                    )}
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
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
    paddingTop: 5,
    paddingLeft: 10,
  },
  eventDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
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
    marginLeft: -10,
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

export default ProfilePostCard;
