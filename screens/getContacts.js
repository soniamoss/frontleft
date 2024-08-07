
// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import Contacts from 'react-native-contacts';

// const GetContacts = () => {
//   useEffect(() => {
//     Alert.alert(
//       '"Doost" Would Like to Access Your Contacts',
//       'We’ll check your contacts to see who from your friends is already on the app. Your contacts won’t be stored.',
//       [
//         {
//           text: "Don’t Allow",
//           onPress: () => console.log('Don’t Allow Pressed'),
//           style: 'cancel', 
//         },
//         {
//           text: 'Allow',
//           onPress: () => console.log('Allow Pressed'),
//           style: 'default', 
//         },
//       ],
//       { cancelable: false } // wont be dismissed by tapping outside
//     );
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Find Friends</Text>
//       <Text style={styles.textother}>
//         Let’s find friends already on Doost to{'\n'} see what events they’re going to!
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 19,
//     fontWeight: 'bold',
//     fontFamily: 'poppins',
//     textAlign: 'center',
//     color: '#3B429F',
//     marginTop: 2,
//   },
//   textother: {
//     fontSize: 17,
//     fontWeight: '400',
//     fontFamily: 'Proxima Nova',
//     textAlign: 'center',
//     color: '#3D4353',
//     marginTop: 13,
//     zIndex: 1,
//   },
// });

// export default GetContacts;

// import React, { useEffect } from 'react';
// import { StyleSheet, View, Text } from 'react-native';
// import * as Contacts from 'expo-contacts';

// export default function App() {
//   useEffect(() => {
//     (async () => {
//       const { status } = await Contacts.requestPermissionsAsync();
//       if (status === 'granted') {
//         const { data } = await Contacts.getContactsAsync({
//           fields: [Contacts.Fields.PhoneNumbers],
//         });

//         if (data.length > 0) {
//           const contact = data;
//           console.log("HERE", contact[0].phoneNumbers[0].digits);
//         }
//       }
//     })();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text>Contacts Module Example</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


// const fetchProfilesByPhoneNumbers = async (phoneNumbers) => {
//   const { data, error } = await supabase
//     .from('profiles')
//     .select('*')
//     .in('phone_number', phoneNumbers);

//   if (error) {
//     console.error('Error fetching profiles:', error);
//     return [];
//   }

//   return data;
// };


// import React, { useEffect, useState } from 'react';
// import { StyleSheet, View, Text } from 'react-native';
// import * as Contacts from 'expo-contacts';

// export default function App() {
//   const [phoneNumbers, setPhoneNumbers] = useState([]);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Contacts.requestPermissionsAsync();
//       if (status === 'granted') {
//         const { data } = await Contacts.getContactsAsync({
//           fields: [Contacts.Fields.PhoneNumbers],
//         });

//         if (data.length > 0) {
//           const numbers = [];
//           data.forEach(contact => {
//             if (contact.phoneNumbers) {
//               contact.phoneNumbers.forEach(phoneNumber => {
//                 // Format the phone number to remove unwanted characters
//                 let formattedNumber = phoneNumber.number.replace(/[+() -]/g, '');

//                 // Add default country code if missing (assuming US country code '1')
//                 if (/^\d{10}$/.test(formattedNumber)) {
//                   formattedNumber = '1' + formattedNumber;
//                 }

//                 numbers.push(formattedNumber);
//               });
//             }
//           });
//           setPhoneNumbers(numbers);
//         }
//       }
//     })();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text>Contacts Module Example</Text>
//       <Text>Phone Numbers:</Text>
//       {phoneNumbers.length > 0 ? (
//         phoneNumbers.map((number, index) => (
//           <Text key={index}>{number}</Text>
//         ))
//       ) : (
//         <Text>No phone numbers found</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//   },
// });


import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Contacts from 'expo-contacts';
import { supabase } from '../supabaseClient';

export default function App() {
  const [matchingProfiles, setMatchingProfiles] = useState([]);

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
          
          console.log("HEYXX", numbers)
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
    }
  };

  return (
    <View style={styles.container}>
      <Text>Contacts Module Example</Text>
      <Text>Matching Profiles:</Text>
      {matchingProfiles.length > 0 ? (
        matchingProfiles.map((profile, index) => (
          <Text key={index}>{profile.first_name} - {profile.phonenumber}</Text>
        ))
      ) : (
        <Text>No matching profiles found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
