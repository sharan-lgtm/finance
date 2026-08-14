'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface WealthData {
  user: any;
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

export default function Wealth() {
  const [data, setData] = useState<WealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    fetchWealth();
  }, [token, router]);

  const fetchWealth = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/analytics/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Overall Wealth</h1>

        {data && (
          <>
            {/* Net Worth */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white mb-8">
              <p className="text-sm opacity-90 mb-2">Your Net Worth</p>
              <h2 className="text-5xl font-bold">₹{data.netWorth.toLocaleString()}</h2>
              <p className="mt-4 opacity-75">Assets - Liabilities = Net Worth</p>
            </div>

            {/* Assets vs Liabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Assets 💰</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-700">Total Assets</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{data.totalAssets.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Everything you own: bank accounts, investments, property, vehicles, gold, etc.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Liabilities 📊</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-700">Total Liabilities</span>
                    <span className="text-2xl font-bold text-red-600">
                      ₹{data.totalLiabilities.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Everything you owe: loans, credit cards, EMIs, family debt, etc.
                  </p>
                </div>
              </div>
            </div>

            {/* Monthly Cash Flow */}
            <div className="bg-white rounded-lg shadow p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Monthly Cash Flow</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <span className="font-semibold text-gray-900">Monthly Income</span>
                  <span className="text-xl font-bold text-green-600">
                    +₹{data.totalIncome.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <span className="font-semibold text-gray-900">Monthly Expenses</span>
                  <span className="text-xl font-bold text-red-600">
                    -₹{data.totalExpenses.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="font-semibold text-gray-900">Monthly EMI/Debt</span>
                  <span className="text-xl font-bold text-orange-600">
                    -₹{data.totalEMI.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-semibold text-gray-900 text-lg">Monthly Savings</span>
                  <span className="text-2xl font-bold text-blue-600">
                    +₹{data.savings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Debt to Income Ratio</h4>
                <p className="text-3xl font-bold text-indigo-600">
                  {data.totalIncome > 0 ? Math.round((data.totalEMI / data.totalIncome) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {((data.totalEMI / data.totalIncome) * 100) > 30
                    ? 'High - Consider reducing debt'
                    : 'Good - Keep it up!'}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Monthly Savings Rate</h4>
                <p className="text-3xl font-bold text-green-600">
                  {data.totalIncome > 0 ? Math.round((data.savings / data.totalIncome) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {((data.savings / data.totalIncome) * 100) >= 15
                    ? 'Excellent - Well done!'
                    : 'Try to save 15% of income'}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Financial Goals</h4>
                <p className="text-3xl font-bold text-blue-600">{data.goalsCount}</p>
                <p className="text-xs text-gray-600 mt-2">active goals being tracked</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
