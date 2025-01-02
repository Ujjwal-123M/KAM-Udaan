'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from '@/hooks/use-toast'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Printer } from 'lucide-react'
import { InvoiceModal } from './_components/InvoiceModal'
import CallReminders from '../interaction-tracking/_components/call-reminders'

export default function InteractionsPage() {
  const [leads, setLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [interactionType, setInteractionType] = useState('call')
  const [isInteracting, setIsInteracting] = useState(false)
  const [interactionDuration, setInteractionDuration] = useState(0)
  const [notes, setNotes] = useState('')
  const [rating, setRating] = useState(0)
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [orderAmount, setOrderAmount] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [recentOrders, setRecentOrders] = useState([])
  const [potentialOrders, setPotentialOrders] = useState([])
  const [isLoading, setIsLoading] = useState({
    leads: true,
    contacts: true,
    recentOrders: true,
    potentialOrders: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    fetchLeads()
    fetchContacts()
    fetchRecentOrders()
    fetchPotentialOrders()
  }, [])

  const fetchLeads = async () => {
    setIsLoading(prev => ({ ...prev, leads: true }))
    try {
      const response = await fetch('/api/leads')
      const data = await response.json()
      setLeads(data.map(lead => ({
        ...lead,
        primaryContact: lead.contactPerson || 'No primary contact'
      })))
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast({
        title: "Error",
        description: "Failed to fetch leads. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(prev => ({ ...prev, leads: false }))
    }
  }

  const fetchContacts = async () => {
    setIsLoading(prev => ({ ...prev, contacts: true }))
    try {
      const response = await fetch('/api/contacts')
      const data = await response.json()
      setContacts(data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast({
        title: "Error",
        description: "Failed to fetch contacts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(prev => ({ ...prev, contacts: false }))
    }
  }

  const fetchRecentOrders = async () => {
    setIsLoading(prev => ({ ...prev, recentOrders: true }))
    try {
      const response = await fetch('/api/call/recent-orders')
      const data = await response.json()
      const validatedData = data.map(order => ({
        ...order,
        totalAmount: typeof order.totalAmount === 'number' ? order.totalAmount : parseFloat(order.totalAmount) || 0
      }))
      setRecentOrders(validatedData)
    } catch (error) {
      console.error('Error fetching recent orders:', error)
      toast({
        title: "Error",
        description: "Failed to fetch recent orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(prev => ({ ...prev, recentOrders: false }))
    }
  }

  const fetchPotentialOrders = async () => {
    setIsLoading(prev => ({ ...prev, potentialOrders: true }))
    try {
      const response = await fetch('/api/call/potential-orders')
      const data = await response.json()
      const validatedData = data.map(order => ({
        ...order,
        estimatedAmount: typeof order.estimatedAmount === 'number' ? order.estimatedAmount : parseFloat(order.estimatedAmount) || 0
      }))
      setPotentialOrders(validatedData)
    } catch (error) {
      console.error('Error fetching potential orders:', error)
      toast({
        title: "Error",
        description: "Failed to fetch potential orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(prev => ({ ...prev, potentialOrders: false }))
    }
  }

  const handleStartInteraction = () => {
    setIsInteracting(true)
    const duration = Math.floor(Math.random() * 300) + 60
    let elapsed = 0
    const timer = setInterval(() => {
      elapsed += 1
      setInteractionDuration(elapsed)
      if (elapsed >= duration) {
        clearInterval(timer)
        setIsInteracting(false)
      }
    }, 1000)
  }

  const isFormValid = () => {
    if (!selectedLead || !selectedContact || !interactionType || !notes || rating === 0 || isInteracting) {
      return false;
    }
    if (isOrderPlaced) {
      return orderAmount !== '' && orderNotes !== '';
    }
    return true;
  };

  const handleEndInteraction = async () => {
    if (!isFormValid()) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all required fields before saving the interaction.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true)

    // Check if selectedContact exists and is a string before using startsWith
    const isPrimaryContact = typeof selectedContact === 'string' && selectedContact.startsWith('primary_')

    const interactionData = {
      leadId: selectedLead,
      contactId: isPrimaryContact ? null : selectedContact,
      isPrimaryContact: isPrimaryContact,
      type: interactionType,
      status: 'completed',
      notes,
      duration: interactionDuration,
      rating,
    }

    if (isOrderPlaced) {
      interactionData.order = {
        totalAmount: parseFloat(orderAmount),
        notes: orderNotes,
      }
    }

    try {
      const response = await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interactionData),
      })

      if (response.ok) {
        toast({
          title: "Interaction saved",
          description: isOrderPlaced ? "The interaction and order have been recorded successfully." : "The interaction has been recorded successfully.",
        })
        // Reload the page
        window.location.reload()
      } else {
        throw new Error('Failed to save interaction')
      }
    } catch (error) {
      console.error('Error saving interaction:', error)
      toast({
        title: "Error",
        description: "Failed to save the interaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setSelectedLead(null)
    setSelectedContact(null)
    setInteractionType('call')
    setNotes('')
    setRating(0)
    setIsOrderPlaced(false)
    setOrderAmount('')
    setOrderNotes('')
  }

  const handleMarkAsComplete = async (orderId) => {
    try {
      const response = await fetch(`/api/call/mark-complete/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        toast({
          title: "Order updated",
          description: "The order has been marked as complete.",
        })
        fetchRecentOrders()
      } else {
        throw new Error('Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast({
        title: "Error",
        description: "Failed to mark the order as complete. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePrintInvoice = (order) => {
    setSelectedOrder(order)
    setInvoiceModalOpen(true)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Interactions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>New Interaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={(value) => setSelectedLead(value)} required>
                <SelectTrigger className={!selectedLead ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a lead" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading.leads ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Loading leads...</span>
                    </div>
                  ) : (
                    leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>{lead.restaurantName}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setSelectedContact(value)} required>
                <SelectTrigger className={!selectedContact ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading.contacts ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Loading contacts...</span>
                    </div>
                  ) : (
                    <>
                      {selectedLead && (
                        <SelectItem value={`primary_${selectedLead}`}>
                          {leads.find(lead => lead.id === selectedLead)?.primaryContact || 'Primary Contact'}
                        </SelectItem>
                      )}
                      {contacts
                        .filter(contact => contact.leadId === selectedLead)
                        .map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>{contact.contactPerson}</SelectItem>
                        ))
                      }
                    </>
                  )}
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setInteractionType(value)} required>
                <SelectTrigger className={!interactionType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select interaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>

              {!isInteracting ? (
                <Button onClick={handleStartInteraction} disabled={!selectedLead || !selectedContact}>
                  Start Interaction
                </Button>
              ) : (
                <div>
                  <p>Interaction in progress... Duration: {interactionDuration} seconds</p>
                  <Button onClick={() => setIsInteracting(false)}>End Interaction</Button>
                </div>
              )}

              <Textarea
                placeholder="Notes about the interaction"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={!notes ? "border-red-500" : ""}
                required
              />

              <div>
                <p className={rating === 0 ? "text-red-500" : ""}>Rate the interaction (required):</p>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant={rating >= star ? "default" : "outline"}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </Button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="order-placed" checked={isOrderPlaced} onCheckedChange={setIsOrderPlaced} />
                <Label htmlFor="order-placed">Order Placed</Label>
              </div>

              {isOrderPlaced && (
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Order Amount"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    className={isOrderPlaced && !orderAmount ? "border-red-500" : ""}
                    required
                  />
                  <Textarea
                    placeholder="Order Notes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className={isOrderPlaced && !orderNotes ? "border-red-500" : ""}
                    required
                  />
                </div>
              )}

              <Button onClick={handleEndInteraction} disabled={!isFormValid() || isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Interaction'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading.recentOrders ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading recent orders...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.restaurantName}</TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {order.status === 'Pending' ? (
                              <Button onClick={() => handleMarkAsComplete(order.id)} size="sm">
                                Mark as Complete
                              </Button>
                            ) : (
                              <Button onClick={() => handlePrintInvoice(order)} size="sm" variant="outline">
                                <Printer className="h-4 w-4 mr-2" />
                                Print Invoice
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Potential Orders Card commented out for now
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Potential Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading.potentialOrders ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading potential orders...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Expected Date</TableHead>
                      <TableHead>Estimated Amount</TableHead>
                      <TableHead>Probability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {potentialOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.restaurantName}</TableCell>
                        <TableCell>{new Date(order.expectedDate).toLocaleDateString()}</TableCell>
                        <TableCell>${order.estimatedAmount.toFixed(2)}</TableCell>
                        <TableCell>{order.probability}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card> */}

          <CallReminders />

        </div>
      </div>
      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  )
}