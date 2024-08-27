import ExploreTab from "@/screens/BottomTabs/ExploreTab";
import ProfileTab from "@/screens/BottomTabs/ProfileTab";
import EmailScreen from "@/screens/email";
import EventDetails from "@/screens/EventDetails";
import ShowContacts from "@/screens/findFriends";
import FirstNameScreen from "@/screens/firstname";
import getContacts from "@/screens/getContacts";
import IntroScreen from "@/screens/intro";
import LastNameScreen from "@/screens/lastname";
import Notifications from "@/screens/Notifications";
import PhoneLoginScreen from "@/screens/PhoneLogin";
import PrivacySettings from "@/screens/privacysettings";
import SearchPage from "@/screens/SearchPage";
import settings from "@/screens/settings";
import UsernameScreen from "@/screens/username";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
