import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../supabaseClient';
import moment from 'moment';

const SearchPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        // Filter out past events
        const upcomingEvents = data.filter(event =>
          moment(`${event.date} ${event.time}`).isAfter(moment())
        );
        setAllEvents(upcomingEvents);
        setFilteredEvents(upcomingEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    filterEvents(searchQuery);
  }, [searchQuery, allEvents]);

  const filterEvents = (query) => {
    if (query.trim() === '') {
      setFilteredEvents(allEvents);
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filtered = allEvents.filter(event =>
        event.artist.toLowerCase().includes(lowercasedQuery) ||
        event.venue.toLowerCase().includes(lowercasedQuery) ||
        moment(event.date).format('MMM DD').toLowerCase().includes(lowercasedQuery)
      );
      setFilteredEvents(filtered);
    }
  };

  const highlightText = (text, query) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <Text key={index} style={styles.highlight}>{part}</Text>
      ) : (
        part
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Image source={require('@/assets/images/search.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Image source={require('@/assets/images/clear.png')} style={styles.iconSmall} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading events...</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredEvents.map((event, index) => (
            <View key={index} style={styles.eventCard}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>
                  {highlightText(event.artist, searchQuery)}
                </Text>
                <View style={styles.eventDetailsContainer}>
                  <Image source={require('@/assets/images/calender.png')} style={styles.iconSmall} />
                  <Text style={styles.eventDetails}>
                    {moment(`${event.date} ${event.time}`).format('MMM DD @ hh:mm A')}
                  </Text>
                </View>
                <View style={styles.eventDetailsContainer}>
                  <Image source={require('@/assets/images/pin.png')} style={styles.iconSmall} />
                  <Text style={styles.eventDetails}>
                    {highlightText(event.venue, searchQuery)}
                  </Text>
                </View>
                <View style={styles.additionalIconsContainer}>
                  <Image source={require('@/assets/images/checkmark.png')} style={styles.iconSmall} />
                  <Image source={require('@/assets/images/star.png')} style={styles.icon} />
                </View>
              </View>
            </View>
          ))}
          {filteredEvents.length === 0 && <Text style={styles.noResultsText}>No events found</Text>}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backText: {
    color: '#3B429F',
    fontSize: 16,
    marginRight: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  iconSmall: {
    width: 20,
    height: 20,
  },
  icon: {
    width: 20,
    height: 20,
  },
  cancelText: {
    color: '#3B429F',
    fontSize: 16,
    marginLeft: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  scrollView: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventInfo: {
    flexDirection: 'column',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B429F',
    marginBottom: 8,
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
  highlight: {
    backgroundColor: '#FFD700', // Highlight color
  },
  additionalIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  noResultsText: {
    fontSize: 16,
    color: '#3D4353',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchPage;
