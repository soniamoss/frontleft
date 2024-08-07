
// import React, { useEffect, useState } from 'react';
// import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
// import * as Contacts from 'expo-contacts';
// import { supabase } from '../supabaseClient';
// import { useNavigation } from '@react-navigation/native';

// export default function ShowContacts() {
//   const [matchingProfiles, setMatchingProfiles] = useState([]);
//   const [filteredProfiles, setFilteredProfiles] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const navigation = useNavigation();

//   useEffect(() => {
//     (async () => {
//       const { status } = await Contacts.requestPermissionsAsync();
//       if (status === 'granted') {
//         const { data } = await Contacts.getContactsAsync({
//           fields: [Contacts.Fields.PhoneNumbers],
//         });

//         if (data.length > 0) {
//           const numbers = data.map(contact => (
//             contact.phoneNumbers ? contact.phoneNumbers.map(phoneNumber => 
//               phoneNumber.number.replace(/[+() -]/g, '').replace(/^\d{10}$/, '1$&')
//             ) : []
//           )).flat(2);
          
//           fetchMatchingProfiles(numbers);
//         }
//       }
//     })();
//   }, []);

//   const fetchMatchingProfiles = async (numbers) => {
//     const { data: profiles, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .in('phonenumber', numbers);

//     if (error) {
//       console.error('Error fetching profiles:', error);
//     } else {
//       setMatchingProfiles(profiles);
//       setFilteredProfiles(profiles);
//     }
//   };

//   const handleSearch = (text) => {
//     setSearchText(text);
//     if (text) {
//       const filtered = matchingProfiles.filter(profile =>
//         profile.first_name.toLowerCase().includes(text.toLowerCase()) ||
//         profile.last_name.toLowerCase().includes(text.toLowerCase())
//       );
//       setFilteredProfiles(filtered);
//     } else {
//       setFilteredProfiles(matchingProfiles);
//     }
//   };

//   const handleNext = () => {
//     navigation.navigate('Notifications');
//   };

//   const handleAddProfile = (profile) => {
//     // Implement your logic to add the profile
//     console.log('Add profile:', profile);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.buttonSkip} onPress={handleNext}>
//         <Text style={styles.buttonText}>Skip</Text>
//       </TouchableOpacity>
      
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Add or search friends"
//           value={searchText}
//           onChangeText={handleSearch}
//         />
//       </View>

