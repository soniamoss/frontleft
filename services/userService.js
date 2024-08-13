import { supabase } from '../supabaseClient';


export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()

return user    

}

