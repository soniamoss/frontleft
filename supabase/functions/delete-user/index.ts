import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  try {
    
    console.log("Request received");
    const { user_id } = await req.json();
  
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }
  
    const { data, error } = await supabase.auth.admin.deleteUser(user_id);
  
    if (error) {
      console.error('Error deleting user:', error);
      return new Response(JSON.stringify({ error: error }), { status: 500 });
    }

    const { data: data2, error: error2 } = await supabase.from('profiles').update({
      first_name: "Deleted",
      last_name: "User",
      username: null,
      email: null,
      profile_image_url: null,
      onboarding_complete: false,
      phonenumber: null,
      contact_sync: false,
      expo_push_token: null,
      notifications: false,
    }).eq('user_id', user_id)

    if (error2) {
      console.error('Error deleting user:', error2);
      return new Response(JSON.stringify({ error: error2 }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
});
