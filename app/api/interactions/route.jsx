import { NextResponse } from 'next/server'
import { db } from '@/configs/db'
import { INTERACTIONS_TABLE, LEADS_TABLE } from '@/configs/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const interactions = await db.select().from(INTERACTIONS_TABLE)
      .orderBy(INTERACTIONS_TABLE.createdAt)
    return NextResponse.json(interactions)
  } catch (error) {
    console.error('Error fetching interactions:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

