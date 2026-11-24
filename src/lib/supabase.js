import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  || ''
)

const isValidSupabaseUrl = (value) => {
  try {
    const url = new URL(value)
    const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    return (
      Boolean(url.hostname)
      && (url.protocol === 'https:' || (isLocalhost && url.protocol === 'http:'))
      && !url.username
      && !url.password
      && !url.search
      && !url.hash
    )
  } catch {
    return false
  }
}

const isValidSupabaseKey = (value) => (
  /^sb_publishable_[A-Za-z0-9_-]+$/.test(value)
  || /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
)

export let supabaseConfigError = ''

if (!supabaseUrl || !supabaseKey) {
  supabaseConfigError = 'Supabase URL or anon/publishable key is missing.'
} else if (!isValidSupabaseUrl(supabaseUrl)) {
  supabaseConfigError = 'Supabase URL is invalid. Use the HTTPS Project URL from your Supabase API settings.'
} else if (!isValidSupabaseKey(supabaseKey)) {
  supabaseConfigError = 'Supabase anon/publishable key is invalid. Check that you copied the complete key without spaces.'
}

export const isSupabaseConfigured = !supabaseConfigError
if (!isSupabaseConfigured) {
  console.error('Supabase contact form configuration invalid:', supabaseConfigError)
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null
