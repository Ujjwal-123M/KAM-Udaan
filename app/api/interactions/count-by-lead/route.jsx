import { NextResponse } from 'next/server'
import { db } from '@/configs/db'
import { INTERACTIONS_TABLE, LEADS_TABLE } from '@/configs/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET() {
  try {
    const interactionCounts = await db
      .select({
        leadId: LEADS_TABLE.id,
        restaurantName: LEADS_TABLE.restaurantName,
        interactionCount: sql`count(${INTERACTIONS_TABLE.id})::int`.as('interactionCount'),
      })
      .from(LEADS_TABLE)
      .leftJoin(INTERACTIONS_TABLE, eq(LEADS_TABLE.id, INTERACTIONS_TABLE.leadId))
      .groupBy(LEADS_TABLE.id, LEADS_TABLE.restaurantName)
      .orderBy(sql`count(${INTERACTIONS_TABLE.id}) DESC`)

    return NextResponse.json(interactionCounts)
  } catch (error) {
    console.error('Error fetching interaction counts:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

