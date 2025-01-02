import { NextResponse } from 'next/server'
import { db } from '@/configs/db'
import { INTERACTIONS_TABLE, ORDERS_TABLE, LEADS_TABLE } from '@/configs/schema'
import { eq } from 'drizzle-orm'

export async function POST(req) {
  try {
    const body = await req.json()
    let orderId = null;
    let contactId = body.contactId;

    // If an order is included, create it first
    if (body.order) {
      const newOrder = await db.insert(ORDERS_TABLE).values({
        leadId: body.leadId,
        totalAmount: body.order.totalAmount,
        notes: body.order.notes,
      }).returning();
      orderId = newOrder[0].id;
    }

    // If it's a primary contact, we need to fetch the contact information from the leads table
    if (body.isPrimaryContact) {
      const lead = await db.select().from(LEADS_TABLE).where(eq(LEADS_TABLE.id, body.leadId)).limit(1);
      if (lead.length > 0) {
        contactId = lead[0].id; // Using the lead's id as the contact id for primary contacts
      } else {
        throw new Error('Lead not found');
      }
    }

    // Create the interaction, including the orderId if an order was created
    const newInteraction = await db.insert(INTERACTIONS_TABLE).values({
      leadId: body.leadId,
      contactId: contactId,
      type: body.type,
      status: body.status,
      notes: body.notes,
      duration: body.duration,
      rating: body.rating,
      orderId,
    }).returning();

    return NextResponse.json(newInteraction[0])
  } catch (error) {
    console.error('Error creating interaction:', error)
    return NextResponse.json({ error: 'Failed to create interaction' }, { status: 500 })
  }
}

