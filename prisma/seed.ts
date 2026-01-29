import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.bill.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.worksheetItem.deleteMany();
  await prisma.wastageRecord.deleteMany();

  // Create customers
  const customer1 = await prisma.customer.create({
    data: {
      name: "Rajesh Kumar",
      address: "123 Gold Street, Mumbai, MH 400001",
      phone: "+91-9876543210",
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "Priya Sharma",
      address: "456 Diamond Avenue, Bangalore, KA 560001",
      phone: "+91-9876543211",
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: "Arjun Patel",
      address: "789 Silver Lane, Ahmedabad, GJ 380001",
      phone: "+91-9876543212",
    },
  });

  // Create inventory items
  await prisma.inventoryItem.create({
    data: {
      itemName: "Classic Gold Ring",
      description: "18K Yellow Gold Band Ring",
      metalType: "Gold",
      karatage: "K18",
      weight: 4.5,
      size: "Ring",
      sizeValue: "18",
      price: 15000,
      quantity: 3,
    },
  });

  await prisma.inventoryItem.create({
    data: {
      itemName: "Silver Chain",
      description: "925 Sterling Silver Chain",
      metalType: "Silver",
      karatage: "Silver925",
      weight: 8.2,
      size: "Chain",
      sizeValue: "20",
      price: 3500,
      quantity: 5,
    },
  });

  await prisma.inventoryItem.create({
    data: {
      itemName: "Gold Bracelet",
      description: "22K Yellow Gold Bracelet",
      metalType: "Gold",
      karatage: "K22",
      weight: 12.8,
      size: "Bracelet",
      sizeValue: "7.5",
      price: 45000,
      quantity: 2,
    },
  });

  await prisma.inventoryItem.create({
    data: {
      itemName: "Rose Gold Pendant",
      description: "18K Rose Gold Pendant",
      metalType: "RoseGold",
      karatage: "K18",
      weight: 2.3,
      size: "Chain",
      sizeValue: "18",
      price: 8500,
      quantity: 4,
    },
  });

  await prisma.inventoryItem.create({
    data: {
      itemName: "Silver Bangles",
      description: "925 Sterling Silver Bangles",
      metalType: "Silver",
      karatage: "Silver925",
      weight: 15.5,
      size: "BanglesWithoutScrews",
      sizeValue: "2.6",
      price: 5200,
      quantity: 1,
    },
  });

  // Create a ready-made bill
  const bill1 = await prisma.bill.create({
    data: {
      billNumber: "LJ-2026-0001",
      billType: "ReadyMade",
      customerId: customer1.id,
      billDate: new Date(),
      oldGoldValue: 2000,
      items: {
        create: [
          {
            description: "Classic Gold Ring",
            metalType: "Gold",
            karatage: "K18",
            weight: 4.5,
            size: "Ring",
            sizeValue: "18",
            price: 15000,
            totalValue: 15000,
            paymentType: "Card",
            stones: {
              create: [
                {
                  stoneType: "Diamond",
                  treatment: "Natural",
                  numberOfStones: 1,
                  weightPerStone: 0.5,
                  totalWeight: 0.5,
                },
              ],
            },
          },
          {
            description: "Silver Chain",
            metalType: "Silver",
            karatage: "Silver925",
            weight: 8.2,
            size: "Chain",
            sizeValue: "20",
            price: 3500,
            totalValue: 3500,
            paymentType: "Card",
          },
        ],
      },
    },
  });

  // Create a custom order bill
  const bill2 = await prisma.bill.create({
    data: {
      billNumber: "LJ-2026-0002",
      billType: "CustomInitial",
      customerId: customer2.id,
      billDate: new Date(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      targetWeight: 8.5,
      targetPrice: 25000,
      specialRemarks: "Mat Polish, Custom Engraving",
      items: {
        create: [
          {
            description: "Custom Gold Ring with Sapphire",
            metalType: "Gold",
            karatage: "K18",
            weight: 4.0,
            size: "Ring",
            sizeValue: "17",
            price: 25000,
            totalValue: 25000,
            paymentType: "Cash",
            stones: {
              create: [
                {
                  stoneType: "Blue Sapphire",
                  treatment: "Unheated",
                  numberOfStones: 1,
                  weightPerStone: 1.2,
                  totalWeight: 1.2,
                },
                {
                  stoneType: "Diamond",
                  treatment: "Lab",
                  numberOfStones: 6,
                  weightPerStone: 0.15,
                  totalWeight: 0.9,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Create a worksheet
  await prisma.worksheetItem.create({
    data: {
      billId: bill2.id,
      goldsmithName: "Harsha",
      jewelryDescription: "Custom Gold Ring with Sapphire",
      size: "17",
      specialRemarks: "Mat Polish, Custom Engraving",
      metalType: "Gold",
      metalKaratage: "K18",
      targetMetalWeight: 4.0,
      theoreticalWastage: 0.4,
      goldGiven: 6.5,
      finalWeight: 4.4,
      finalMetalWeight: 4.085,
      allowedWastage: 0.4085,
      goldBalance: 1.99,
      purityComment: "OK",
      actualWastage: 0.425,
      differenceInWastage: 0.0165,
      wastageStatus: "Excess",
      stoneDetails: {
        create: [
          {
            stoneType: "Blue Sapphire Unheated",
            size: "5 x 7",
            weight: 1.2,
            smallStoneSize: "1.5mm",
            numberOfSmallStones: 6,
            smallStoneWeight: 0.18,
            totalStoneWeight: 1.38,
          },
        ],
      },
    },
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
