"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { getAllBills, getInventoryItems } from "@/app/actions/billing";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c"];

const monthlyData = [
  { month: "Jan", revenue: 45000, bills: 12, orders: 5 },
  { month: "Feb", revenue: 52000, bills: 15, orders: 7 },
  { month: "Mar", revenue: 48000, bills: 14, orders: 6 },
  { month: "Apr", revenue: 61000, bills: 18, orders: 8 },
  { month: "May", revenue: 55000, bills: 16, orders: 7 },
  { month: "Jun", revenue: 67000, bills: 19, orders: 9 },
];

const metalDistribution = [
  { name: "Gold", value: 45 },
  { name: "White Gold", value: 25 },
  { name: "Rose Gold", value: 15 },
  { name: "Silver", value: 15 },
];

export function ReportsContent() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBills: 0,
    averageOrderValue: 0,
    topCustomer: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const bills = await getAllBills();

        const totalRevenue = bills.reduce((sum, bill) => {
          const billTotal = bill.items.reduce(
            (itemSum, item) => itemSum + item.totalValue,
            0
          );
          return sum + billTotal;
        }, 0);

        const averageOrderValue =
          bills.length > 0 ? totalRevenue / bills.length : 0;

        // Find top customer
        const customerMap = new Map();
        bills.forEach((bill) => {
          const customerName = bill.customer.name;
          const billTotal = bill.items.reduce(
            (sum, item) => sum + item.totalValue,
            0
          );
          customerMap.set(
            customerName,
            (customerMap.get(customerName) || 0) + billTotal
          );
        });

        let topCustomer = "";
        let topAmount = 0;
        customerMap.forEach((amount, customer) => {
          if (amount > topAmount) {
            topAmount = amount;
            topCustomer = customer;
          }
        });

        setStats({
          totalRevenue,
          totalBills: bills.length,
          averageOrderValue,
          topCustomer,
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive business analytics and insights
          </p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : `₹${(stats.totalRevenue / 100000).toFixed(2)}L`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">YTD</p>
          </CardContent>
        </Card>

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
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : `₹${(stats.averageOrderValue / 1000).toFixed(1)}K`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {isLoading ? "-" : stats.topCustomer}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Highest revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="metals">Metals</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Revenue Chart */}
        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metal Distribution */}
        <TabsContent value="metals" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Metal Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metalDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metalDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metal Sales Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metalDistribution.map((metal, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          {metal.name}
                        </span>
                        <span className="text-sm font-semibold">
                          {metal.value}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${metal.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bills"
                    stroke="#8884d8"
                    name="Bills Generated"
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#82ca9d"
                    name="Custom Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary */}
        <TabsContent value="summary" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Revenue
                  </span>
                  <span className="font-semibold">
                    ₹{(stats.totalRevenue / 100000).toFixed(2)}L
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Avg Monthly
                  </span>
                  <span className="font-semibold">
                    ₹{((stats.totalRevenue / 6) / 100000).toFixed(2)}L
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Bills Per Month
                  </span>
                  <span className="font-semibold">
                    {Math.round(stats.totalBills / 6)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Growth Rate
                  </span>
                  <span className="font-semibold text-green-600">
                    +15.2%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  Download Full Report
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export to Excel
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  Email Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
