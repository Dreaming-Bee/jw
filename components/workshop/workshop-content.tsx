"use client";

import { useEffect, useState } from "react";
import { getWorksheets } from "@/app/actions/billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface Worksheet {
  id: string;
  date: string;
  goldsmithName: string;
  jewelryDescription: string;
  size: string;
  metalType: string;
  metalKaratage: string;
  targetMetalWeight: number;
  theoreticalWastage: number;
  goldGiven: number;
  finalWeight?: number;
  finalMetalWeight?: number;
  allowedWastage?: number;
  actualWastage?: number;
  wastageStatus?: string;
  stoneDetails: any[];
}

const wastageChartData = [
  {
    karat: "22K",
    theoretical: 0.056,
    allowed: 0.056,
    actual: 0.060,
  },
  {
    karat: "18K",
    theoretical: 0.1,
    allowed: 0.1,
    actual: 0.098,
  },
  {
    karat: "14K",
    theoretical: 0.13,
    allowed: 0.13,
    actual: 0.135,
  },
];

export function WorkshopContent() {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWorksheets() {
      try {
        const data = await getWorksheets();
        setWorksheets(data);
      } catch (error) {
        console.error("Error loading worksheets:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadWorksheets();
  }, []);

  const completedOrders = worksheets.filter((w) => w.finalWeight);
  const pendingOrders = worksheets.filter((w) => !w.finalWeight);

  const getWastageStatusColor = (status?: string) => {
    switch (status) {
      case "Ideal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Excess":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Workshop Management</h1>
        <p className="text-muted-foreground">Track custom orders and wastage</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{worksheets.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All worksheets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingOrders.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedOrders.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Final weights received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="wastage">Wastage Analysis</TabsTrigger>
        </TabsList>

        {/* All Orders */}
        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Workshop Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-8 text-muted-foreground">Loading...</p>
              ) : worksheets.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No workshop orders found
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Goldsmith
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Jewelry
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Metal
                        </th>
                        <th className="text-center py-3 px-4 font-medium">
                          Target Weight
                        </th>
                        <th className="text-center py-3 px-4 font-medium">
                          Final Weight
                        </th>
                        <th className="text-center py-3 px-4 font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {worksheets.map((ws) => (
                        <tr
                          key={ws.id}
                          className="border-b hover:bg-muted/50 transition"
                        >
                          <td className="py-3 px-4">
                            {new Date(ws.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {ws.goldsmithName}
                          </td>
                          <td className="py-3 px-4">
                            {ws.jewelryDescription}
                          </td>
                          <td className="py-3 px-4">
                            {ws.metalType} {ws.metalKaratage}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {ws.targetMetalWeight}g
                          </td>
                          <td className="py-3 px-4 text-center">
                            {ws.finalWeight ? `${ws.finalWeight}g` : "-"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge
                              className={
                                ws.finalWeight
                                  ? getWastageStatusColor(ws.wastageStatus)
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }
                            >
                              {ws.finalWeight ? "Completed" : "Pending"}
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
        </TabsContent>

        {/* Pending Orders */}
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-8 text-muted-foreground">Loading...</p>
              ) : pendingOrders.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No pending orders
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map((ws) => (
                    <Card key={ws.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Goldsmith
                          </p>
                          <p className="font-semibold">{ws.goldsmithName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Jewelry
                          </p>
                          <p className="font-semibold">
                            {ws.jewelryDescription}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Metal</p>
                          <p className="font-semibold">
                            {ws.metalType} {ws.metalKaratage}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Target Weight
                          </p>
                          <p className="font-semibold">
                            {ws.targetMetalWeight}g
                          </p>
                        </div>
                      </div>
                      {ws.stoneDetails.length > 0 && (
                        <div className="mb-4 p-4 bg-muted rounded-lg">
                          <p className="text-sm font-semibold mb-2">
                            Stone Details
                          </p>
                          <div className="space-y-2 text-sm">
                            {ws.stoneDetails.map((stone, idx) => (
                              <div key={idx}>
                                <p>
                                  <strong>{stone.stoneType}</strong> - {stone.weight}g
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button className="w-full bg-transparent" variant="outline">
                        Update Progress
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wastage Analysis */}
        <TabsContent value="wastage" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Wastage Analysis by Karat</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={wastageChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="karat" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="theoretical" fill="#8884d8" name="Theoretical" />
                  <Bar dataKey="allowed" fill="#82ca9d" name="Allowed" />
                  <Bar dataKey="actual" fill="#ffc658" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Completed Orders with Wastage */}
          {completedOrders.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Completed Orders Wastage Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedOrders.map((ws) => (
                    <div
                      key={ws.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Jewelry</p>
                          <p className="font-semibold">
                            {ws.jewelryDescription}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Theoretical</p>
                          <p className="font-semibold">
                            {ws.theoreticalWastage}g
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Allowed</p>
                          <p className="font-semibold">
                            {ws.allowedWastage?.toFixed(3)}g
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Actual</p>
                          <p className="font-semibold">
                            {ws.actualWastage?.toFixed(3)}g
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-sm font-medium">
                          Wastage Status:
                        </span>
                        <Badge
                          className={getWastageStatusColor(
                            ws.wastageStatus
                          )}
                        >
                          {ws.wastageStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
