"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface BillViewerProps {
  bill: any;
}

export function BillViewer({ bill }: BillViewerProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const totalAmount = bill.items.reduce(
    (sum: number, item: any) => sum + item.totalValue,
    0
  );

  const calculatePaymentAmount = (amount: number, paymentType: string) => {
    if (paymentType === "Card" && amount >= 20000) {
      return amount + (amount * 3) / 100;
    }
    return amount;
  };

  const handleDownloadPDF = async () => {
    setIsPrinting(true);
    try {
      const element = document.getElementById(`bill-${bill.id}`);
      if (!element) {
        alert("Bill not found. Please try printing instead.");
        setIsPrinting(false);
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`${bill.billNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please use the Print option instead.");
      handlePrint();
    } finally {
      setIsPrinting(false);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById(`bill-${bill.id}`);
    if (!element) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write("<html><head>");
    printWindow.document.write(
      '<link rel="stylesheet" href="' + window.location.href + '">'
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(element.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadPDF}
          disabled={isPrinting}
          className="gap-2 bg-transparent"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="gap-2 bg-transparent"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      <div
        id={`bill-${bill.id}`}
        className="bg-white p-8 rounded-lg border border-border text-black"
      >
        {/* Header */}
        <div className="mb-8 border-b pb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">Lakshika Jewellers</h1>
              <p className="text-gray-600">Digital Bill</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">Bill No: {bill.billNumber}</p>
              <p className="text-sm">
                Date: {new Date(bill.billDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-2">Customer Details</h3>
            <p className="text-sm">
              <strong>Name:</strong> {bill.customer.name}
            </p>
            <p className="text-sm">
              <strong>Address:</strong> {bill.customer.address}
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> {bill.customer.phone}
            </p>
          </div>
          <div />
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-left py-2 px-2">Metal</th>
                <th className="text-left py-2 px-2">Karat</th>
                <th className="text-center py-2 px-2">Weight (g)</th>
                <th className="text-center py-2 px-2">Size</th>
                <th className="text-right py-2 px-2">Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item: any, index: number) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-2">{item.description}</td>
                  <td className="py-2 px-2">{item.metalType}</td>
                  <td className="py-2 px-2">{item.karatage}</td>
                  <td className="py-2 px-2 text-center">{item.weight}</td>
                  <td className="py-2 px-2 text-center">{item.sizeValue}</td>
                  <td className="py-2 px-2 text-right">
                    ₹{item.totalValue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
            {bill.oldGoldValue > 0 && (
              <div className="flex justify-between py-1 text-green-600">
                <span>Old Gold Value:</span>
                <span>-₹{bill.oldGoldValue.toLocaleString()}</span>
              </div>
            )}
            {bill.items[0]?.paymentType === "Card" && totalAmount >= 20000 && (
              <div className="flex justify-between py-1 text-orange-600">
                <span>Bank Charge (3%):</span>
                <span>₹{(totalAmount * 0.03).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t-2 border-gray-800 font-bold">
              <span>Balance Due:</span>
              <span>
                ₹
                {(
                  calculatePaymentAmount(totalAmount, bill.items[0]?.paymentType || "Cash") -
                  bill.oldGoldValue
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-3 gap-8 text-sm">
            <div className="space-y-8 pt-8">
              <div className="text-center">
                <p className="border-t pt-2">Customer Signature</p>
              </div>
            </div>
            <div />
            <div className="space-y-8 pt-8">
              <div className="text-center">
                <p className="border-t pt-2">Authorized By</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
