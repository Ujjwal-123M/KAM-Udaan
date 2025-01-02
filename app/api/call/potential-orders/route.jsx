import { NextResponse } from 'next/server'
import { db } from '@/configs/db'
import { POTENTIAL_ORDERS_TABLE, LEADS_TABLE } from '@/configs/schema'
import { asc, eq } from 'drizzle-orm'

export async function GET() {
  try {
    const potentialOrders = await db
      .select({
        id: POTENTIAL_ORDERS_TABLE.id,
        expectedDate: POTENTIAL_ORDERS_TABLE.expectedDate,
        estimatedAmount: POTENTIAL_ORDERS_TABLE.estimatedAmount,
        probability: POTENTIAL_ORDERS_TABLE.probability,
        restaurantName: LEADS_TABLE.restaurantName,
      })
      .from(POTENTIAL_ORDERS_TABLE)
      .innerJoin(LEADS_TABLE, eq(POTENTIAL_ORDERS_TABLE.leadId, LEADS_TABLE.id))
      .orderBy(asc(POTENTIAL_ORDERS_TABLE.expectedDate))
      .limit(5)

    return NextResponse.json(potentialOrders)
  } catch (error) {
    console.error('Error fetching potential orders:', error)
    return NextResponse.json({ error: 'Failed to fetch potential orders' }, { status: 500 })
  }
}

