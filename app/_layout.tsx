import "react-native-reanimated";

import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";

import React, { useEffect, useState, useRef } from "react";
import { Text, View } from "react-native";
import ExploreProvider from "@/contexts/exploreContext";
import { getCurrentUser } from "@/services/userService";
import { useNotifications } from "@/hooks/useNotifcation";
import { supabase } from "@/supabaseClient";

import { router } from "expo-router";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      console.log(notification.request.content);
      const url = notification.request.content.data?.url;
      const params = notification.request.content.data?.params;
      if (url) {
        router.push({
          pathname: url,
          params: params,
        });
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

export default function RootLayout() {
  useNotificationObserver();
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

  const [isReady, setIsReady] = React.useState(false);
  const { updateToken } = useNotifications();

  useEffect(() => {
    const saveToken = async () => {
      try {
        const user = await getCurrentUser();
        console.log("user: ", user);

        if (user) {
          updateToken(user);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsReady(true);
      }
    };

    supabase.auth.onAuthStateChange((event, session) => {
      console.log("event: ", event);
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        saveToken();
      }
    });
  }, []);

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
