# FinFlow - Quick Start Guide 🚀

## 5-Minute Setup

### 1. Start PostgreSQL (if not already running)
```bash
# On macOS with Homebrew
brew services start postgresql

# On Linux
sudo systemctl start postgresql

# Or use Docker
docker run -d --name postgres-finflow \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

### 2. Create Database
```bash
createdb fintech_dev
```

### 3. Setup Backend (Terminal 1)
```bash
cd /home/sandbox/fintech-app/backend
cp .env.example .env
# Edit .env with your PostgreSQL connection info
npm install
npx prisma migrate dev
npm run dev
# Backend runs on http://localhost:5000
```

### 4. Setup Frontend (Terminal 2)
```bash
cd /home/sandbox/fintech-app
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 5. Open in Browser
```
http://localhost:3000
```

## First-Time User Flow

1. **Sign Up** - Create account with email & password
2. **Onboarding** - Enter personal info, salary, and fixed expenses
3. **Dashboard** - See your financial overview
4. **Add Transactions** - Start logging your daily expenses
5. **Add Debts** - List all your loans and EMIs
6. **Create Goals** - Plan for marriage, home, education
7. **Check Coach** - Get personalized recommendations

## Demo Data

To test with demo data, run:
```bash
cd backend
npx ts-node scripts/seed.ts  # Coming soon
```

## Default Test Credentials (After Signup)
```
Email: test@example.com
Password: testpass123
```

## Key Screens to Try

### Dashboard
Shows your income, expenses, net worth, and savings at a glance

### Budget
Know your safe daily spending limit before overspending

### Debts
Get realistic debt-free dates and early repayment strategies

### Goals
Plan marriage/home with automatic timeline calculations

### Coach
Get weekly personalized coaching and financial health score

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/fintech_dev
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
API_PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Common Commands

```bash
# Start everything
npm run dev              # Frontend
cd backend && npm run dev # Backend in another terminal

# Build for production
npm run build            # Frontend
cd backend && npm run build # Backend

# Database operations
cd backend
npx prisma migrate dev   # Create & run migrations
npx prisma studio       # Open Prisma UI
npx prisma reset        # Reset database (dev only!)

# Clean up
cd backend
npm install --save-dev ts-node @types/node
```

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
cd backend
npm install
```

### "Database connection refused"
```bash
# Ensure PostgreSQL is running
psql -U postgres

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/fintech_dev
```

### "Ports 3000 or 5000 already in use"
```bash
# Kill existing processes
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### "Module not found errors"
```bash
# Reinstall all dependencies
npm install
cd backend && npm install
```

## Next Steps

1. ✅ Basic CRUD operations working
2. ⏳ Add more expense categories
3. ⏳ Enable bank integration
4. ⏳ Add recurring expense automation
5. ⏳ Build mobile app
6. ⏳ Add investment tracking

## Support

- Check README.md for full documentation
- Review API endpoints in README.md
- Check browser console for errors
- Check server logs for backend issues

---

**You're all set! Start managing your finances better. 💰**
