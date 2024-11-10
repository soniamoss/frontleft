import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import React from "react"
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import FriendsTabScreen from "../findFriends"
import FriendsListTabScreen from "../friendList"
import RequestTabScreen from "../requests"
import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs"
import { useLocalSearchParams } from "expo-router"

type FriendsTopTabParamList = {
  "Find Friends": undefined
  "Friends List": undefined
  Requests: undefined
}

const FriendsTopTab = createMaterialTopTabNavigator<FriendsTopTabParamList>()

const FriendsTab: React.FC = () => {
  return (
    <ImageBackground
      style={{
        flex: 1,
        paddingTop: 50,
      }}
      source={require("../../assets/images/friends-back.png")}
    >
      <FriendsTopTab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
        <FriendsTopTab.Screen
          name="Find Friends"
          component={FriendsTabScreen}
          options={{
            tabBarLabel: "Find Friends",
          }}
        />
        <FriendsTopTab.Screen
          name="Friends List"
          component={FriendsListTabScreen}
          options={{
            tabBarLabel: "Friends List",
          }}
        />
        <FriendsTopTab.Screen
          name="Requests"
          component={RequestTabScreen}
          options={{
            tabBarLabel: "Requests",
          }}
        />
      </FriendsTopTab.Navigator>
    </ImageBackground>
  )
}

const CustomTabBar: React.FC<MaterialTopTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View
      style={{
        padding: 20,
        paddingBottom: 0,
      }}
    >
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const label = options.tabBarLabel as string

          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          return (
            <TouchableOpacity
              key={route.key}
              style={[
                styles.tabButton,
                {
                  width: "33%",
                },
              ]}
              onPress={onPress}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isFocused ? "#6A74FB" : "#9CA9B7" },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  tabButton: {
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "bold",
  },
})

export default FriendsTab
