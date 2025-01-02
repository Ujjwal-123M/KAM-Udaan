"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Edit, Plus, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const contactSchema = z.object({
  id: z.number().optional(),
  leadId: z.number(),
  contactPerson: z
    .string()
    .min(2, { message: "Contact person must be at least 2 characters." }),
  contactEmail: z.string().email({ message: "Invalid email address." }),
  contactPhone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters." }),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
});

const ContactManagement = () => {
  const [leads, setLeads] = useState([]);
  const [additionalContacts, setAdditionalContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      id: undefined,
      leadId: 0,
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      role: "",
    },
  });

  useEffect(() => {
    fetchLeads();
    fetchAdditionalContacts();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/leads");
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else {
        throw new Error("Failed to fetch leads");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Error",
        description: "Failed to fetch leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdditionalContacts = async () => {
    try {
      const response = await fetch("/api/contacts");
      if (response.ok) {
        const data = await response.json();
        setAdditionalContacts(data);
      } else {
        throw new Error("Failed to fetch additional contacts");
      }
    } catch (error) {
      console.error("Error fetching additional contacts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch additional contacts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmitContact = async (data) => {
    try {
      const method = data.id ? "PUT" : "POST";
      const response = await fetch("/api/contacts", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchAdditionalContacts();
        setIsContactDialogOpen(false);
        form.reset();
        toast({
          title: "Success",
          description: `Contact ${data.id ? "updated" : "added"} successfully.`,
        });
      } else {
        throw new Error(`Failed to ${data.id ? "update" : "add"} contact`);
      }
    } catch (error) {
      console.error("Error managing contact:", error);
      toast({
        title: "Error",
        description: `An error occurred while ${
          data.id ? "updating" : "adding"
        } the contact.`,
        variant: "destructive",
      });
    }
  };

  const deleteContact = async (id) => {
    try {
      const response = await fetch(`/api/contacts?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAdditionalContacts();
        toast({
          title: "Success",
          description: "Contact deleted successfully.",
        });
      } else {
        throw new Error("Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the contact.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-[80vw] px-4 py-6">
      <div className="max-w-[95%] mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact Management</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {leads.map((lead) => (
              <Card key={lead.id}>
                <CardHeader>
                  <CardTitle>{lead.restaurantName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>
                      Contact information for {lead.restaurantName}
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                     
                        <TableHead>Role</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Primary Contact from Lead */}
                      <TableRow>
                        <TableCell>Primary Contact</TableCell>

                        <TableCell>{lead.contactPerson || "N/A"}</TableCell>
                        <TableCell>{lead.contactEmail || "N/A"}</TableCell>
                        <TableCell>{lead.contactPhone || "N/A"}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedLead(lead);
                              form.reset({
                                id: lead.id,
                                contactPerson: lead.contactPerson || "",
                                contactEmail: lead.contactEmail || "",
                                contactPhone: lead.contactPhone || "",
                              });
                              setIsContactDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      {/* Additional Contacts */}
                      {additionalContacts
                        .filter((contact) => contact.leadId === lead.id)
                        .map((contact) => (
                          <TableRow key={contact.id}>
                         
                            <TableCell>{contact.role}</TableCell>
                            <TableCell>{contact.contactPerson}</TableCell>
                            <TableCell>{contact.contactEmail}</TableCell>
                            <TableCell>{contact.contactPhone}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    form.reset(contact);
                                    setIsContactDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteContact(contact.id)}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setSelectedLead(lead);
                      form.reset({ leadId: lead.id });
                      setIsContactDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog
          open={isContactDialogOpen}
          onOpenChange={setIsContactDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {form.getValues("id") ? "Edit" : "Add"} Contact Information
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitContact)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter role (e.g., Owner, Manager)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact person" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">
                    {form.getValues("id") ? "Save Changes" : "Add Contact"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ContactManagement;
