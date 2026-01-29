import { prisma } from '@/lib/prisma'
import type { Customer } from '@prisma/client'

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
  K9: { karatCo: 0.375, wastageCoeff: 0.15 },
  Silver925: { karatCoeff: 0.925, wastageCoeff: 0.1 },
};

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

  const lastBill = await prisma.bill.findFirst({
    orderBy: {
      billNumber: "desc",
    },
    select: {
      billNumber: true,
    },
  });

  let sequence = 1;
  if (lastBill) {
    const lastSequence = parseInt(lastBill.billNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  return `LJ-${year}${month}${day}-${String(sequence).padStart(4, "0")}`;
}

export async function getAllBills() {
  return await prisma.bill.findMany({
    include: {
      customer: true,
      items: {
        include: {
          stones: true,
        },
      },
    },
  });
}

export async function getBillById(billId: string) {
  return await prisma.bill.findUnique({
    where: {
      id: billId,
    },
    include: {
      customer: true,
      items: {
        include: {
          stones: true,
        },
      },
    },
  });
}

export async function getInventoryItems() {
  return await prisma.inventoryItem.findMany();
}

export async function updateInventoryAfterSale(itemId: string, quantity: number) {
  const item = await prisma.inventoryItem.findUnique({
    where: { id: itemId },
  });
  if (item) {
    await prisma.inventoryItem.update({
      where: { id: itemId },
      data: { quantity: Math.max(0, item.quantity - quantity) },
    });
  }
  return item;
}

export async function getWorksheets() {
  return await prisma.worksheetItem.findMany({
    include: {
      stoneDetails: true,
    },
  });
}

export async function getWorksheetById(worksheetId: string) {
  return await prisma.worksheetItem.findUnique({
    where: {
      id: worksheetId,
    },
    include: {
      stoneDetails: true,
    },
  });
}

export async function getCustomers() {
  try {
    // Attempt to fetch customers from the database
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return customers;
  } catch (error) {
    // If the database is unavailable, return a hard-coded dummy customer
    console.error('Database not available, returning dummy customer. Error:', error);
    const dummyCustomer: Customer = { id: 'dummy-customer-id', name: 'Walk-in Customer (DB Offline)', address: 'N/A', phone: '0000000000', createdAt: new Date(), updatedAt: new Date() };
    // We cast to `any` to satisfy the relational fields that won't be present.
    // This is safe as the UI will only use the scalar fields.
    return [dummyCustomer] as any;
  }
}

export async function createBill(billData: any) {
  const billNumber = await generateBillNumber();
  const customer = await prisma.customer.findUnique({
    where: { id: billData.customerId },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const newBill = await prisma.bill.create({
    data: {
      billNumber,
      billType: billData.billType,
      customerId: billData.customerId,
      billDate: billData.billDate || new Date(),
      deliveryDate: billData.deliveryDate,
      oldGoldValue: billData.oldGoldValue || 0,
      customerSignature: billData.customerSignature,
      designImage: billData.designImage,
      specialRemarks: billData.specialRemarks,
      targetWeight: billData.targetWeight,
      targetPrice: billData.targetPrice,
      finalWeight: billData.finalWeight,
      finalPrice: billData.finalPrice,
      items: {
        create: billData.items.map((item: any) => ({
          description: item.description,
          metalType: item.metalType,
          karatage: item.karatage,
          weight: item.weight,
          size: item.size,
          sizeValue: item.sizeValue,
          price: item.price,
          totalValue: item.totalValue,
          paymentType: item.paymentType,
          stones: {
            create: item.stones.map((stone: any) => ({
              stoneType: stone.stoneType,
              treatment: stone.treatment,
              numberOfStones: stone.numberOfStones,
              weightPerStone: stone.weightPerStone,
              totalWeight: stone.totalWeight,
            })),
          },
        })),
      },
    },
  });

  return newBill;
}

export async function exportBillToPDF(billId: string) {
  const bill = await getBillById(billId);
  if (!bill) {
    throw new Error("Bill not found");
  }
  return bill;
}
