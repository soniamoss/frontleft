import { Tabs } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>["name"];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ headerShown: false, title: "Explore" }}
      />
      <Tabs.Screen
        name="Friends"
        options={({ navigation }) => ({
          headerShown: false,

          tabBarIcon: ({ focused }) => (
            <View
              style={[
                {
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              {focused ? (
                <Image
                  source={require("../../assets/images/users-colored.png")}
                  resizeMode="cover"
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
              ) : (
                <Image
                  source={require("../../assets/images/users-grey.png")}
                  resizeMode="cover"
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
              )}
              <Text
                style={[
                  {
                    fontSize: 10,
                    marginTop: 2,
                    color: focused ? "#6A74FB" : "#9CA9B7",
                  },
                ]}
              >
                Friends
              </Text>
            </View>
          ),
        })}
      />
      <Tabs.Screen name="Profile" options={{ headerShown: false }} />
    </Tabs>
  );
}
