import "react-native-reanimated";

import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

import React, { useEffect } from "react";
import { Text, View } from "react-native";
import ExploreProvider from "@/contexts/exploreContext";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const toastConfig = {
  tomatoToast: ({ text1 = "" }) => (
    <View
      style={{
        height: 60,
        width: "90%",
        backgroundColor: "#DF5A76",
        borderRadius: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 15,
          fontWeight: "700",
          flex: 1,
        }}
      >
        {text1}
      </Text>
      <AntDesign name="closecircleo" size={24} color="#fff" />
    </View>
  ),
  successToast: ({ text1 = "" }) => (
    <View
      style={{
        height: 60,
        width: "90%",
        backgroundColor: "#6A74FB",
        borderRadius: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 15,
          fontWeight: "700",
          flex: 1,
        }}
      >
        {text1}
      </Text>
      <AntDesign name="checkcircleo" size={24} color="#fff" />
    </View>
  ),
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Chicle: require("../assets/fonts/Chicle-Regular.ttf"),
    PoppinsBlack: require("../assets/fonts/Poppins-Black.ttf"),
    PoppinsBlackItalic: require("../assets/fonts/Poppins-BlackItalic.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsBoldItalic: require("../assets/fonts/Poppins-BoldItalic.ttf"),
    PoppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    PoppinsExtraBoldItalic: require("../assets/fonts/Poppins-ExtraBoldItalic.ttf"),
    PoppinsExtraLight: require("../assets/fonts/Poppins-ExtraLight.ttf"),
    PoppinsExtraLightItalic: require("../assets/fonts/Poppins-ExtraLightItalic.ttf"),
    PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
    PoppinsLightItalic: require("../assets/fonts/Poppins-LightItalic.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsMediumItalic: require("../assets/fonts/Poppins-MediumItalic.ttf"),
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsSemiBoldItalic: require("../assets/fonts/Poppins-SemiBoldItalic.ttf"),
    PoppinsThin: require("../assets/fonts/Poppins-Thin.ttf"),
    PoppinsThinItalic: require("../assets/fonts/Poppins-ThinItalic.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <ExploreProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ExploreProvider>
      <Toast config={toastConfig} />
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
