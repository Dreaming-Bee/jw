"use client";

import { useEffect, useState } from "react";
import { getAllBills, getCustomers, exportBillToPDF } from "@/app/actions/billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Download, Printer } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BillForm } from "./bill-form";
import { BillViewer } from "./bill-viewer";

export function ReadyMadeBillingContent() {
  const [bills, setBills] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);

  const loadData = async () => {
    try {
      const [billsData, customersData] = await Promise.all([
        getAllBills(),
        getCustomers(),
      ]);
      setBills(billsData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePDFExport = async (bill: any) => {
    try {
      const element = document.getElementById(`bill-${bill.id}`);
      if (!element) {
        alert("Bill preview not found");
        return;
      }

      const canvas = await html2canvas(element, { scale: 2 });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${bill.billNumber}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Error exporting PDF");
    }
  };

  const handlePrint = (bill: any) => {
    const element = document.getElementById(`bill-${bill.id}`);
    if (!element) {
      alert("Bill preview not found");
      return;
    }
    const printWindow = window.open("", "", "width=900,height=600");
    if (printWindow) {
      printWindow.document.write(element.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ready-Made Billing</h1>
          <p className="text-muted-foreground">Create and manage ready-made jewelry bills</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Bill
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Ready-Made Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <BillForm
              customers={customers}
              onSuccess={() => {
                setShowForm(false);
                loadData();
              }}
            />
          </CardContent>
        </Card>
      )}

      {selectedBill && (
        <Card className="mb-8">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Bill Preview</CardTitle>
            <Button
              variant="ghost"
              onClick={() => setSelectedBill(null)}
            >
              Close
            </Button>
          </CardHeader>
          <CardContent>
            <BillViewer bill={selectedBill} />
          </CardContent>
        </Card>
      )}

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bills</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : bills.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No bills found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Bill No.</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Items</th>
                    <th className="text-right py-3 px-4 font-medium">Amount</th>
                    <th className="text-center py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => {
                    const totalAmount = bill.items.reduce(
                      (sum: number, item: any) => sum + item.totalValue,
                      0
                    );
                    return (
                      <tr
                        key={bill.id}
                        className="border-b hover:bg-muted/50 transition"
                      >
                        <td className="py-3 px-4 font-mono">{bill.billNumber}</td>
                        <td className="py-3 px-4">{bill.customer.name}</td>
                        <td className="py-3 px-4">
                          {new Date(bill.billDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">{bill.items.length}</td>
                        <td className="py-3 px-4 text-right font-semibold">
                          ₹{totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedBill(bill)}
                              title="View bill"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePDFExport(bill)}
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePrint(bill)}
                              title="Print bill"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
