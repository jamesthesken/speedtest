'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
// import { supabase } from '@/api'

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>()

  return (
    <Auth
      supabaseClient={supabase}
      view="magic_link"
      theme="dark"
      showLinks={false}
      providers={[]}
      redirectTo="http://localhost:3000/auth/callback"
      appearance={{ 
        theme: ThemeSupa, 
        variables: {
          default: {
            colors: {
              brand: '#434190',
              brandAccent: '#3c366b',
            },
          },
        },
      }}
      localization={{
        variables: {
          "magic_link": {
            "email_input_label": "",
            "email_input_placeholder": "User Sign in",
            "button_label": "Send Link",
            "loading_button_label": "Sending Link ...",
            "link_text": "Send a magic link email",
            "confirmation_text": "Check your email for the link"
          },
        },
      }}
    />
  )
}