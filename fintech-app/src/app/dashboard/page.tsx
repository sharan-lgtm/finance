'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  totalEMI: number;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  savings: number;
  goalsCount: number;
  debtsCount: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/analytics/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch dashboard');

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">FinFlow</h1>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Monthly Income</p>
            <p className="text-3xl font-bold text-indigo-600">₹{(data?.totalIncome || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">₹{(data?.totalExpenses || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Net Worth</p>
            <p className="text-3xl font-bold text-green-600">₹{(data?.netWorth || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Monthly Savings</p>
            <p className="text-3xl font-bold text-blue-600">₹{(data?.savings || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/transactions"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">💳 Transactions</h2>
            <p className="text-gray-600 text-sm">Track your daily expenses and income</p>
          </Link>

          <Link
            href="/debts"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">📊 Debts</h2>
            <p className="text-gray-600 text-sm">Manage {data?.debtsCount || 0} active debts</p>
          </Link>

          <Link
            href="/goals"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">🎯 Goals</h2>
            <p className="text-gray-600 text-sm">Plan {data?.goalsCount || 0} financial goals</p>
          </Link>

          <Link
            href="/budget"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">📈 Budget</h2>
            <p className="text-gray-600 text-sm">Set and monitor your spending limits</p>
          </Link>

          <Link
            href="/wealth"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">💰 Wealth</h2>
            <p className="text-gray-600 text-sm">View your net worth and assets</p>
          </Link>

          <Link
            href="/coach"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">🤖 Coach</h2>
            <p className="text-gray-600 text-sm">Get personalized financial coaching</p>
          </Link>
        </div>

        {/* Financial Summary */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">₹{(data?.totalAssets || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Liabilities</p>
              <p className="text-2xl font-bold text-gray-900">₹{(data?.totalLiabilities || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly EMI</p>
              <p className="text-2xl font-bold text-gray-900">₹{(data?.totalEMI || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">EMI % of Income</p>
              <p className="text-2xl font-bold text-gray-900">
                {data?.totalIncome ? Math.round((data.totalEMI / data.totalIncome) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
