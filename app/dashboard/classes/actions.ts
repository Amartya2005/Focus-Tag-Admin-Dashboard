import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createClass(formData: FormData) {
  const supabase = await createClient()

  const name = String(formData.get('name') || '').trim()
  const locationId = String(formData.get('location_id') || '').trim()

  if (!name || !locationId) {
    return { success: false, error: 'Name and location are required' }
  }

  const { error } = await supabase.rpc('create_class', {
    p_name: name,
    p_location_id: locationId,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/classes')
  return { success: true }
}

export async function setClassActive(classId: string, isActive: boolean) {
  const supabase = await createClient()

  const { error } = await supabase.rpc('set_class_active', {
    p_class_id: classId,
    p_is_active: isActive,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/classes')
  revalidatePath(`/dashboard/classes/${classId}`)
  return { success: true }
}
