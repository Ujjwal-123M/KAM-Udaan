'use server'

import { db } from '@/configs/db'
import { SCHEDULED_CALLS_TABLE, INTERACTIONS_TABLE  } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function markCallDone(callId) {
  try {
    // Fetch the call details
    const [call] = await db
      .select()
      .from(SCHEDULED_CALLS_TABLE)
      .where(eq(SCHEDULED_CALLS_TABLE.id, callId))

    if (!call) {
      throw new Error('Call not found')
    }

    // Begin a transaction
    await db.transaction(async (tx) => {
      // Add an interaction record
      await tx.insert(INTERACTIONS_TABLE).values({
        leadId: call.leadId,
        contactId: call.contactId,
        type: 'call',
        status: 'completed',
        notes: call.notes,
        duration: call.duration,
        createdAt: new Date(),
      })

      // Delete the scheduled call
      await tx.delete(SCHEDULED_CALLS_TABLE).where(eq(SCHEDULED_CALLS_TABLE.id, callId))
    })

    revalidatePath('/interactions')
    return { success: true }
  } catch (error) {
    console.error('Failed to mark call as done:', error)
    return { success: false, error: 'Failed to mark call as done' }
  }
}

