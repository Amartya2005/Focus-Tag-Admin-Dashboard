'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { requireAdminAction, assertUuids } from '@/utils/security/guard'

export async function searchUnassignedUsers(searchTerm: string) {
  await requireAdminAction()
  if (typeof searchTerm !== 'string' || searchTerm.trim().length < 3 || searchTerm.length > 254) {
    return { data: null, error: 'Search term must be 3-254 characters.' }
  }
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('search_unassigned_users', {
    search_email: searchTerm,
  })

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function assignUserToInstitution(targetUserId: string) {
  await requireAdminAction()
  assertUuids(targetUserId)
  const supabase = await createClient()

  const { error } = await supabase.rpc('assign_user_to_institution', {
    target_user_id: targetUserId,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/students')
  revalidatePath('/dashboard', 'layout')
  return { success: true, error: null }
}
