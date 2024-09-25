import * as Notifications from 'expo-notifications'
import { Alert, Platform } from 'react-native'
import * as Constants from 'expo-constants'
import { supabase } from '@/supabaseClient'


export function useNotifications() {
  const checkPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()

    if (existingStatus !== 'granted') return false
    else return true
  }

  const AskForPermission = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') return false

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.default.expoConfig.extra.projectId,
    })

    return token?.data
  }

  const updateToken = async (user: any) => {
    const token = await AskForPermission()

    console.log("token: ", token);

    if (token) {
      try {
        const { data, error } = await supabase
        .from("profiles")
        .update({
          expo_push_token: token,
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        return null;
      }
      } catch (error) {
        console.log(error)
      }
    }
  }


  return {
    checkPermission,
    AskForPermission,
    updateToken,
  }
}
