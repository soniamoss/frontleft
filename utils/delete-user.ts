import { supabase } from "@/supabaseClient"

interface RequestProp {
  userId: string
}

export const deleteUser = async ({ userId }: RequestProp) => {
  const { data: resData, error } = await supabase.functions.invoke(
    "delete-user",
    {
      body: {
        user_id: userId,
      },
    }
  )
  if (error) {
    throw error
  } else {
    console.log("Function invoked successfully:", resData)
  }
}
