'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { requireAdminAction, assertUuids } from '@/utils/security/guard'

export async function createLocation(formData: FormData) {
  await requireAdminAction()
  const name = String(formData.get('name') || '').trim()
  const type = String(formData.get('type') || '').trim()

  if (!name || name.length > 100) {
    return { success: false, error: 'Name must be between 1 and 100 characters.' }
  }

  if (type !== 'classroom' && type !== 'library') {
    return { success: false, error: 'Type must be classroom or library.' }
  }

  const supabase = await createClient()

  // Use the backend-authoritative RPC
  const { error } = await supabase.rpc('create_location', {
    p_name: name,
    p_type: type,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/locations')
  revalidatePath('/dashboard', 'layout')
  return { success: true, error: null }
}

export async function deactivateLocation(locationId: string) {
  await requireAdminAction()
  assertUuids(locationId)
  const supabase = await createClient()

  // Use the backend-authoritative RPC
  const { error } = await supabase.rpc('deactivate_location', {
    p_location_id: locationId,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/locations')
  revalidatePath('/dashboard', 'layout')
  return { success: true, error: null }
}

export async function reactivateLocation(locationId: string) {
  await requireAdminAction()
  assertUuids(locationId)
  const supabase = await createClient()

  // Use the backend-authoritative RPC
  const { error } = await supabase.rpc('reactivate_location', {
    p_location_id: locationId,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/locations')
  revalidatePath('/dashboard', 'layout')
  return { success: true, error: null }
}
