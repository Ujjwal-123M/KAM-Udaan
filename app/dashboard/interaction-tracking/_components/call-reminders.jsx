'use client'

import { useEffect, useState } from 'react'
import { Bell, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from '@/hooks/use-toast'
import { formatDistanceToNow, format } from 'date-fns'
import { markCallDone } from '@/app/actions/mark-call-done'


export default function CallReminders() {
  const [calls, setCalls] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  async function fetchCalls() {
    try {
      const response = await fetch('/api/interactions/scheduled-calls')
      const data = await response.json()
      if (data.calls) {
        setCalls(data.calls)
      }
    } catch (error) {
      console.error('Failed to fetch scheduled calls:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCalls()
    // Refresh every minute
    const interval = setInterval(fetchCalls, 60000)
    return () => clearInterval(interval)
  }, [])

  async function handleMarkDone(callId) {
    try {
      const result = await markCallDone(callId)
      if (result.success) {
        toast({
          title: "Call Marked as Done",
          description: "The call has been marked as completed and removed from the schedule.",
        })
        // Remove the call from the local state
        setCalls(calls.filter(call => call.id !== callId))
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark the call as done. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Loading...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Upcoming Calls</CardTitle>
        <Bell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {calls.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming calls scheduled</p>
          ) : (
            calls.slice(0, 5).map((call) => (
              <div key={call.id} className="flex items-center justify-between space-x-4">
                <div>
                  <p className="font-medium">{call.restaurantName}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(call.scheduledDate), 'MMM d, h:mm a')}
                  </p>
                  {call.contactPerson && (
                    <p className="text-sm text-muted-foreground">
                      with {call.contactPerson}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>
                    {formatDistanceToNow(new Date(call.scheduledDate), { addSuffix: true })}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkDone(call.id)}
                    title="Mark as Done"
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Mark as Done</span>
                  </Button>
                </div>
              </div>
            ))
          )}

          {calls.length > 5 && (
            <Button variant="outline" className="w-full">
              View All ({calls.length}) Scheduled Calls
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

