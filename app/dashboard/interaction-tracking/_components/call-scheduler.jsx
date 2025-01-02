'use client'

import React, { useState, useEffect } from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast'
import { format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CallScheduler() {
  const [date, setDate] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [leads, setLeads] = useState([])
  const [contacts, setContacts] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsResponse, contactsResponse] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/contacts')
        ])
        const leadsData = await leadsResponse.json()
        const contactsData = await contactsResponse.json()
        setLeads(leadsData)
        setContacts(contactsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast({
          title: "Error",
          description: "Failed to load leads and contacts. Please refresh the page.",
          variant: "destructive",
        })
      }
    }
    fetchData()
  }, [toast])

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    
    try {
      if (!date) {
        throw new Error('Please select a date')
      }

      const selectedTime = formData.get('time')
      if (!selectedTime) {
        throw new Error('Please select a time')
      }

      const response = await fetch('/api/interactions/scheduled-calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId: parseInt(formData.get('leadId')),
          contactId: parseInt(formData.get('contactId')),
          scheduledDate: new Date(`${format(date, 'yyyy-MM-dd')}T${selectedTime}`).toISOString(),
          duration: parseInt(formData.get('duration')),
          notes: formData.get('notes'),
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Call Scheduled",
          description: "The call has been successfully scheduled.",
        })
        setDate(null)
        event.target.reset()
      } else {
        throw new Error(result.error || 'Failed to schedule call')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to schedule the call. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container px-4 py-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle>Schedule a Call</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="leadId">Select Lead</Label>
                <Select name="leadId" required>
                  <SelectTrigger id="leadId" className="mt-1.5">
                    <SelectValue placeholder="Select a lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id.toString()}>
                        {lead.restaurantName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contactId">Contact Person</Label>
                <Select name="contactId" required>
                  <SelectTrigger id="contactId" className="mt-1.5">
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id.toString()}>
                        {contact.contactPerson}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Select Date and Time</Label>
              <div className="grid grid-cols-2 gap-6 mt-1.5">
                <div className="space-y-2">
                  <DatePicker
                    selected={date}
                    onChange={setDate}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholderText="Select a date"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input 
                      type="time" 
                      id="time" 
                      name="time" 
                      required 
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input 
                      type="number" 
                      id="duration" 
                      name="duration"
                      defaultValue={30}
                      min={15}
                      max={120}
                      required 
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      name="notes"
                      placeholder="Add any notes about the call..." 
                      className="mt-1.5"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={isSubmitting || !date}
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Call'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

