'use server'

import { db } from '@/configs/db'
import { sql } from 'drizzle-orm'
import { LEADS_TABLE, ORDERS_TABLE, INTERACTIONS_TABLE, POTENTIAL_ORDERS_TABLE } from '@/configs/schema'

export async function fetchPerformanceData() {
  const currentDate = new Date()
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  const revenueData = await db.select({
    leadId: LEADS_TABLE.id,
    restaurantName: LEADS_TABLE.restaurantName,
    totalRevenue: sql`CAST(SUM(${ORDERS_TABLE.totalAmount}) AS FLOAT)`,
    orderCount: sql`COUNT(${ORDERS_TABLE.id})`,
    avgOrderValue: sql`CAST(AVG(${ORDERS_TABLE.totalAmount}) AS FLOAT)`,
    lastOrderDate: sql`MAX(${ORDERS_TABLE.orderDate})`,
  })
  .from(LEADS_TABLE)
  .leftJoin(ORDERS_TABLE, sql`${ORDERS_TABLE.leadId} = ${LEADS_TABLE.id}`)
  .groupBy(LEADS_TABLE.id, LEADS_TABLE.restaurantName)
  .orderBy(sql`SUM(${ORDERS_TABLE.totalAmount}) DESC`)

  const ratingData = await db.select({
    leadId: LEADS_TABLE.id,
    restaurantName: LEADS_TABLE.restaurantName,
    avgRating: sql`CAST(AVG(${INTERACTIONS_TABLE.rating}) AS FLOAT)`,
    interactionCount: sql`COUNT(${INTERACTIONS_TABLE.id})`,
    lastInteractionDate: sql`MAX(${INTERACTIONS_TABLE.createdAt})`,
  })
  .from(LEADS_TABLE)
  .leftJoin(INTERACTIONS_TABLE, sql`${INTERACTIONS_TABLE.leadId} = ${LEADS_TABLE.id}`)
  .groupBy(LEADS_TABLE.id, LEADS_TABLE.restaurantName)
  .orderBy(sql`AVG(${INTERACTIONS_TABLE.rating}) DESC`)

  const monthlyRevenue = await db.select({
    totalRevenue: sql`CAST(SUM(${ORDERS_TABLE.totalAmount}) AS FLOAT)`,
    orderCount: sql`COUNT(${ORDERS_TABLE.id})`,
  })
  .from(ORDERS_TABLE)
  .where(sql`${ORDERS_TABLE.orderDate} >= ${startOfMonth} AND ${ORDERS_TABLE.orderDate} <= ${endOfMonth}`)

  const potentialRevenue = await db.select({
    totalPotentialRevenue: sql`CAST(SUM(${POTENTIAL_ORDERS_TABLE.estimatedAmount}) AS FLOAT)`,
    potentialOrderCount: sql`COUNT(${POTENTIAL_ORDERS_TABLE.id})`,
  })
  .from(POTENTIAL_ORDERS_TABLE)
  .where(sql`${POTENTIAL_ORDERS_TABLE.expectedDate} > ${currentDate}`)

  const monthlyRevenueBreakdown = await db.select({
    date: sql`DATE(${ORDERS_TABLE.orderDate})`,
    dailyRevenue: sql`CAST(SUM(${ORDERS_TABLE.totalAmount}) AS FLOAT)`,
  })
  .from(ORDERS_TABLE)
  .where(sql`${ORDERS_TABLE.orderDate} >= ${startOfMonth} AND ${ORDERS_TABLE.orderDate} <= ${endOfMonth}`)
  .groupBy(sql`DATE(${ORDERS_TABLE.orderDate})`)
  .orderBy(sql`DATE(${ORDERS_TABLE.orderDate})`)

  const lowPerformingLeads = revenueData.filter(lead => 
    lead.orderCount < 5 || 
    (ratingData.find(r => r.leadId === lead.leadId)?.avgRating || 0) < 3
  ).sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0))

  return {
    revenueData,
    ratingData,
    lowPerformingLeads,
    monthlyRevenue: monthlyRevenue[0],
    potentialRevenue: potentialRevenue[0],
    monthlyRevenueBreakdown,
  }
}

