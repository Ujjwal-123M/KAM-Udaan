'use client'

import { useState } from 'react'
import { Table } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

export function PerformanceOverview({ data }) {
  const [selectedTab, setSelectedTab] = useState('revenue')

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  const revenueChartData = data.revenueData
  .filter(lead => lead.totalRevenue > 0)
  .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
  .slice(0, 10)
  .map(lead => ({
    name: lead.restaurantName,
    revenue: lead.totalRevenue || 0
  }))

  const ratingChartData = data.ratingData.slice(0, 10).map(lead => ({
    name: lead.restaurantName,
    rating: lead.avgRating || 0
  }))

  const monthlyRevenueChartData = data.monthlyRevenueBreakdown
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    revenue: item.dailyRevenue || 0
  }))

  const topPerformers = data.revenueData
  .filter(lead => lead.totalRevenue > 0)
  .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
  .slice(0, 5)

  const totalRevenue = topPerformers.reduce((sum, lead) => sum + (lead.totalRevenue || 0), 0)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.monthlyRevenue.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {data.monthlyRevenue.orderCount} orders this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Potential Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.potentialRevenue.totalPotentialRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {data.potentialRevenue.potentialOrderCount} potential orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.revenueData.reduce((sum, lead) => sum + (lead.avgOrderValue || 0), 0) / data.revenueData.length)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.ratingData.reduce((sum, lead) => sum + lead.interactionCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueChartData}>
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          {topPerformers.map((lead) => (
            <div key={lead.leadId} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{lead.restaurantName}</span>
                <span>{formatCurrency(lead.totalRevenue || 0)}</span>
              </div>
              <Progress 
                value={(lead.totalRevenue / totalRevenue) * 100} 
                className="h-2"
                indicatorclassname="bg-primary"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="rating">Rating</TabsTrigger>
          <TabsTrigger value="lowPerforming">Low Performing</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Generators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Table>
                <thead>
                  <tr>
                    <th>Restaurant</th>
                    <th>Revenue</th>
                    <th>Orders</th>
                    <th>Avg Order Value</th>
                    <th>Last Order</th>
                  </tr>
                </thead>
                <tbody>
                  {data.revenueData.slice(0, 5).map((lead) => (
                    <tr key={lead.leadId}>
                      <td>{lead.restaurantName}</td>
                      <td>{formatCurrency(lead.totalRevenue || 0)}</td>
                      <td>{lead.orderCount}</td>
                      <td>{formatCurrency(lead.avgOrderValue || 0)}</td>
                      <td>{lead.lastOrderDate ? new Date(lead.lastOrderDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rating">
          <Card>
            <CardHeader>
              <CardTitle>Top Rated Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingChartData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="rating" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Table>
                <thead>
                  <tr>
                    <th>Restaurant</th>
                    <th>Avg Rating</th>
                    <th>Interactions</th>
                    <th>Last Interaction</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ratingData.slice(0, 5).map((lead) => (
                    <tr key={lead.leadId}>
                      <td>{lead.restaurantName}</td>
                      <td>{lead.avgRating ? lead.avgRating.toFixed(2) : 'N/A'}</td>
                      <td>{lead.interactionCount}</td>
                      <td>{lead.lastInteractionDate ? new Date(lead.lastInteractionDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="lowPerforming">
          <Card>
            <CardHeader>
              <CardTitle>Low Performing Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <thead>
                  <tr>
                    <th>Restaurant</th>
                    <th>Revenue</th>
                    <th>Orders</th>
                    <th>Avg Rating</th>
                    <th>Last Interaction</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lowPerformingLeads.slice(0, 5).map((lead) => (
                    <tr key={lead.leadId}>
                      <td>{lead.restaurantName}</td>
                      <td>{formatCurrency(lead.totalRevenue || 0)}</td>
                      <td>{lead.orderCount}</td>
                      <td>{data.ratingData.find(r => r.leadId === lead.leadId)?.avgRating?.toFixed(2) || 'N/A'}</td>
                      <td>{data.ratingData.find(r => r.leadId === lead.leadId)?.lastInteractionDate ? 
                          new Date(data.ratingData.find(r => r.leadId === lead.leadId).lastInteractionDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

