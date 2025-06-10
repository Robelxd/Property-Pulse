
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://beflrsnhnkrakfjvdsud.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlZmxyc25obmtyYWtmanZkc3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NTgzOTMsImV4cCI6MjA2NTEzNDM5M30.oDzCjZlM9RgPWkJigg4rOTP6vDMmSpoARcxSZ4O-i94'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
