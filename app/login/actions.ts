'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!EMAIL_RE.test(email) || email.length > 254 || password.length < 1 || password.length > 128) {
    redirect('/login?message=Could not authenticate user')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
