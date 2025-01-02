'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export default function InteractionsList() {
  const [interactions, setInteractions] = useState([])

  useEffect(() => {
    fetchInteractions()
  }, [])

  const fetchInteractions = async () => {
    try {
      const response = await fetch('/api/interactions')
      if (!response.ok) {
        throw new Error('Failed to fetch interactions')
      }
      const data = await response.json()
      setInteractions(data)
    } catch (error) {
      console.error('Error fetching interactions:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interaction Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead ID</TableHead>
              <TableHead>Contact ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration (s)</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interactions.map((interaction) => (
              <TableRow key={interaction.id}>
                <TableCell>{interaction.leadId}</TableCell>
                <TableCell>{interaction.contactId}</TableCell>
                <TableCell>{interaction.type}</TableCell>
                <TableCell>{interaction.status}</TableCell>
                <TableCell>{interaction.duration}</TableCell>
                <TableCell>{interaction.rating}</TableCell>
                <TableCell>{new Date(interaction.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

