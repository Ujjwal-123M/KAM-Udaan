'use server'

import { db } from '@/configs/db'
import { SCHEDULED_CALLS_TABLE } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function scheduleCall(formData) {
  try {
    const leadId = parseInt(formData.get('leadId') )
    const contactId = parseInt(formData.get('contactId') )
    const dateStr = formData.get('date')  
    const timeStr = formData.get('time') 
    const duration = parseInt(formData.get('duration') )
    const notes = formData.get('notes') 

    // Combine date and time strings into a Date object
    const scheduledDate = new Date(`${dateStr}T${timeStr}`)

    const result = await db.insert(SCHEDULED_CALLS_TABLE).values({
      leadId,
      contactId,
      scheduledDate,
      duration,
      notes,
      status: 'scheduled',
      reminderSent: false,
    }).returning({ id: SCHEDULED_CALLS_TABLE.id })

    revalidatePath('/interactions')
    return { success: true, id: result[0].id }
  } catch (error) {
    console.error('Failed to schedule call:', error)
    return { success: false, error: 'Failed to schedule call' }
  }
}

