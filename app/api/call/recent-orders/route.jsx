import { NextResponse } from 'next/server'
import { db } from '@/configs/db'
import { ORDERS_TABLE, LEADS_TABLE } from '@/configs/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET() {
  try {
    const recentOrders = await db
      .select({
        id: ORDERS_TABLE.id,
        orderDate: ORDERS_TABLE.orderDate,
        totalAmount: ORDERS_TABLE.totalAmount,
        status: ORDERS_TABLE.status,
        restaurantName: LEADS_TABLE.restaurantName,
      })
      .from(ORDERS_TABLE)
      .innerJoin(LEADS_TABLE, eq(ORDERS_TABLE.leadId, LEADS_TABLE.id))
      .orderBy(desc(ORDERS_TABLE.orderDate))
      .limit(5)

    return NextResponse.json(recentOrders)
  } catch (error) {
    console.error('Error fetching recent orders:', error)
    return NextResponse.json({ error: 'Failed to fetch recent orders' }, { status: 500 })
  }
}

