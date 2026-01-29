# Lakshika Jewellers - Digital Billing & Workshop Management System

A comprehensive, production-ready web application for managing jewelry billing, inventory, and workshop operations.

## Features

### 🧾 Billing System
- **Ready-Made Billing**: Create bills for ready-made jewelry with multiple items per bill
- **Custom Order Billing**: Initial quotes (target weight) and final bills (actual weight)
- **Auto-generated**: Bill numbers and dates
- **Payment Processing**: Support for Cash, Card, and Koko payments with business rules
- **Bill Printing & PDF Export**: Download and print professional invoices

### 📦 Inventory Management
- Real-time inventory tracking
- Low stock alerts
- Metal type and karatage categorization
- Automatic inventory updates after sales
- Total inventory value calculations

### 🔨 Workshop Management
- Custom order tracking from start to finish
- Wastage calculation and analysis
- Stone weight estimation and tracking
- Gold balance tracking
- Purity reports and documentation
- Goldsmith assignment and tracking

### 📊 Analytics & Reports
- Revenue trends and analysis
- Metal distribution reports
- Monthly business trends
- Customer analytics
- Export functionality

### 🎨 User Interface
- **Sleek, Modern Design**: Built with shadcn/ui and Tailwind CSS
- **Dark/Light Mode**: Full theme support with persistent settings
- **Always-Available Sidebar**: Navigation accessible from any page
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Role-Based Access Control**: Admin, Sales, Workshop, Manager roles

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Database**: SQLite with Prisma ORM (Supabase-ready)
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Forms**: React Hook Form
- **PDF Generation**: html2canvas + jsPDF
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone and setup**
```bash
npm install
```

2. **Initialize database**
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

3. **Run development server**
```bash
npm run dev
```

4. **Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file:

```
# Database
DATABASE_URL="file:./dev.db"

# Role (for development - mock role selection)
NEXT_PUBLIC_CURRENT_ROLE="Admin"
```

## Role-Based Access Control

The system includes four roles with different permissions:

### Admin
- Full access to all features
- Can create, edit, and delete bills
- Can manage inventory
- Can access workshop and reports

### Sales
- Create and edit bills
- View inventory
- No workshop or report access

### Workshop
- Manage custom orders and worksheets
- Update wastage calculations
- No billing or inventory access

### Manager
- View dashboard and reports
- View inventory and workshop
- Export reports
- No creation/editing permissions

## Core Features Explained

### Wastage Calculator
Automated calculation of theoretical, allowed, and actual wastage based on metal type and karatage. The system tracks:
- Gold given
- Final metal weight
- Purity-corrected balance
- Wastage difference
- Wastage status (Ideal, Low, Excess)

### Payment Rules
- **Koko**: Only for silver jewelry below ₹20,000
- **Card**: No charge below ₹20,000; 3% bank charge above ₹20,000
- **Cash**: No additional charges

### Inventory Auto-Update
When a bill is created, ready-made item quantities are automatically reduced from inventory.

## Database Schema

### Key Tables
- **Bill**: Stores bill information (ready-made and custom orders)
- **BillItem**: Individual items within a bill
- **Stone**: Gemstone details for each bill item
- **InventoryItem**: Ready-made jewelry inventory
- **WorksheetItem**: Custom order workshop tracking
- **WastageRecord**: Wastage calculations and history

## Project Structure

```
/app
  /billing
    /ready-made
    /custom
  /inventory
  /workshop
  /reports
  /actions      # Server actions for billing calculations
/components
  /billing      # Bill form and viewer components
  /dashboard    # Dashboard content
  /inventory    # Inventory management UI
  /workshop     # Workshop management UI
  /reports      # Reports and analytics
  /sidebar      # Navigation sidebar
  /ui           # shadcn/ui components
/prisma
  schema.prisma # Database schema
  seed.ts       # Sample data
/lib
  role-context.ts # Role-based access control
```

## Usage Examples

### Creating a Bill
1. Navigate to "Ready-Made Billing" or "Custom Orders"
2. Click "New Bill"
3. Select customer and add items
4. Configure payment method (rules applied automatically)
5. Submit to create bill
6. Download PDF or print invoice

### Managing Inventory
1. Go to "Inventory"
2. View all ready-made items
3. Check low stock alerts
4. Monitor total inventory value

### Workshop Operations
1. Go to "Workshop"
2. View pending and completed custom orders
3. Update goldsmith progress
4. Track wastage calculations
5. View completed order analysis

### Generating Reports
1. Go to "Reports"
2. View revenue, trends, and metal distribution
3. Export data for analysis
4. Generate custom reports

## Styling & Customization

The application uses a cohesive color system with 5 colors:
- Primary: Professional business blue
- Secondary: Neutral grays
- Accent: Gold tones for jewelry context
- Dark mode support for all themes

All colors are defined as CSS custom properties in `/app/globals.css` and work seamlessly with dark/light mode switching.

## Future Enhancements

- Barcode/QR code integration for ready-made items
- Daily metal rate synchronization
- Email notification system
- Advanced customer analytics
- Mobile app
- Multi-location support
- Custom reporting builder

## Support

For issues or questions, please refer to the project documentation or contact the development team.

## License

This project is proprietary to Lakshika Jewellers.
