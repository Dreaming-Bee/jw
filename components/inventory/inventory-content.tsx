"use client";

import { useEffect, useState } from "react";
import { getInventoryItems } from "@/app/actions/billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";

interface InventoryItem {
  id: string;
  itemName: string;
  description: string;
  metalType: string;
  karatage: string;
  weight: number;
  size: string;
  sizeValue: string;
  price: number;
  quantity: number;
}

export function InventoryContent() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInventory() {
      try {
        const data = await getInventoryItems();
        setItems(data);
      } catch (error) {
        console.error("Error loading inventory:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInventory();
  }, []);

  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lowStockItems = items.filter((item) => item.quantity < 2);

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track ready-made jewelry inventory
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Quantity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">In stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(totalValue / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total worth</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="mb-8 border-orange-200 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="text-orange-900 dark:text-orange-100 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
              {lowStockItems.length} item(s) with low stock:
            </p>
            <ul className="text-sm space-y-2">
              {lowStockItems.map((item) => (
                <li
                  key={item.id}
                  className="text-orange-800 dark:text-orange-200"
                >
                  {item.itemName} - {item.quantity} remaining
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No inventory items found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Item Name</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Metal & Karat</th>
                    <th className="text-left py-3 px-4 font-medium">Weight</th>
                    <th className="text-left py-3 px-4 font-medium">Size</th>
                    <th className="text-right py-3 px-4 font-medium">Price</th>
                    <th className="text-center py-3 px-4 font-medium">Qty</th>
                    <th className="text-right py-3 px-4 font-medium">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-muted/50 transition"
                    >
                      <td className="py-3 px-4 font-medium">{item.itemName}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {item.description}
                      </td>
                      <td className="py-3 px-4">
                        {item.metalType} - {item.karatage}
                      </td>
                      <td className="py-3 px-4">{item.weight}g</td>
                      <td className="py-3 px-4">
                        {item.sizeValue} {item.size !== "Ring" && '\"'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        ₹{item.price.toLocaleString()}
                      </td>
                      <td
                        className={cn(
                          "py-3 px-4 text-center font-semibold",
                          item.quantity < 2
                            ? "text-orange-600 dark:text-orange-400"
                            : ""
                        )}
                      >
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
