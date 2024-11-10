import { supabase } from "../supabaseClient"

export async function getCurrentUser() {
  const {
    data: { user },
  }: any = await supabase.auth.getUser()

  return user
}
