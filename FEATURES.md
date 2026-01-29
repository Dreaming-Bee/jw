# Features Documentation - Lakshika Jewellers System

## 1. Ready-Made Billing

### Creating a Ready-Made Bill
- **Location**: Sidebar → Ready-Made Billing
- **Create**: Click "New Bill" to start
- **Steps**:
  1. Select customer from dropdown
  2. Enter old gold value (optional)
  3. Add items:
     - Description (e.g., "Gold Ring")
     - Metal type (Gold, White Gold, Rose Gold, Silver)
     - Karatage (based on metal type)
     - Weight in grams
     - Size type and value
     - Price
     - Payment type
  4. Add multiple items to one bill
  5. Submit to create bill

### Bill Features
- **Auto-generated**: Bill number and date
- **Multiple Items**: One bill can contain many jewelry items
- **Customer Info**: Displays customer details on invoice
- **Stone Data**: Background tracking (not shown on invoice)
- **Payment Rules**:
  - Cash: No charges
  - Card <₹20K: No charges
  - Card ≥₹20K: +3% bank charges automatically added
  - Koko: Only for Silver jewelry <₹20K

### Bill Management
- **View**: Click eye icon to preview bill
- **Download PDF**: Get printable PDF version
- **Print**: Direct print from browser
- **Signature**: Support for customer signature images

## 2. Custom Design Orders

### Initial Bill (Target Weight)
- **Location**: Sidebar → Custom Orders
- **Purpose**: Quote for custom jewelry with estimated weight
- **Fields**:
  - Design reference image (backend storage)
  - Delivery date
  - Special remarks (e.g., Mat Polish, Engraving)
  - Target metal weight (estimated)
  - Target stone weight (estimated)
  - **Formula**: Target Weight = Metal Weight + Stone Weight

### Final Bill (Actual Weight)
- **Purpose**: Final bill after jewelry is completed
- **Updates from Initial**:
  - Actual final weight
  - Actual final price
  - Weight difference calculation
  - Price adjustment

### Workshop Integration
- Auto-generates workshop sheet when custom order created
- Tracks gold given, wastage, and final results

## 3. Inventory Management

### Features
- **Real-time Tracking**: See quantity updates after sales
- **Metal Categorization**: Group by metal type and karatage
- **Low Stock Alerts**: Warning when quantity < 2
- **Total Value**: Automatic calculation of inventory worth
- **Categories**: 
  - Metal types: Gold, White Gold, Rose Gold, Silver
  - Karatage: 22K, 21K, 18K, 16K, 14K, 9K, 925 Silver

### Inventory Updates
- Automatically decreases when bill is created
- Tracks item details (weight, size, price)
- Supports future barcode integration

### Stock Management
- View all items with:
  - Item name and description
  - Metal type and karatage
  - Weight and size
  - Unit price
  - Quantity in stock
  - Total value per item

## 4. Workshop Management

### Pending Orders
- Shows custom orders awaiting completion
- Displays:
  - Goldsmith assigned
  - Target weight for metal
  - Stone details
  - Progress tracking

### Completed Orders
- Shows finished custom orders
- Displays:
  - Final weight achieved
  - Wastage calculations
  - Wastage status (Ideal, Low, Excess)
  - Gold balance information

### Wastage Calculations
The system automatically calculates:

#### Theoretical Wastage
- Expected wastage based on target weight
- Formula: `Target Weight × Wastage Coefficient`

#### Allowed Wastage
- Acceptable wastage range based on final metal weight
- Formula: `Final Metal Weight × Wastage Coefficient`

#### Actual Wastage
- Real wastage achieved
- Formula: `Gold Given - Final Metal Weight - Purity Corrected Balance`

#### Status
- **Ideal**: Difference = 0 (perfect)
- **Low**: Difference < 0 (less wastage than allowed)
- **Excess**: Difference > 0 (more wastage than allowed)

### Wastage Coefficients

| Metal | Karat | Coefficient |
|-------|-------|------------|
| Gold | 22K | 0.0562 |
| Gold | 21K | 0.06 |
| Gold | 18K | 0.1 |
| Gold | 16K | 0.12 |
| Gold | 14K | 0.13 |
| Gold | 9K | 0.15 |
| Silver | 925 | 0.1 |

