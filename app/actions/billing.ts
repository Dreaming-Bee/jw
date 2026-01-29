"use server";

// Wastage calculator data
const WASTAGE_DATA: Record<
  string,
  { karatCoeff: number; wastageCoeff: number }
> = {
  K22: { karatCoeff: 0.916, wastageCoeff: 0.0562 },
  K21: { karatCoeff: 0.875, wastageCoeff: 0.06 },
  K18: { karatCoeff: 0.75, wastageCoeff: 0.1 },
  K16: { karatCoeff: 0.666, wastageCoeff: 0.12 },
  K14: { karatCoeff: 0.583, wastageCoeff: 0.13 },
  K9: { karatCoeff: 0.375, wastageCoeff: 0.15 },
  Silver925: { karatCoeff: 0.925, wastageCoeff: 0.1 },
};

// Dummy data for customers
const dummyCustomers = [
  { id: "1", name: "Rajesh Kumar", phone: "9876543210", city: "Mumbai" },
  { id: "2", name: "Priya Sharma", phone: "9876543211", city: "Delhi" },
  { id: "3", name: "Amit Patel", phone: "9876543212", city: "Ahmedabad" },
];

// Dummy data for inventory
const dummyInventory = [
  { id: "1", name: "Gold Ring 22K", weight: 5.5, karatage: "K22", metalType: "Gold", quantity: 12, price: 35000, sku: "GR-22K-001" },
  { id: "2", name: "Silver Bracelet", weight: 8, karatage: "Silver925", metalType: "Silver", quantity: 25, price: 8000, sku: "SB-925-001" },
  { id: "3", name: "Gold Necklace 18K", weight: 12, karatage: "K18", metalType: "Gold", quantity: 8, price: 62000, sku: "GN-18K-001" },
  { id: "4", name: "Diamond Pendant", weight: 2.5, karatage: "K18", metalType: "Gold", quantity: 15, price: 45000, sku: "DP-18K-001" },
  { id: "5", name: "Pearl Earrings", weight: 4, karatage: "K22", metalType: "Gold", quantity: 20, price: 28000, sku: "PE-22K-001" },
];

// Dummy data for bills
const dummyBills = [
  {
    id: "1",
    billNumber: "LJ-20250126-0001",
    customerId: "1",
    customer: dummyCustomers[0],
    billDate: new Date(2025, 0, 26),
    type: "ready-made",
    items: [
      { id: "i1", name: "Gold Ring", weight: 5.5, karatage: "K22", quantity: 1, pureWeight: 5, rate: 6500, totalValue: 35750, stones: [] },
      { id: "i2", name: "Silver Chain", weight: 3, karatage: "Silver925", quantity: 1, pureWeight: 2.775, rate: 75, totalValue: 8000, stones: [] },
    ],
    subtotal: 43750,
    tax: 0,
    paymentType: "Cash",
    paymentAmount: 43750,
    status: "completed",
  },
  {
    id: "2",
    billNumber: "LJ-20250125-0002",
    customerId: "2",
    customer: dummyCustomers[1],
    billDate: new Date(2025, 0, 25),
    type: "ready-made",
    items: [
      { id: "i3", name: "Gold Necklace", weight: 12, karatage: "K18", quantity: 1, pureWeight: 9, rate: 6500, totalValue: 62000, stones: [] },
    ],
    subtotal: 62000,
    tax: 0,
    paymentType: "Card",
    paymentAmount: 63860,
    status: "completed",
  },
];

// Dummy data for worksheets
const dummyWorksheets = [
  {
    id: "w1",
    customerId: "3",
    customer: dummyCustomers[2],
    date: new Date(2025, 0, 20),
    description: "Custom Gold Ring",
    metalType: "Gold",
    karatage: "K22",
    goldGiven: 10,
    finalWeight: 9.5,
    wastage: 0.5,
    status: "in-progress",
    stoneDetails: [
      { id: "s1", stoneName: "Diamond", quantity: 1, weight: 0.5, rate: 25000, totalValue: 25000 },
    ],
  },
];

export async function calculateWastage(
  metalType: string,
  karatage: string,
  targetWeight: number,
  finalMetalWeight: number,
  goldGiven: number,
  purityCorrectedBalance?: number
) {
  const wastageData = WASTAGE_DATA[karatage];
  if (!wastageData) throw new Error("Invalid karatage");

  const theoreticalWastage = targetWeight * wastageData.wastageCoeff;
  const allowedWastage = finalMetalWeight * wastageData.wastageCoeff;
  const actualWastage =
    goldGiven -
    finalMetalWeight -
    (purityCorrectedBalance || 0);
  const difference = actualWastage - allowedWastage;

  let status: "Excess" | "Low" | "Ideal";
  if (difference > 0) status = "Excess";
  else if (difference < 0) status = "Low";
  else status = "Ideal";

  return {
    theoreticalWastage: parseFloat(theoreticalWastage.toFixed(3)),
    allowedWastage: parseFloat(allowedWastage.toFixed(3)),
    actualWastage: parseFloat(actualWastage.toFixed(3)),
    difference: parseFloat(difference.toFixed(4)),
    status,
  };
}

export async function calculatePaymentAmount(
  totalValue: number,
  paymentType: string
) {
  if (paymentType === "Card" && totalValue >= 20000) {
    // Add 3% bank charge
    const charge = (totalValue * 3) / 100;
    return parseFloat((totalValue + charge).toFixed(2));
  }
  return parseFloat(totalValue.toFixed(2));
}

export async function generateBillNumber() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const sequence = dummyBills.length + 1;

  return `LJ-${year}${month}${day}-${String(sequence).padStart(4, "0")}`;
}

export async function getAllBills() {
  return dummyBills;
}

export async function getBillById(billId: string) {
  return dummyBills.find((bill) => bill.id === billId) || null;
}

export async function getInventoryItems() {
  return dummyInventory;
}

export async function updateInventoryAfterSale(itemId: string, quantity: number) {
  const item = dummyInventory.find((i) => i.id === itemId);
  if (item) {
    item.quantity = Math.max(0, item.quantity - quantity);
  }
  return item;
}

export async function getWorksheets() {
  return dummyWorksheets;
}

export async function getWorksheetById(worksheetId: string) {
  return dummyWorksheets.find((ws) => ws.id === worksheetId) || null;
}

export async function getCustomers() {
  return dummyCustomers;
}

export async function createBill(billData: any) {
  const billNumber = await generateBillNumber();
  const customer = dummyCustomers.find((c) => c.id === billData.customerId);
  
  if (!customer) {
    throw new Error("Customer not found");
  }

  const newBill = {
    id: String(dummyBills.length + 1),
    billNumber,
    customerId: billData.customerId,
    customer,
    billDate: new Date(),
    billType: "ReadyMade",
    items: billData.items || [],
    subtotal: billData.subtotal || 0,
    tax: billData.tax || 0,
    paymentType: billData.paymentType || "Cash",
    paymentAmount: billData.paymentAmount || 0,
    status: "completed",
  };

  dummyBills.push(newBill);
  return newBill;
}

export async function exportBillToPDF(billId: string) {
  const bill = await getBillById(billId);
  if (!bill) {
    throw new Error("Bill not found");
  }
  return bill;
}
