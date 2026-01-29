// Formatting utilities for the billing system

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatWeight(weight: number): string {
  return `${weight.toFixed(2)}g`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatBillNumber(billNumber: string): string {
  return billNumber.toUpperCase();
}

export function formatMetalType(metal: string): string {
  const metalMap: Record<string, string> = {
    Gold: "Gold",
    WhiteGold: "White Gold",
    RoseGold: "Rose Gold",
    Silver: "Silver",
  };
  return metalMap[metal] || metal;
}

export function formatKaratage(karat: string): string {
  const karatMap: Record<string, string> = {
    K22: "22K",
    K21: "21K",
    K18: "18K",
    K16: "16K",
    K14: "14K",
    K9: "9K",
    Silver925: "925 Silver",
  };
  return karatMap[karat] || karat;
}

export function formatJewelrySize(size: string): string {
  const sizeMap: Record<string, string> = {
    Ring: "Ring",
    Chain: "Chain",
    Bracelet: "Bracelet",
    BanglesWithScrews: "Bangles (with screws)",
    BanglesWithoutScrews: "Bangles (without screws)",
  };
  return sizeMap[size] || size;
}

export function formatPaymentType(type: string): string {
  const paymentMap: Record<string, string> = {
    Cash: "Cash Payment",
    Card: "Card Payment",
    Koko: "Koko Payment",
  };
  return paymentMap[type] || type;
}

export function formatWastageStatus(status: string): string {
  const statusMap: Record<string, string> = {
    Ideal: "Ideal Wastage",
    Low: "Low Wastage",
    Excess: "Excess Wastage",
  };
  return statusMap[status] || status;
}

export function getWastageStatusColor(status?: string): string {
  switch (status) {
    case "Ideal":
      return "text-green-600 dark:text-green-400";
    case "Low":
      return "text-blue-600 dark:text-blue-400";
    case "Excess":
      return "text-orange-600 dark:text-orange-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}

export function calculateDaysUntilDelivery(deliveryDate: Date): number {
  const today = new Date();
  const delivery = new Date(deliveryDate);
  const diffTime = delivery.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isDeliveryOverdue(deliveryDate: Date): boolean {
  return calculateDaysUntilDelivery(deliveryDate) < 0;
}

export function getDeliveryStatus(deliveryDate: Date): "ontrack" | "warning" | "overdue" {
  const daysLeft = calculateDaysUntilDelivery(deliveryDate);
  if (daysLeft < 0) return "overdue";
  if (daysLeft <= 3) return "warning";
  return "ontrack";
}
