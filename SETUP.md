# Setup Guide - Lakshika Jewellers Billing System

Follow these steps to get the application running locally.

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:
```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_CURRENT_ROLE="Admin"
```

### 3. Initialize Database

Generate Prisma client:
```bash
npx prisma generate
```

Create database and run migrations:
```bash
npx prisma migrate dev --name init
```

Seed sample data:
```bash
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

### View Database
To inspect the database in Prisma Studio:
```bash
npx prisma studio
```

### Reset Database
To reset the database and reseed:
```bash
npx prisma migrate reset
```

### Update Schema
After modifying `prisma/schema.prisma`:
```bash
npx prisma migrate dev --name <migration-name>
```

## Role Testing

To test different roles, update `NEXT_PUBLIC_CURRENT_ROLE` in `.env.local`:

- `Admin` - Full access to all features
- `Sales` - Can create bills, view inventory
- `Workshop` - Can manage custom orders and worksheets
- `Manager` - Can view reports and dashboard

Restart the dev server after changing roles.

## Building for Production

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

## Deployment to Supabase (Future)

When ready to migrate to Supabase:

1. **Create Supabase Project**
   - Go to supabase.com and create a new project
   - Get the database URL

2. **Update Database URL**
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```

3. **Deploy**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   npm run build
   npm run start
   ```

## Troubleshooting

### Database Errors
If you encounter database errors:
```bash
npx prisma migrate reset
npm run dev
```

### Module Not Found Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

### Port Already in Use
Change the port:
```bash
npm run dev -- -p 3001
```

## Development Tips

### Adding New Features
1. Update Prisma schema in `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name feature_name`
3. Create/update server actions in `app/actions/`
4. Create components in appropriate folder under `components/`

### Styling
- Use Tailwind CSS utility classes
- Colors defined in `app/globals.css` as CSS variables
- Dark mode handled automatically with theme provider

### Server Actions
- All billing calculations are in `app/actions/billing.ts`
- Use server actions for database operations
- Keep UI components lightweight

## File Structure Reference

```
/app                    # Next.js app directory
  /actions             # Server actions
  /billing             # Billing pages
  /inventory           # Inventory page
  /workshop            # Workshop page
  /reports             # Reports page
  layout.tsx           # Root layout
  page.tsx             # Home/Dashboard
  globals.css          # Global styles
  
/components            # React components
  /billing             # Billing components
  /dashboard           # Dashboard components
  /inventory           # Inventory components
  /workshop            # Workshop components
  /reports             # Reports components
  /ui                  # shadcn/ui components
  sidebar.tsx          # Main sidebar
  theme-provider.tsx   # Theme management
  
/prisma                # Database
  schema.prisma        # Database schema
  seed.ts              # Sample data
  
/lib                   # Utility functions
  utils.ts             # Tailwind utilities
  role-context.ts      # Role-based access control
```

## Next Steps

1. ✅ Setup complete!
2. Run the development server
3. Explore the application using the "Admin" role
4. Test different roles by changing `NEXT_PUBLIC_CURRENT_ROLE`
5. Create test bills and explore all features
6. Customize with your business data when ready

## Support

For detailed feature documentation, see `README.md`.
