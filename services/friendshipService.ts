import { supabase } from "../supabaseClient"; // Import your Supabase client

export async function addFriend(userId, friendId) {
  try {
    const { data, error }: any = await supabase
      .from("friendships")
      .insert([{ user_id: userId, friend_id: friendId, status: "pending" }]);

    if (error) {
      console.error("Error adding friend:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: err.message };
  }
}

export async function acceptFriendship(friendshipId) {
  try {
    const { data, error }: any = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId);

    if (error) {
      console.error("Error accepting friendship:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: err.message };
  }
}

export async function rejectFriendship(friendshipId) {
  try {
    const { data, error }: any = await supabase
      .from("friendships")
      .update({ status: "rejected" })
      .eq("id", friendshipId);

    if (error) {
      console.error("Error rejecting friendship:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: err.message };
  }
}

export async function blockFriendship(friendshipId) {
  try {
    const { data, error }: any = await supabase
      .from("friendships")
      .update({ status: "blocked" })
      .eq("id", friendshipId);

    if (error) {
      console.error("Error blocking friendship:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return { success: false, message: err.message };
  }
}

export async function hideFriendship(friendshipId: any) {
  try {
    const { data, error }: any = await supabase
      .from("friendships")
      .update({ status: "hidden" })
      .eq("id", friendshipId);

    if (error) {
      console.error("Error hiding friendship:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return { success: false, message: err.message };
  }
}
