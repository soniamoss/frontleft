import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Constants from "expo-constants";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FriendsTabScreen from "../findFriends";
import FriendsListTabScreen from "../friendList";
import RequestTabScreen from "../requests";
import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import ExploreFriendsTab from "../Explore/Friends";
import DropDownPicker from "react-native-dropdown-picker";
import ExploreFoFriendsTab from "../Explore/FoFriends";
import useExplore from "@/hooks/useExplore";

type FriendsTopTabParamList = {
  "Friends of Friends": undefined;
  "My Friends": undefined;
  Requests: undefined;
};

const FriendsTopTab = createMaterialTopTabNavigator<FriendsTopTabParamList>();

const FriendsTab: React.FC = () => (
  <ImageBackground
    style={{
      flex: 1,
      paddingTop: Constants.statusBarHeight,
    }}
    source={require("../../assets/images/friends-back.png")}
  >
    <FriendsTopTab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <FriendsTopTab.Screen
        name="Friends of Friends"
        component={ExploreFriendsTab}
        options={{
          tabBarLabel: "Friends of Friends",
        }}
      />
      <FriendsTopTab.Screen
        name="My Friends"
        component={ExploreFoFriendsTab}
        options={{
          tabBarLabel: "My Friends",
        }}
      />
    </FriendsTopTab.Navigator>
  </ImageBackground>
);

const CustomTabBar: React.FC<MaterialTopTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const openSearchPage = () => {
    navigation.navigate("SearchScreen");
  };

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Los Angeles", value: "Los Angeles" },
    { label: "New York", value: "New York" },
    { label: "San Francisco", value: "San Francisco" },
  ]);

  const { selectedLocation, setSelectedLocation } = useExplore();

  return (
    <View
      style={{
        padding: 20,
        paddingTop: 0,
        paddingBottom: 0,
        zIndex: 1000,
      }}
    >
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
          zIndex={10000}
          textStyle={styles.dropdownText}
        />
      </View>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel as string;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={[
                styles.tabButton,
                {
                  width: "50%",
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
          );
        })}

        <TouchableOpacity
          onPress={openSearchPage}
          style={{
            position: "absolute",
            right: 0,
            top: 10,
          }}
        >
          <Image
            source={require("@/assets/images/search.png")}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    position: "relative",
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
    fontFamily: "Poppins",
  },
  pickerWrapper: {
    width: "50%",
    alignSelf: "center",
    zIndex: 1000,
  },
  pickerContainer: {
    height: 50,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dropdownText: {
    color: "#3F407C",
    fontWeight: "700",
    fontSize: 15,
  },
});

export default FriendsTab;
