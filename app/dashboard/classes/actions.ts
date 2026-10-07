'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { requireAdminAction, assertUuids, isUuid } from '@/utils/security/guard'

export async function createClass(formData: FormData) {
  await requireAdminAction()
  const name = String(formData.get('name') || '').trim()
  const locationId = String(formData.get('location_id') || '').trim()

  if (!name || name.length > 100) {
    return { success: false, error: 'Name must be between 1 and 100 characters.' }
  }

  if (!isUuid(locationId)) {
    return { success: false, error: 'Location must be selected.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.rpc('create_class', {
    p_name: name,
    p_location_id: locationId,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/classes')
  revalidatePath('/dashboard', 'layout')
  return { success: true, error: null }
}

export async function updateClassStatus(classId: string, isActive: boolean) {
  await requireAdminAction()
  assertUuids(classId)
  const supabase = await createClient()

  const { error } = await supabase.rpc('update_class_status', {
    p_class_id: classId,
    p_is_active: isActive,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/classes')
  revalidatePath('/dashboard', 'layout')
  return { success: true, error: null }
}


export async function saveClassPolicy(classId: string, packages: string[]) {
  await requireAdminAction()
  assertUuids(classId)

  if (!Array.isArray(packages) || packages.length > 200) {
    return { success: false, error: 'A class policy may contain at most 200 packages.' }
  }

  const normalized = Array.from(
    new Set(
      packages
        .map((pkg) => String(pkg).trim().toLowerCase())
        .filter(Boolean),
    ),
  )

  const invalid = normalized.find((pkg) => !/^[a-z0-9_][a-z0-9_.-]{0,127}$/.test(pkg))
  if (invalid) {
    return { success: false, error: `Invalid Android package name: ${invalid}` }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('set_class_app_policy', {
    p_class_id: classId,
    p_packages: normalized,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/dashboard/classes/${classId}`)
  revalidatePath('/dashboard')
  return {
    success: true,
    error: null,
    version: (data as { version?: string } | null)?.version ?? null,
  }
}
