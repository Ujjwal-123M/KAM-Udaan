import { NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { ADDITIONAL_CONTACTS_TABLE, LEADS_TABLE } from '@/configs/schema';
import { eq } from 'drizzle-orm';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('leadId');

  try {
    if (leadId) {
      const additionalContacts = await db
        .select()
        .from(ADDITIONAL_CONTACTS_TABLE)
        .where(eq(ADDITIONAL_CONTACTS_TABLE.leadId, parseInt(leadId)));
      return NextResponse.json(additionalContacts);
    }
    
    const additionalContacts = await db.select().from(ADDITIONAL_CONTACTS_TABLE);
    return NextResponse.json(additionalContacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();

  try {
    const newContact = await db
      .insert(ADDITIONAL_CONTACTS_TABLE)
      .values(body)
      .returning();
    return NextResponse.json(newContact[0], { status: 201 });
  } catch (error) {
    console.error('Error adding contact:', error);
    return NextResponse.json({ error: 'Failed to add contact' }, { status: 500 });
  }
}

export async function PUT(request) {
  const body = await request.json();
  const { id, ...updateData } = body;

  try {
    const updatedContact = await db
      .update(ADDITIONAL_CONTACTS_TABLE)
      .set(updateData)
      .where(eq(ADDITIONAL_CONTACTS_TABLE.id, id))
      .returning();
    
    if (updatedContact.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedContact[0]);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
  }

  try {
    const deletedContact = await db
      .delete(ADDITIONAL_CONTACTS_TABLE)
      .where(eq(ADDITIONAL_CONTACTS_TABLE.id, parseInt(id)))
      .returning();
    
    if (deletedContact.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}

