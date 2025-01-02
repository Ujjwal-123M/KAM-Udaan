import { db } from '@/configs/db'
import { SCHEDULED_CALLS_TABLE, LEADS_TABLE, ADDITIONAL_CONTACTS_TABLE, INTERACTIONS_TABLE } from '@/configs/schema'
import { eq, gt } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const now = new Date()
    const scheduledCalls = await db
      .select({
        id: SCHEDULED_CALLS_TABLE.id,
        scheduledDate: SCHEDULED_CALLS_TABLE.scheduledDate,
        duration: SCHEDULED_CALLS_TABLE.duration,
        notes: SCHEDULED_CALLS_TABLE.notes,
        status: SCHEDULED_CALLS_TABLE.status,
        restaurantName: LEADS_TABLE.restaurantName,
        contactPerson: ADDITIONAL_CONTACTS_TABLE.contactPerson,
      })
      .from(SCHEDULED_CALLS_TABLE)
      .leftJoin(LEADS_TABLE, eq(SCHEDULED_CALLS_TABLE.leadId, LEADS_TABLE.id))
      .leftJoin(ADDITIONAL_CONTACTS_TABLE, eq(SCHEDULED_CALLS_TABLE.contactId, ADDITIONAL_CONTACTS_TABLE.id))
      .where(
        eq(SCHEDULED_CALLS_TABLE.status, 'scheduled'),
        gt(SCHEDULED_CALLS_TABLE.scheduledDate, now)
      )
      .orderBy(SCHEDULED_CALLS_TABLE.scheduledDate)

    return NextResponse.json({ calls: scheduledCalls })
  } catch (error) {
    console.error('Failed to fetch scheduled calls:', error)
    return NextResponse.json({ error: 'Failed to fetch scheduled calls' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { leadId, contactId, scheduledDate, duration, notes } = await request.json()

    // Validate input
    if (!leadId || !contactId || !scheduledDate || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await db.insert(SCHEDULED_CALLS_TABLE).values({
      leadId,
      contactId,
      scheduledDate: new Date(scheduledDate),
      duration,
      notes,
      status: 'scheduled',
      reminderSent: false,
    }).returning({ id: SCHEDULED_CALLS_TABLE.id })

    if (result.length === 0) {
      throw new Error('Failed to insert scheduled call')
    }

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error('Failed to schedule call:', error)
    return NextResponse.json({ error: 'Failed to schedule call' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing call id' }, { status: 400 })
    }

    const [call] = await db
      .select()
      .from(SCHEDULED_CALLS_TABLE)
      .where(eq(SCHEDULED_CALLS_TABLE.id, id))

    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    await db.transaction(async (tx) => {
      await tx.insert(INTERACTIONS_TABLE).values({
        leadId: call.leadId,
        contactId: call.contactId,
        type: 'call',
        status: 'completed',
        notes: call.notes,
        duration: call.duration,
        createdAt: new Date(),
      })

      await tx.update(SCHEDULED_CALLS_TABLE)
        .set({ status: 'completed' })
        .where(eq(SCHEDULED_CALLS_TABLE.id, id))
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to mark call as done:', error)
    return NextResponse.json({ error: 'Failed to mark call as done' }, { status: 500 })
  }
}
