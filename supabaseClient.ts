

// project/supabaseClient.ts


import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';




// Access environment variables
// const SUPABASE_URL = Constants.manifest2.extra.SUPABASE_URL;
// const SUPABASE_KEY = Constants.manifest2.extra.SUPABASE_KEY;
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;
const SUPABASE_TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;




if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }


export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);



