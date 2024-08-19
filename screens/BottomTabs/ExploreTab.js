import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, ScrollView, TouchableOpacity, Image, Linking, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../../supabaseClient';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const ExplorePage = () => {
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
  const navigation = useNavigation();

  useEffect(() => {
    fetchEvents();
  }, [selectedLocation]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('city', selectedLocation);

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        // Filter and sort events in chronological order
        const upcomingEvents = data
          .filter(event => moment(`${event.date} ${event.time}`).isAfter(moment()))
          .sort((a, b) => moment(`${a.date} ${a.time}`).diff(moment(`${b.date} ${b.time}`)));
        setEvents(upcomingEvents);
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
    navigation.navigate('EventDetails', { event });
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
        <Text>Loading events...</Text>
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
                  imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                >
                  <View style={styles.artistInfo}>
                    <Text style={styles.artistName}>{event.artist || 'Unknown Artist'}</Text>
                  </View>
                </ImageBackground>
                <View style={styles.boxContent}>
                  <View style={styles.eventDetailsContainer}>
                    <Image source={require('@/assets/images/calender.png')} style={styles.iconSmall} />
                    <Text style={styles.eventDetails}>
                      {moment(`${event.date} ${event.time}`).format('MMM DD @ hh:mm A')}
                    </Text>
                  </View>

                  <View style={styles.eventDetailsContainer}>
                    <Image source={require('@/assets/images/pin.png')} style={styles.iconSmall} />
                    <TouchableOpacity onPress={() => openLocationInMaps(event.venue, event.city)}>
                      <Text style={styles.eventDetailsLink}>
                        {event.venue || 'Venue not available'}
                      </Text>
                    </TouchableOpacity>
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

const { width } = Dimensions.get('window'); // Get the width of the screen

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
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  tabWrapper: {
    flexDirection: 'row',
  },
  tabButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tabTextActive: {
    color: '#3B429F',
    fontWeight: 'bold',
  },
  tabTextInactive: {
    color: '#9E9E9E',
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  eventsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    width: width - 40, // Ensure the box takes up full width with padding
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
    paddingHorizontal: 15,
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
    color: '#000',
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
    marginLeft: 10,
    fontSize: 16,
    color: '#3D4353',
    fontWeight: '500',
  },
  eventDetailsLink: {
    marginLeft: 10,
    fontSize: 16,
    color: '#3B429F',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  iconSmall: {
    width: 20,
    height: 20,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default ExplorePage;