//       <View style={styles.headerContainer}>
//         <Text style={styles.text}>Contacts</Text>
//         <TouchableOpacity style={styles.buttonAddAll}>
//           <Text style={styles.buttonText}>Add All</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.profileListContainer}>
//         {filteredProfiles.length > 0 ? (
//           filteredProfiles.map((profile, index) => (
//             <View key={index} style={styles.profileContainer}>
//               <Text style={styles.profileName}>{profile.first_name} {profile.last_name}</Text>
//               <TouchableOpacity style={styles.buttonAdd} onPress={() => handleAddProfile(profile)}>
//                 <Text style={styles.buttonTextAdd}>Add</Text>
//               </TouchableOpacity>
//               <Image source={require('@/assets/images/X.png')} style={styles.image} />
//             </View>
//           ))
//         ) : (
//           <Text style={styles.noProfilesText}>No matching profiles found</Text>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 16,
//   },
//   buttonSkip: {
//     width: '20%',
//     alignItems: 'center',
//     position: 'absolute',
//     top: 20,
//     left: 330,
//   },
//   searchContainer: {
//     marginTop: 60, // Adjust this margin to position the search bar below the Skip button
//     marginBottom: 10, // Space between search bar and header
//     //width:336,
//   },
//   searchInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 4,
//     paddingHorizontal: 10,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 20, // Ensure there's space between the search bar and the header
//   },
//   text: {
//     color: '#3D4353',
//     fontSize: 24,
//     fontWeight: '700',
//     fontFamily: 'poppins',
//   },
//   buttonAddAll: {
//     width: '20%',
//     paddingVertical: 10,
//     borderRadius: 26,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#3B429F',
//     fontSize: 15,
//     fontWeight: '400',
//   },
//   buttonAdd: {
//     width: '24%',
//     paddingVertical: 13,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 26,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonTextAdd: {
//     color: '#3B429F',
//     fontSize: 15,
//     fontWeight: '400',
//   },
//   image: {
//     marginLeft: 10,
//   },
//   profileListContainer: {
//     marginTop: 10,
//     flexGrow: 1,
//   },
//   profileContainer: {
//     marginVertical: 5,
//     padding: 20,
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   profileName: {
//     fontSize: 18,
//     fontWeight: '600',
//     flex: 1,
//     left:50,
//   },
//   noProfilesText: {
//     color: '#888',
//     textAlign: 'center',
//     marginVertical: 20,
//   },
// });



import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import * as Contacts from 'expo-contacts';
import { supabase } from '../supabaseClient';
import { useNavigation } from '@react-navigation/native';

export default function ShowContacts() {
  const [matchingProfiles, setMatchingProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const numbers = data.map(contact => (
            contact.phoneNumbers ? contact.phoneNumbers.map(phoneNumber => 
              phoneNumber.number.replace(/[+() -]/g, '').replace(/^\d{10}$/, '1$&')
            ) : []
          )).flat(2);
          
          fetchMatchingProfiles(numbers);
        }
      }
    })();
  }, []);

  const fetchMatchingProfiles = async (numbers) => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .in('phonenumber', numbers);

    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      setMatchingProfiles(profiles);
      setFilteredProfiles(profiles);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = matchingProfiles.filter(profile =>
        profile.first_name.toLowerCase().includes(text.toLowerCase()) ||
        profile.last_name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(matchingProfiles);
    }
  };

  const handleNext = () => {
    navigation.navigate('Notifications');
  };

  const handleAddProfile = (profile) => {
    // Implement your logic to add the profile
    console.log('Add profile:', profile);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonSkip} onPress={handleNext}>
        <Text style={styles.buttonText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Add or search friends"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.text}>Contacts</Text>
        <TouchableOpacity style={styles.buttonAddAll}>
          <Text style={styles.buttonText}>Add All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.profileListContainer}>
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile, index) => (
            <View key={index} style={styles.profileContainer}>
              <Image
                source={{ uri: profile.profile_picture || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJUAAACUCAMAAACtIJvYAAAAMFBMVEXk5ueutLenrrHn6eqrsbTq7O26v8LJzc/Gysza3d7h4+Sxt7rW2du2u77d4OHP0tSSCQHEAAADg0lEQVR4nO2byZLrIAwAwaxm8///7YCdmayOkWJB6j36kENOXUKITWZsMBgMBoPBYDAYDAaDweDbEIXeEleyi5vDYqy1S0iOfYOaELPVXk6yME0yauNUZzHhDJeS3yGnuLiOXoJZ/qC0MXnTK8cEM9NLpzVgPHTREi7uOq1etofU8tZpDVdqHS5hjqQKjUdR2BopPjXVqotUGcWGWpWRWqM1t9ISYaqV4ty7Rlap3imPoW8TLPW+Tj1pmRZaYgGM38rcwMp5oJSMilwKMP9+aVC1BHT8MppcqrZ+3iIDtVaES3GpiTMrIEKVM4tWSsFzfQ3WQprvCiWV853UKiFmYCEmQqnjDegOkrK+C42TyolFaMXQVpYwsRKmWq1QVqwEXZn/8IRWM1aKc0or5BTMiUWYV/+a1fSVVpSxAp1u7vnvKoPDVlHSfR9+HaQ8FCIOOBsT5c5d4DbIOa0o91eMYXd9pHcgCjcJSTcyyONgucWilELXUeqbBkxtIL8sQs1C4hmYUYhQ0eb6CjxYxOf5Deha2CJUTDhgJY30Tgy8GLa6cRcaoCUN/a3ohXorSX77eKW6wrd6A9ioLA+Svn7eIkKdVOs2gvT6HfxOSnd4qtcHdatJ9XxCLO/CJXmzl8EHLacfOyyuTqaL0uaV9FPrBy//2J7NH3ljk8x9wOQkddeGlA3B3KLLIcOXn2jDd3QVZTGlWJozTvRuJ9r47QRzF+7+7CKklJtLM5iOZfDkml4+am3NElKHqJX2tLBlk5RP/VfbP9EE5xoGTbFgtN/vcvqbjTn3F9die1WC9KpG7VZ4HpdEPCmFCpZDL0BKAWN0ERPO+OooPURMEwVMpZ0mvjoxqQn6B/KKhwrTrZgP58Zrt9kR6KXn8/JLMPNpnK5eZy3caoY1Eb3X4ssZ4cqDd57T6hU/36SKdGKgLlr80+4G9KP8e6/PDtToW/8jrY/uaSDXHEDQfbegu5dmWp5SikvUVKSNVAERLXqprAWWIpp9d0BnIrwpFIOEtWWJD5o8QFqwKn/6MrOnBZiIyPc2jFWst8I3U8C1qm+UWhSFK7VSc4v594u0dbtAhW1aQFL1UF53aX0elZnVoqrf4qus2jpVtr9DPiA5hZp1p3Wu87qPY9AtoXiOW3tmdOMXmuN2B5qj1oHV4ZeG7RbmG453f62r1cqhlZ46cGg1GAwGg8Fg8IIf2AYpSbp2A2QAAAAASUVORK5CYII=' }}
                style={styles.profilePicture}
              />
              <Text style={styles.profileName}>{profile.first_name} {profile.last_name}</Text>
              <TouchableOpacity style={styles.buttonAdd} onPress={() => handleAddProfile(profile)}>
                <Text style={styles.buttonTextAdd}>Add</Text>
              </TouchableOpacity>
              <Image source={require('@/assets/images/X.png')} style={styles.image} />
            </View>
          ))
        ) : (
          <Text style={styles.noProfilesText}>No matching profiles found</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  buttonSkip: {
    width: '20%',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 330,
  },
  searchContainer: {
    marginTop: 60, // Adjust this margin to position the search bar below the Skip button
    marginBottom: 10, // Space between search bar and header
    width: '100%', // Full width to accommodate the search bar
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20, // Ensure there's space between the search bar and the header
  },
  text: {
    color: '#3D4353',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'poppins',
  },
  buttonAddAll: {
    width: '20%',
    paddingVertical: 10,
    borderRadius: 26,
    alignItems: 'center',
  },
  buttonText: {
    color: '#3B429F',
    fontSize: 15,
    fontWeight: '400',
  },
  buttonAdd: {
    width: '24%',
    paddingVertical: 13,
    backgroundColor: '#F5F5F5',
    borderRadius: 26,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonTextAdd: {
    color: '#3B429F',
    fontSize: 15,
    fontWeight: '400',
  },
  image: {
    marginLeft: 10,
  },
  profileListContainer: {
    marginTop: 10,
    flexGrow: 1,
  },
  profileContainer: {
    marginVertical: 5,
    padding: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative', // Ensure positioning works for the image
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25, // Make it circular
    position: 'absolute',
    left: 0,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginLeft: 60, // Adjust to avoid overlap with the profile picture
  },
  noProfilesText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
});
