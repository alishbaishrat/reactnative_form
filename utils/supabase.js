// lib/supabase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as ExpoLinking from "expo-linking";

const redirectUrl = ExpoLinking.createURL("reset-passwords");

// replace with your values
const SUPABASE_URL = 'https://tdxzdrbxdocxyiqfjwdl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeHpkcmJ4ZG9jeHlpcWZqd2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjQ3NzYsImV4cCI6MjA3NDcwMDc3Nn0.BudrshYcPIz01nq3cQ6UvYca5oC9jJ3H0t2kp1KF9X0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    detectSessionInUrl: false,
    redirectTo: redirectUrl,
  },
});
