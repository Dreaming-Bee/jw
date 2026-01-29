"use client";

import { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { calculatePaymentAmount, createBill } from "@/app/actions/billing";

const METAL_TYPES = ["Gold", "WhiteGold", "RoseGold", "Silver"];
const KARATAGES = {
  Gold: ["K22", "K21", "K18", "K16", "K14", "K9"],
  WhiteGold: ["K18", "K16", "K14", "K9"],
  RoseGold: ["K18", "K16", "K14", "K9"],
  Silver: ["Silver925"],
};
const PAYMENT_TYPES = ["Cash", "Card", "Koko"];
const JEWELRY_SIZES = ["Ring", "Chain", "Bracelet", "BanglesWithScrews", "BanglesWithoutScrews"];

const SIZE_RANGES = {
  Ring: "1-34",
  Chain: '16"-26"',
  Bracelet: "inches",
  BanglesWithScrews: "size",
  BanglesWithoutScrews: "size",
};

type BillItem = {
  description: string;
  metalType: string;
  karatage: string;
  weight: number;
  size: string;
  sizeValue: string;
  price: number;
  totalValue: number;
  paymentType: string;
};

interface BillFormProps {
  customers: any[];
  onSuccess: () => void;
}

export function BillForm({ customers, onSuccess }: BillFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: {
      customerId: "",
      oldGoldValue: 0,
      items: [
        {
          description: "",
          metalType: "Gold",
          karatage: "K18",
          weight: 0,
          size: "Ring",
          sizeValue: "",
          price: 0,
          totalValue: 0,
          paymentType: "Cash",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleItemChange = (index: number, field: keyof BillItem, value: any) => {
    const items = form.getValues("items");
    const item = items[index];

    if (field === "price" || field === "totalValue") {
      item.price = field === "price" ? value : item.price;
      item.totalValue = item.price;
    } else if (field === "metalType") {
      item.metalType = value;
      item.karatage = (KARATAGES as any)[value][0];
    } else {
      (item as any)[field] = value;
    }

    form.setValue(`items.${index}`, item);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (!data.customerId) {
        alert("Please select a customer");
        return;
      }

      const items = data.items.filter((item: any) => item.description);
      if (items.length === 0) {
        alert("Please add at least one item");
        return;
      }

      const subtotal = items.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
      const paymentAmount = await calculatePaymentAmount(subtotal, data.paymentType);
      
      const billData = {
        customerId: data.customerId,
        items: items.map((item: any) => ({
          ...item,
          totalValue: item.price || 0,
        })),
        subtotal,
        tax: 0,
        paymentType: data.paymentType || "Cash",
        paymentAmount,
      };

      await createBill(billData);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error creating bill:", error);
      alert("Error creating bill. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="oldGoldValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Gold Value (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

      {/* Bill Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Bill Items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                description: "",
                metalType: "Gold",
                karatage: "K18",
                weight: 0,
                size: "Ring",
                sizeValue: "",
                price: 0,
                totalValue: 0,
                paymentType: "Cash",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id} className="p-4">
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Gold Ring" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.metalType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metal Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          handleItemChange(index, "metalType", value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {METAL_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type === "WhiteGold"
                                ? "White Gold"
                                : type === "RoseGold"
                                  ? "Rose Gold"
                                  : type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.karatage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Karatage</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(KARATAGES as any)[
                            form.getValues(`items.${index}.metalType`)
                          ]?.map((k: string) => (
                            <SelectItem key={k} value={k}>
                              {k}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.weight`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.size`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {JEWELRY_SIZES.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size === "BanglesWithScrews"
                                ? "Bangles (with screws)"
                                : size === "BanglesWithoutScrews"
                                  ? "Bangles (without screws)"
                                  : size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.sizeValue`}
                  render={({ field }) => {
                    const sizeRange = SIZE_RANGES[form.getValues(`items.${index}.size`) as keyof typeof SIZE_RANGES] || "";
                    return (
                      <FormItem>
                        <FormLabel>{`Size (${sizeRange})`}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 18" />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => {
                            const price = parseFloat(e.target.value);
                            field.onChange(price);
                            handleItemChange(index, "price", price);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.paymentType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PAYMENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? "Creating..." : "Create Bill"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
