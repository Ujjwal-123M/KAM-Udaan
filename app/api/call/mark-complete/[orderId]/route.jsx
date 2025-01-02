import { NextResponse } from 'next/server'
import { db } from '@/configs/db'
import { ORDERS_TABLE } from '@/configs/schema'
import { eq } from 'drizzle-orm'

export async function PUT(
  request,
  { params }
) {
  const orderId = await parseInt(params.orderId, 10)

  if (isNaN(orderId)) {
    return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
  }

  try {
    await db.update(ORDERS_TABLE)
      .set({ status: 'Completed' })
      .where(eq(ORDERS_TABLE.id, orderId))

    return NextResponse.json({ message: 'Order marked as complete' })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

