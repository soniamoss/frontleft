
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const ExplorePage = () => {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [items, setItems] = useState([
    { label: 'All', value: 'All' },
    { label: 'New York', value: 'New York' },
    { label: 'Los Angeles', value: 'Los Angeles' },
  ]);
  const [currentTab, setCurrentTab] = useState('Friends of Friends'); // State for current tab

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
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
          dropDownStyle={styles.dropDownStyle}
          placeholder="Select a location"
          zIndex={1000} // Adjust the zIndex to ensure it appears above other components
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleTabChange('Friends of Friends')}
        >
          <Text style={currentTab === 'Friends of Friends' ? styles.eventTabActive : styles.eventsTabInactive}>
            Friends of Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleTabChange('My Friends')}
        >
          <Text style={currentTab === 'My Friends' ? styles.eventTabActive : styles.eventsTabInactive}>
            My Friends
          </Text>
        </TouchableOpacity>
      </View>
      {currentTab === 'Friends of Friends' && (
        <View style={styles.box} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin: 10,
    alignItems: 'center',
    overflow: 'visible', // Ensure the dropdown is not clipped
  },
  pickerWrapper: {
    width: '50%',
    zIndex: 1000, // Ensure it appears above other components
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
  dropDownStyle: {
    backgroundColor: '#fafafa',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eventTabActive: {
    color: '#3B429F', // Active button color
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eventsTabInactive: {
    color: '#9E9E9E', // Inactive button color
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  box: {
    height: 257,
    width: 336,
    backgroundColor: '#ffff',
    borderRadius: 20,
    marginTop: 20,
  },
});

export default ExplorePage;
