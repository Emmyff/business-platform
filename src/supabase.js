import { createClient } from "@supabase/supabase-js"

const supabaseUrl = 'https://alkmqpdgqadoetxwrrsq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsa21xcGRncWFkb2V0eHdycnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODU1NTUsImV4cCI6MjA5NDA2MTU1NX0.-l1wvdPK2IMPUsU7QJiKjV5CRKmPGz8lGJ2ZfdWebbQ'

export const supabase = createClient(supabaseUrl, supabaseKey)