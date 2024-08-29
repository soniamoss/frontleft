import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../../supabaseClient';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const ExploreTab = () => {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Los Angeles');
  const [items, setItems] = useState([
    { label: 'Los Angeles', value: 'Los Angeles' },
    { label: 'New York', value: 'New York' },
    { label: 'San Francisco', value: 'San Francisco' },
  ]);
  const [currentTab, setCurrentTab] = useState('Friends of Friends');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Fetch the authenticated user's data
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          console.error('Error fetching user data:', userError);
          return;
        }

        setCurrentUser(userData.user);

        // Fetch friends and events after the user is set
        await fetchFriends(userData.user.id);
        await fetchEvents(userData.user);
      } catch (error) {
        console.error('Error during initial data load:', error);
      }
    };

    loadUserData();
  }, [selectedLocation, currentTab]);

  const fetchFriends = async (userId) => {
    try {
      const { data: friendsData, error } = await supabase
        .from('friendships')
        .select('friend_id, user_id')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'accepted');
  
      if (error) {
        console.error('Error fetching friends:', error);
      } else {
        // Extracting the friend's ID based on which field doesn't match the userId
        const friendIds = friendsData.map(friend => 
          friend.user_id === userId ? friend.friend_id : friend.user_id
        );
        console.log('Friends Data:', friendIds);
        setFriends(friendIds);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };
  

  const fetchEvents = async (user) => {
    setLoading(true);
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('city', selectedLocation);

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
      } else {
        const upcomingEvents = eventsData
          .filter(event => moment(`${event.date} ${event.time}`).isAfter(moment()))
          .sort((a, b) => moment(`${a.date} ${a.time}`).diff(moment(`${b.date} ${b.time}`)));

        const eventIds = upcomingEvents.map(event => event.id);
        const { data: attendeesData, error: attendeesError } = await supabase
          .from('event_attendees')
          .select('event_id, status, user_id, profiles!event_attendees_user_id_fkey(profile_image_url, first_name)')
          .in('event_id', eventIds)
          .or('status.eq.going,status.eq.interested');

        if (attendeesError) {
          console.error('Error fetching attendees:', attendeesError);
        } else {
          const eventsWithAttendees = upcomingEvents.map(event => {
            const attendingFriends = attendeesData
              .filter(att => att.event_id === event.id && att.status === 'going' && (friends.includes(att.user_id) || att.user_id === user.id))
              .map(att => ({ profileImage: att.profiles.profile_image_url, firstName: att.profiles.first_name }));

            const interestedFriends = attendeesData
              .filter(att => att.event_id === event.id && att.status === 'interested' && (friends.includes(att.user_id) || att.user_id === user.id))
              .map(att => ({ profileImage: att.profiles.profile_image_url, firstName: att.profiles.first_name }));

            // Check if the current user is attending
            const isCurrentUserGoing = attendeesData.some(att => att.event_id === event.id && att.user_id === user.id && att.status === 'going');

            // Add the current user at the beginning of the attendingFriends array
            // if (isCurrentUserGoing) {
            //   attendingFriends.unshift({
            //     profileImage: user.user_metadata?.profile_image_url || '', // Assuming profile image URL is stored in user metadata
            //     firstName: user.user_metadata?.first_name || 'You',
            //   });
            // }
            
            console.log('current User', user); 
            console.log('attendeesDataXXc', attendeesData); 

            return { ...event, attendingFriends, interestedFriends };
          });

          const eventsWithFriends = eventsWithAttendees.filter(event => event.attendingFriends.length > 0 || event.interestedFriends.length > 0);
          const eventsWithoutFriends = eventsWithAttendees.filter(event => event.attendingFriends.length === 0 && event.interestedFriends.length === 0);

          const finalSortedEvents = [
            ...eventsWithFriends.sort((a, b) => moment(`${a.date} ${a.time}`).diff(moment(`${b.date} ${b.time}`))),
            ...eventsWithoutFriends.sort((a, b) => moment(`${a.date} ${a.time}`).diff(moment(`${b.date} ${b.time}`))),
          ];

          setEvents(finalSortedEvents);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setLoading(false);
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const openSearchPage = () => {
    navigation.navigate('SearchPage');
  };

  const openEventDetailsPage = (event) => {
    const eventAttendees = {
      attendingFriends: event.attendingFriends,
      interestedFriends: event.interestedFriends,
    };

    navigation.navigate('EventDetails', { event, eventAttendees });
  };

  const openLocationInMaps = (venue, city) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, ${city}`)}`;
    Linking.openURL(url).catch(err => console.error("Couldn't open Google Maps", err));
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
            onPress={() => handleTabChange('Friends of Friends')}
          >
            <Text style={currentTab === 'Friends of Friends' ? styles.tabTextActive : styles.tabTextInactive}>
              Friends of Friends
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabChange('My Friends')}
          >
            <Text style={currentTab === 'My Friends' ? styles.tabTextActive : styles.tabTextInactive}>
              My Friends
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={openSearchPage}>
          <Image source={require('@/assets/images/search.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.eventsContainer}
          horizontal={false}
        >
          {events.map((event, index) => (
            <TouchableOpacity key={index} onPress={() => openEventDetailsPage(event)}>
              <View style={styles.box}>
                <ImageBackground
                  source={{ uri: event.image_url || 'https://via.placeholder.com/344x257' }}
                  style={styles.imageBackground}
                  imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                </ImageBackground>
                <View style={styles.artistInfo}>
                  <Text style={styles.artistName}>{event.artist || 'Unknown Artist'}</Text>
                </View>
                <View style={styles.boxContent}>
                  <View style={styles.eventDetailsContainer}>
                    <Image source={require('@/assets/images/calender.png')} style={styles.iconSmall} />
                    <Text style={styles.eventDetails}>
                      {moment(`${event.date} ${event.time}`).format('MMM DD @ hh:mmA ')}
                    </Text>
                    <Image source={require('@/assets/images/pin.png')} style={styles.iconSmall} />
                    <TouchableOpacity onPress={() => openLocationInMaps(event.venue, event.city)}>
                      <Text style={styles.eventDetailsLink}>
                        {event.venue || 'Venue not available'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.eventDetailsContainer}>
                    <Image source={require('@/assets/images/checkmark.png')} style={styles.iconSmall} />
                    <View style={styles.attendingFriendsContainer}>
                      {event.attendingFriends && event.attendingFriends.map((friend, idx) => (
                        <View key={idx} style={styles.friendInfo}>
                          <Image
                            source={{ uri: friend.profileImage }}
                            style={styles.friendProfileImage}
                          />
                          <Text style={styles.friendName}>{friend.firstName}</Text>
                        </View>
                      ))}
                    </View>
                    <Image source={require('@/assets/images/star.png')} style={styles.iconSmall} />
                    <View style={styles.interestedFriendsContainer}>
                      {event.interestedFriends && event.interestedFriends.map((friend, idx) => (
                        <View key={idx} style={styles.friendInfo}>
                          <Image
                            source={{ uri: friend.profileImage }}
                            style={styles.friendProfileImage}
                          />
                          <Text style={styles.friendName}>{friend.firstName}</Text>
                        </View>
                      ))}
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  pickerWrapper: {
    width: '50%',
    alignSelf: 'center',
    marginBottom: 10,
    zIndex: 1000,
  },
  pickerContainer: {
    height: 50,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownText: {
    color: '#3F407C',
    fontWeight: '700',
    fontSize: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  tabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 5,
  },
  tabTextActive: {
    color: '#6A74FB',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabTextInactive: {
    color: '#9E9E9E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchIcon: {
    left: 20,
    top: 13,
  },
  eventsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    width: width - 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  imageBackground: {
    height: 180,
    justifyContent: 'flex-end',
    paddingHorizontal: 1,
    paddingBottom: 10,
  },
  artistInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  artistName: {
    fontFamily: 'poppins',
    fontWeight: '700',
    fontSize: 19,
    color: '#3D4353',
  },
  boxContent: {
    padding: 15,
  },
  eventDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventDetails: {
    marginLeft: 5,
    fontSize: 11,
    color: '#3D4353',
    fontWeight: '500',
    fontFamily: 'poppins',
  },
  eventDetailsLink: {
    marginLeft: 5,
    fontSize: 11,
    color: '#3D4353',
    fontWeight: '500',
    flexShrink: 1,
    flexWrap: 'wrap',
    width: width * 0.4,
  },
  iconSmall: {
    width: 24,
    height: 24,
  },
  attendingFriendsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginRight: 10,
  },
  interestedFriendsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#3D4353',
  },
});

export default ExploreTab;


