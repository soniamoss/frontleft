// import {View, Text} from 'react-native'
// import React from 'react'


// export default function FriendsTab(){
//     return(
//         <View>
//             <Text>Friends</Text>
//         </View>
//     )
// }

 

import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FriendsTabScreen from '../findFriends';
import FriendsListTabScreen from '../friendList';
import RequestTabScreen from '../requests';
import PagerView from 'react-native-pager-view';

const FriendsTopTab = createMaterialTopTabNavigator();

const FriendsTab = () => (
  <FriendsTopTab.Navigator>
    <FriendsTopTab.Screen name="FriendsTabScreen" component={FriendsTabScreen} />
    <FriendsTopTab.Screen name="FriendsListTabScreen" component={FriendsListTabScreen} />
    <FriendsTopTab.Screen name="RequestTabScreen" component={RequestTabScreen} />
  </FriendsTopTab.Navigator>
);

export default FriendsTab;