import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
)

Deno.serve(async (req) => {
  try {
    // Parse the incoming request body to get the user_id
    const { user_id, noti } = await req.json()

    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
      })
    }

    // // Fetch data from the profile table
    const { data, error } = await supabase
      .from("profiles")
      .select("expo_push_token")
      .eq("user_id", user_id)
      .single()

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      })
    }

    if (!data?.expo_push_token) {
      return new Response(JSON.stringify({ error: "Token not found" }), {
        status: 404,
      })
    }

    console.log(data.expo_push_token)

    const nbody = {
      to: data.expo_push_token,
      ...noti,
    }

    console.log(nbody)

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nbody),
    })

    // Return the profile data as JSON
    return new Response(
      JSON.stringify({ message: "Notification sent successfully" }),
      { status: 200 }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    })
  }
})
