import { supabase } from "@/supabaseClient";

interface NotificationProps {
  title?: string;
  body?: string;
  data?: { [key: string]: any };
  userId?: string;
}
export const sendNotifications = async ({userId,title,body,data}: NotificationProps) => {
    const { data: resData , error } = await supabase.functions.invoke(
      "send-notifications",
      {
        body: {
          user_id: userId,
          // user_id: "da07c7d4-50fe-4082-96bd-ad4933dd1bf5",
          noti: {
            title,
            body,
            data
          },
        },
      }
    );
    if (error) {
      console.error("Error invoking function:", error);
    } else {
      console.log("Function invoked successfully:", resData);
    }
}