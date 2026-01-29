"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAllBills, getInventoryItems, getWorksheets } from "@/app/actions/billing";

const chartData = [
  { name: "Jan", revenue: 4000, bills: 24 },
  { name: "Feb", revenue: 3000, bills: 21 },
  { name: "Mar", revenue: 2000, bills: 29 },
  { name: "Apr", revenue: 2780, bills: 39 },
  { name: "May", revenue: 1890, bills: 23 },
  { name: "Jun", revenue: 2390, bills: 34 },
];

export function DashboardContent() {
  const [stats, setStats] = useState({
    totalBills: 0,
    totalInventory: 0,
    worksheetsCount: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [bills, inventory, worksheets] = await Promise.all([
          getAllBills(),
          getInventoryItems(),
          getWorksheets(),
        ]);

        const totalRevenue = bills.reduce((sum, bill) => {
          const billTotal = bill.items.reduce(
            (itemSum, item) => itemSum + item.totalValue,
            0
          );
          return sum + billTotal;
        }, 0);

        const inventoryCount = inventory.reduce((sum, item) => sum + item.quantity, 0);

        setStats({
          totalBills: bills.length,
          totalInventory: inventoryCount,
          worksheetsCount: worksheets.length,
          totalRevenue,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Lakshika Jewellers Digital Billing System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.totalBills}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ready-made & Custom</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inventory Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.totalInventory}
            </div>
            <p className="text-xs text-muted-foreground mt-1">In Stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Workshop Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.worksheetsCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pending & Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : `₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">YTD</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="bills">Bills Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    fill="#8884d8"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bills Generated Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bills" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
