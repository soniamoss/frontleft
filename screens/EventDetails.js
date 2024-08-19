// EventDetails.js
import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../supabaseClient';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

const EventDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { event } = route.params;

  const [goingStatus, setGoingStatus] = useState(false);

  const handleGoing = async () => {
    try {
      const user = supabase.auth.user();
      const { data, error } = await supabase
        .from('event_attendees')
        .insert([{ event_id: event.id, user_id: user.id, status: 'going' }]);

      if (error) {
        Alert.alert('Error', 'There was an issue adding you to the event.');
        console.error(error);
      } else {
        setGoingStatus(true);
        Alert.alert('Success', 'You are now going to this event!');
      }
    } catch (err) {
      console.error('Error going to event:', err);
    }
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      <ImageBackground
        source={{ uri: event.image_url || 'https://via.placeholder.com/344x257' }}
        style={styles.imageBackground}
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
          <Text style={styles.eventDetails}>{event.venue}, {event.city}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.goingButton} onPress={handleGoing}>
        <Text style={styles.goingButtonText}>{goingStatus ? 'You are Going' : 'Going?'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.starButton}>
        <Image source={require('@/assets/images/star.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  imageBackground: {
    height: 250,
    justifyContent: 'flex-end',
    padding: 20,
    borderRadius: 10,
  },
  artistInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  artistName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  boxContent: {
    marginTop: 20,
  },
  eventDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventDetails: {
    marginLeft: 10,
    fontSize: 18,
    color: '#3D4353',
  },
  iconSmall: {
    width: 24,
    height: 24,
  },
  goingButton: {
    marginTop: 20,
    backgroundColor: '#3B429F',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  goingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  starButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default EventDetails;
