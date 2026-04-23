import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabase'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-wide">MASTERY OS</h1>
          <p className="text-gray-500 text-sm mt-2">Build genuine technical depth.</p>
        </div>
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3b82f6',
                    brandAccent: '#2563eb',
                    inputBackground: '#111827',
                    inputText: '#f9fafb',
                    inputBorder: '#374151',
                    inputBorderFocus: '#3b82f6',
                    inputPlaceholder: '#6b7280',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </div>
  )
}
