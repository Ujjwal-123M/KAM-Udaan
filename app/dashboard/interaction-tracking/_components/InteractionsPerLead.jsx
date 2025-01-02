'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export default function InteractionsPerLead() {
  const [interactionCounts, setInteractionCounts] = useState([])

  useEffect(() => {
    fetchInteractionCounts()
  }, [])

  const fetchInteractionCounts = async () => {
    try {
      const response = await fetch('/api/interactions/count-by-lead')
      if (!response.ok) {
        throw new Error('Failed to fetch interaction counts')
      }
      const data = await response.json()
      setInteractionCounts(data)
    } catch (error) {
      console.error('Error fetching interaction counts:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactions per Lead</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead ID</TableHead>
              <TableHead>Restaurant Name</TableHead>
              <TableHead>Number of Interactions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interactionCounts.map((count) => (
              <TableRow key={count.leadId}>
                <TableCell>{count.leadId}</TableCell>
                <TableCell>{count.restaurantName}</TableCell>
                <TableCell>{count.interactionCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

