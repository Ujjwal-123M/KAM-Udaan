import { NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { LEADS_TABLE } from '@/configs/schema';
import { eq } from 'drizzle-orm';

export async function POST(request) {
  const body = await request.json();
  
  try {
    const newLead = await db.insert(LEADS_TABLE).values(body).returning();
    return NextResponse.json(newLead[0], { status: 201 });
  } catch (error) {
    console.error('Error adding lead:', error);
    return NextResponse.json({ error: 'Failed to add lead' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allLeads = await db.select().from(LEADS_TABLE);
    return NextResponse.json(allLeads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PUT(request) {
  const body = await request.json();
  const { id, ...updateData } = body;

  try {
    const updatedLead = await db.update(LEADS_TABLE)
      .set(updateData)
      .where(eq(LEADS_TABLE.id, id))
      .returning();
    
    if (updatedLead.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedLead[0]);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
  }

  try {
    const deletedLead = await db.delete(LEADS_TABLE)
      .where(eq(LEADS_TABLE.id, parseInt(id)))
      .returning();
    
    if (deletedLead.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
