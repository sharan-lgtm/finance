# FinFlow - Personal Finance Manager 💰

Your personal finance coach that helps you manage expenses, debts, goals, and wealth all in one intelligent app.

## Features ✨

- **💳 Complete Expense Tracking** - Track daily expenses with automatic categorization
- **📊 Debt Management** - Calculate debt-free dates, compare repayment strategies, save on interest
- **🎯 Goal Planning** - Plan marriage, home, education with realistic timelines
- **⚠️ Safe-to-Spend Alerts** - Know exactly how much you can spend each day
- **🤖 Financial Coach** - Get personalized weekly recommendations
- **💰 Wealth Tracking** - Understand your net worth and overall financial health
- **📈 Analytics & Reports** - Visualize spending patterns and trends

## Tech Stack

**Frontend:**
- Next.js 16 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Recharts for data visualization

**Backend:**
- Node.js with Express.js
- PostgreSQL for data persistence
- Prisma ORM for database management
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 13+ (or access to a PostgreSQL database)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your PostgreSQL connection:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/fintech_dev
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   API_PORT=5000
   ```

4. **Create PostgreSQL database:**
   ```bash
   createdb fintech_dev
   ```

5. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev
   ```

6. **Start the backend:**
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **From the root directory, install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` file in root:**
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## Project Structure

```
fintech-app/
├── frontend/                    # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── signup/         # Sign up page
│   │   │   ├── login/          # Login page
│   │   │   ├── onboarding/     # Onboarding wizard
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── transactions/   # Transactions management
│   │   │   ├── debts/          # Debt tracking
│   │   │   ├── goals/          # Goal planning
│   │   │   ├── budget/         # Budget & safe-to-spend
│   │   │   ├── wealth/         # Net worth tracking
│   │   │   └── coach/          # Financial coach & health score
│   │   ├── lib/
│   │   │   ├── api.ts          # API client utilities
│   │   │   └── utils.ts        # Helper functions
│   │   └── middleware.ts       # Route protection
│   └── package.json
│
├── backend/                     # Express backend
│   ├── src/
│   │   ├── index.ts            # Server entry point
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT authentication
│   │   │   └── errorHandler.ts # Error handling
│   │   ├── routes/
│   │   │   ├── auth.ts         # Authentication routes
│   │   │   ├── users.ts        # User profile routes
│   │   │   ├── income.ts       # Income management
│   │   │   ├── transactions.ts # Transaction routes
│   │   │   ├── debts.ts        # Debt management
│   │   │   ├── budget.ts       # Budget routes
│   │   │   ├── goals.ts        # Goal routes
│   │   │   └── analytics.ts    # Analytics & dashboard
│   │   └── validation/
│   │       └── schemas.ts      # Zod validation schemas
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── .env.example            # Environment template
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Income
- `GET /api/income` - List income sources
- `POST /api/income` - Add income
- `PUT /api/income/:id` - Update income
- `DELETE /api/income/:id` - Delete income

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Add transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary/monthly` - Monthly summary

### Debts
- `GET /api/debts` - List debts
- `POST /api/debts` - Add debt
- `GET /api/debts/:id/schedule` - Debt schedule & payoff date
- `POST /api/debts/:id/pay` - Record payment
- `GET /api/debts/analysis/payoff` - Avalanche vs snowball analysis

### Budget
- `GET /api/budget` - Get budgets
- `POST /api/budget` - Set budget
- `GET /api/budget/safe-to-spend` - Calculate safe daily spend

### Goals
- `GET /api/goals` - List goals
- `POST /api/goals` - Add goal
- `GET /api/goals/:id/projection` - Goal feasibility analysis
- `POST /api/goals/:id/contribute` - Add contribution

### Analytics
- `GET /api/analytics/dashboard` - Dashboard overview
- `GET /api/analytics/spending` - Spending analysis
- `GET /api/analytics/health-score` - Financial health score

## Database Schema

The app uses PostgreSQL with the following main tables:

- **User** - User accounts and authentication
- **UserProfile** - Extended user information
- **Income** - Income sources
- **Transaction** - Daily expenses and income
- **Debt** - Loan and credit tracking
- **DebtPayment** - Payment history
- **Budget** - Spending limits by category
- **FinancialGoal** - Goals (marriage, home, etc.)
- **Asset** - Assets (accounts, investments, property)
- **Liability** - Liabilities (loans, credit cards)
- **Recommendation** - Personalized recommendations
- **FinancialSnapshot** - Historical snapshots for tracking

## Authentication

The app uses JWT tokens for authentication:

1. User signs up or logs in
2. Server returns a JWT token
3. Token is stored in localStorage
4. Token is included in Authorization header for API requests
5. Middleware validates token on protected routes

## Usage Examples

### 1. Sign Up and Create Account
```
Go to http://localhost:3000
Click "Sign Up"
Enter email and password
Complete onboarding with personal & income details
```

### 2. Track Expenses
```
Dashboard → Transactions
Click "+ Add Transaction"
Select type (expense/income), amount, and category
View all transactions sorted by date
```

### 3. Manage Debts
```
Dashboard → Debts
Add your credit cards, loans, EMIs
System calculates debt-free date automatically
Get recommendations for early repayment
```

### 4. Plan Goals
```
Dashboard → Goals
Create goals (marriage, home, education)
System calculates realistic timelines
Adjust targets based on feasibility analysis
```

### 5. Monitor Budget
```
Dashboard → Budget
Set safe-to-spend limits
Get daily spending limits based on remaining days
Receive alerts before running out of money
```

### 6. Check Financial Health
```
Dashboard → Coach
View financial health score
Get weekly coaching recommendations
Understand spending patterns and leaks
```

## Key Calculations

### Safe-to-Spend Formula
```
Available Daily = (Monthly Income - Fixed Expenses - EMI - Goal Savings) / Days Remaining
```

### Debt-Free Date
```
Using Avalanche method (highest interest rate first)
Months to payoff = Outstanding Amount / (EMI - Monthly Interest)
```

### Financial Health Score (0-100)
- Emergency Fund (20 points)
- Debt-to-Income Ratio (25 points)
- Savings Rate (20 points)
- Net Worth Growth (15 points)
- Goal Progress (10 points)
- Insurance Coverage (10 points)

### Net Worth
```
Net Worth = Total Assets - Total Liabilities
```

## Security Considerations

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens with expiration
- ✅ HTTPS-ready (enable in production)
- ✅ CORS configured for frontend domain
- ✅ Input validation with Zod
- ✅ SQL injection prevention via Prisma ORM
- ✅ Environment variables for secrets

**For Production:**
1. Use HTTPS/TLS
2. Enable 2FA
3. Use environment-specific secrets
4. Enable database backups
5. Add rate limiting
6. Use secure password reset flow
7. Implement audit logging

## Development

### Build Frontend
```bash
npm run build
```

### Build Backend
```bash
cd backend && npm run build
```

### Run Tests
```bash
npm run test  # Frontend tests
cd backend && npm run test  # Backend tests
```

### Database Migrations
```bash
cd backend
npx prisma migrate dev --name <migration_name>  # Create migration
npx prisma migrate deploy                        # Apply migrations
npx prisma studio                                # Open Prisma UI
```

## Roadmap

### Phase 2 (Completed)
- [x] Budget management
- [x] Safe-to-spend calculation
- [x] Debt payoff scheduling
- [x] Weekly financial coach

### Phase 3 (Ready)
- [ ] Goal feasibility analysis
- [ ] Asset and liability tracking
- [ ] Net worth tracking
- [ ] Goal projections with inflation

### Phase 4 (Future)
- [ ] AI-powered coaching
- [ ] Spending pattern detection
- [ ] Investment recommendations
- [ ] SMS/Email notifications

### Phase 5 (Future)
- [ ] Bank account integration
- [ ] Auto-categorization
- [ ] Mobile app (React Native)
- [ ] PDF/Excel exports

## Troubleshooting

### Database Connection Error
```
Error: Could not connect to database
```
**Solution:**
- Check PostgreSQL is running: `psql -U postgres`
- Verify DATABASE_URL in .env is correct
- Create database: `createdb fintech_dev`

### JWT Token Expired
```
Error: Invalid token
```
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Login again
- Check JWT_EXPIRES_IN in backend .env

### CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
**Solution:**
- Verify FRONTEND_URL in backend .env
- Check both servers are running
- Clear browser cache

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Kill process on port
lsof -i :5000
kill -9 <PID>
```

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License - feel free to use for personal projects

## Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Check existing documentation
- Review API endpoint examples

---

**Happy Financial Planning! 🚀**

Built with ❤️ for better financial management