### Stone Tracking
For each custom order, track:
- Stone type (Blue Sapphire, Diamond, etc.)
- Treatment (Unheated, Lab, Natural)
- Size/dimensions
- Weight per stone and total weight
- Multiple stone types per order

## 5. Dashboard

### Key Metrics
- **Total Bills**: All ready-made and custom bills
- **Inventory Items**: Total quantity in stock
- **Workshop Orders**: Pending and completed custom orders
- **Total Revenue**: Sum of all bills

### Charts
- **Monthly Revenue**: Bar chart of revenue trends
- **Bills Trend**: Line chart of bills generated per month

### Quick Stats
- Shows business performance at a glance
- Updated in real-time from database

## 6. Reports & Analytics

### Revenue Analysis
- Monthly revenue breakdown
- Revenue trends over time
- Average order value
- Total revenue calculations

### Metal Distribution
- Pie chart of metal types sold
- Percentage breakdown
- Sales summary by metal type

### Business Trends
- Bills generated per month
- Custom orders per month
- Growth patterns

### Export Options
- Download full reports
- Export to Excel
- Email reports (feature ready)

## 7. Payment Processing

### Payment Types

#### Cash
- Direct payment
- No additional charges
- Complete payment required

#### Card
- Digital card payments
- Processing fees:
  - Below ₹20,000: 0% charge
  - ₹20,000 and above: 3% bank charge
- Charges automatically added to bill

#### Koko
- Special payment plan
- **Restrictions**: Only for Silver jewelry below ₹20,000
- System prevents use outside these parameters

### Bill Amount Calculation
```
Base Amount = Sum of all item prices
Old Gold Value = Deduction from balance

If Payment = Card AND Amount ≥ ₹20,000:
  Final Amount = Base Amount × 1.03 (add 3%)

Balance Due = Final Amount - Old Gold Value
```

## 8. User Roles & Permissions

### Admin
- ✅ Create and edit bills
- ✅ Manage inventory
- ✅ Access workshop
- ✅ View and export reports
- ✅ Full system control

### Sales
- ✅ Create and edit bills
- ✅ View inventory
- ❌ Cannot manage inventory
- ❌ No workshop access
- ❌ No report access

### Workshop
- ✅ View and update workshop orders
- ✅ Track wastage
- ❌ Cannot create bills
- ❌ No inventory access
- ❌ No report access

### Manager
- ✅ View dashboard
- ✅ View inventory
- ✅ Access workshop (view only)
- ✅ View and export reports
- ❌ Cannot create bills

## 9. Advanced Features

### Auto-Calculations
- Bill numbers (LJ-YYYYMMDD-XXXX format)
- Payment charges based on amount
- Wastage calculations with purity corrections
- Inventory value calculations
- Weight difference tracking

### Data Persistence
- All data saved to SQLite database
- Supabase-ready schema for future migration
- Audit trail support ready

### Theme System
- Light and Dark modes
- Persistent theme selection
- Professional color palette
- Accessible contrast ratios

### Responsive Design
- Mobile-friendly sidebar
- Tablet-optimized layouts
- Desktop-enhanced features
- Touch-friendly interfaces

## 10. Sample Data

### Pre-loaded Customers
1. **Rajesh Kumar** - Mumbai
2. **Priya Sharma** - Bangalore
3. **Arjun Patel** - Ahmedabad

### Pre-loaded Inventory
1. Classic Gold Ring (18K, 4.5g, Ring 18)
2. Silver Chain (925, 8.2g, Chain 20")
3. Gold Bracelet (22K, 12.8g, Bracelet 7.5")
4. Rose Gold Pendant (18K, 2.3g, Pendant 18")
5. Silver Bangles (925, 15.5g, Bangles)

### Sample Bills
- Ready-made bill with multiple items
- Custom order with delivery tracking
- Workshop sheet with wastage tracking

## 11. Future Enhancements

### Phase 2
- Barcode/QR code system for ready-made items
- Daily metal rate integration
- Email notifications

### Phase 3
- Mobile application
- Multi-location support
- Customer portal
- Advanced analytics

### Phase 4
- AI-powered pricing
- Predictive analytics
- Blockchain authentication
