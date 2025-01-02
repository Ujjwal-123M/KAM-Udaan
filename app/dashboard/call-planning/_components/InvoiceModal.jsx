import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"



export function InvoiceModal({ isOpen, onClose, order }) {
  if (!order) {
    return null;
  }

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content');
    if (printContent) {
      const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
      if (windowPrint) {
        windowPrint.document.write(printContent.innerHTML);
        windowPrint.document.close();
        windowPrint.focus();
        windowPrint.print();
        windowPrint.close();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Invoice</DialogTitle>
        </DialogHeader>
        <div id="invoice-content" className="p-6 bg-white">
          <div className="text-3xl font-bold mb-6">INVOICE</div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-bold">From:</h3>
              <p>Your Company Name</p>
              <p>123 Business Street</p>
              <p>City, State, ZIP</p>
            </div>
            <div>
              <h3 className="font-bold">To:</h3>
              <p>{order.restaurantName}</p>
              <p>Customer Address</p>
              <p>City, State, ZIP</p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Order Items</TableCell>
                <TableCell>1</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-6 text-right">
            <p className="font-bold">Total: ${order.totalAmount.toFixed(2)}</p>
          </div>
          <div className="mt-6">
            <p className="font-bold">Notes:</p>
            <p>{order.notes || 'No additional notes'}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handlePrint}>Print Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

