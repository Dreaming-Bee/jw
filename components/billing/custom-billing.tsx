"use client";

import { useEffect, useState } from "react";
import { getAllBills, getCustomers } from "@/app/actions/billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, FileText, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CustomBillingContent() {
  const [bills, setBills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const billsData = await getAllBills();
        setBills(
          billsData.filter(
            (b) => b.billType === "CustomInitial" || b.billType === "CustomFinal"
          )
        );
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const initialBills = bills.filter((b) => b.billType === "CustomInitial");
  const finalBills = bills.filter((b) => b.billType === "CustomFinal");

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Custom Orders</h1>
          <p className="text-muted-foreground">
            Create and manage custom design jewelry bills
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Custom Order
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bills.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Initial & Final
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Initial Quotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {initialBills.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Final Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {finalBills.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Initial Quotes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Initial Quotes (Target Weight)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : initialBills.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No initial quotes found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">
                      Bill No.
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Jewelry
                    </th>
                    <th className="text-center py-3 px-4 font-medium">
                      Target Weight
                    </th>
                    <th className="text-right py-3 px-4 font-medium">
                      Target Price
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Delivery Date
                    </th>
                    <th className="text-center py-3 px-4 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {initialBills.map((bill) => (
                    <tr
                      key={bill.id}
                      className="border-b hover:bg-muted/50 transition"
                    >
                      <td className="py-3 px-4 font-mono">
                        {bill.billNumber}
                      </td>
                      <td className="py-3 px-4">{bill.customer.name}</td>
                      <td className="py-3 px-4">
                        {bill.items[0]?.description}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {bill.targetWeight}g
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        ₹{bill.targetPrice?.toLocaleString() || "0"}
                      </td>
                      <td className="py-3 px-4">
                        {bill.deliveryDate
                          ? new Date(bill.deliveryDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Initial Quote
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Final Bills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Final Bills (Actual Weight)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : finalBills.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No final bills found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">
                      Bill No.
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Jewelry
                    </th>
                    <th className="text-center py-3 px-4 font-medium">
                      Target Weight
                    </th>
                    <th className="text-center py-3 px-4 font-medium">
                      Final Weight
                    </th>
                    <th className="text-right py-3 px-4 font-medium">
                      Final Price
                    </th>
                    <th className="text-center py-3 px-4 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {finalBills.map((bill) => {
                    const weightDiff =
                      (bill.finalWeight || 0) - (bill.targetWeight || 0);
                    return (
                      <tr
                        key={bill.id}
                        className="border-b hover:bg-muted/50 transition"
                      >
                        <td className="py-3 px-4 font-mono">
                          {bill.billNumber}
                        </td>
                        <td className="py-3 px-4">{bill.customer.name}</td>
                        <td className="py-3 px-4">
                          {bill.items[0]?.description}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {bill.targetWeight}g
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={
                              weightDiff > 0
                                ? "text-orange-600 font-semibold"
                                : "text-green-600 font-semibold"
                            }
                          >
                            {bill.finalWeight}g
                            <br />
                            {weightDiff > 0 ? "+" : ""}
                            {weightDiff.toFixed(2)}g
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          ₹{bill.finalPrice?.toLocaleString() || "0"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Completed
                          </Badge>
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
