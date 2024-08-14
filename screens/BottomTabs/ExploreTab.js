
// import React, { useState } from 'react';
// import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import DropDownPicker from 'react-native-dropdown-picker';

// const ExplorePage = () => {
//   const [open, setOpen] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState('All');
//   const [items, setItems] = useState([
//     { label: 'All', value: 'All' },
//     { label: 'New York', value: 'New York' },
//     { label: 'Los Angeles', value: 'Los Angeles' },
//   ]);
//   const [currentTab, setCurrentTab] = useState('Friends of Friends'); // State for current tab

//   const handleTabChange = (tab) => {
//     setCurrentTab(tab);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.pickerWrapper}>
//         <DropDownPicker
//           open={open}
//           value={selectedLocation}
//           items={items}
//           setOpen={setOpen}
//           setValue={setSelectedLocation}
//           setItems={setItems}
//           containerStyle={styles.pickerContainer}
//           style={styles.picker}
//           dropDownStyle={styles.dropDownStyle}
//           placeholder="Select a location"
//           zIndex={1000} // Adjust the zIndex to ensure it appears above other components
//         />
//       </View>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity 
//           style={styles.button} 
//           onPress={() => handleTabChange('Friends of Friends')}
//         >
//           <Text style={currentTab === 'Friends of Friends' ? styles.eventTabActive : styles.eventsTabInactive}>
//             Friends of Friends
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.button} 
//           onPress={() => handleTabChange('My Friends')}
//         >
//           <Text style={currentTab === 'My Friends' ? styles.eventTabActive : styles.eventsTabInactive}>
//             My Friends
//           </Text>
//         </TouchableOpacity>
//       </View>
//       {currentTab === 'Friends of Friends' && (
//         <View style={styles.box} />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     margin: 10,
//     alignItems: 'center',
//     overflow: 'visible', // Ensure the dropdown is not clipped
//   },
//   pickerWrapper: {
//     width: '50%',
//     zIndex: 1000, // Ensure it appears above other components
//   },
//   pickerContainer: {
//     height: 50,
//   },
//   picker: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   dropDownStyle: {
//     backgroundColor: '#fafafa',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: 10,
//   },
//   button: {
//     backgroundColor: 'transparent',
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginHorizontal: 5,
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   eventTabActive: {
//     color: '#3B429F', // Active button color
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   eventsTabInactive: {
//     color: '#9E9E9E', // Inactive button color
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   box: {
//     height: 257,
//     width: 336,
//     backgroundColor: '#ffff',
//     borderRadius: 20,
//     marginTop: 20,
//   },
// });

// export default ExplorePage;



import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
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
          textStyle={styles.dropdownText} // Text style for selected item
          itemStyle={styles.dropdownItem} // Style for each item
          dropDownContainerStyle={styles.dropDownContainer} // Container style for dropdown
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
        <View style={styles.box}>
          <ImageBackground 
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdYSGqSTXVr-8PKrbmtf-WZ57C_PLE30e9bA&s' }} 
            style={styles.imageBackground}
            imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
          />
          <View style={styles.artistInfo}>
            <Text style={styles.artistName}>Le Youth (+ Guest DJs)</Text>
            <Image source={require('@/assets/images/star.png')} style={styles.imagestar2} />

          </View>
          <View style={styles.boxContent}>
            {/* Content for the bottom half of the box */}
            <Image source={require('@/assets/images/calender.png')} style={styles.imagecalender} />
            <Image source={require('@/assets/images/pin.png')} style={styles.imagepin} />
            <Image source={require('@/assets/images/checkmark.png')} style={styles.imagecheckmark} />
            <Image source={require('@/assets/images/star.png')} style={styles.imagestar} />




          </View>
        </View>
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
  // dropDownStyle: {
  //   backgroundColor: '#ffff',
  // },
  // dropDownContainer: {
  //   borderColor: '#ddd',
  //   borderRadius: 10,
  // },
  dropdownText: {
    color: '#3F407C', 
    fontWeight: '700',
    fontSize:15, 
    fontFamily:'poppins',
  },
  dropdownItem: {
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
    width: 344,
    backgroundColor: '#ffff',
    borderRadius: 10,
    marginTop: 20,
    overflow: 'hidden',
  },
  imageBackground: {
    height: '74%', // Adjust height as needed
    width: '100%',
  },
  artistInfo: {
    alignItems: 'left',
    bottom: 36,
    left:14,
    flexDirection: 'row',

  },
  artistName: {
    fontFamily: 'poppins',
    fontWeight: '700',
    fontSize: 19,
    textAlign: 'center',
  },
  boxContent: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    //justifyContent: 'space-between', // Adjust spacing between images
    alignItems: 'left',
    paddingHorizontal: 10,
    //paddingVertical: 10,
    
  },
  imagecalender: {
    bottom:28,
    left:4,
    //marginLeft: 8,
  },
  imagepin: {
    bottom:28,
    left:130,
    //marginLeft: 8,
  },
  imagecheckmark: {
    right:40,
    top:10,
    //marginLeft: 8,
  },
  imagestar: {
    left:88,
    top:10,
    //marginLeft: 8,
  },
  imagestar2: {
    left:80,
    top:2,
    //marginLeft: 8,
  },
});

export default ExplorePage;

