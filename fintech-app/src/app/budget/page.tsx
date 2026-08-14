'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SafeToSpend {
  totalMonthlyIncome: number;
  totalMonthlyEMI: number;
  totalMonthlyExpenses: number;
  dailySafeToSpend: number;
  weeklySafeToSpend: number;
  daysLeftInMonth: number;
  riskLevel: string;
}

export default function Budget() {
  const [safeToSpend, setSafeToSpend] = useState<SafeToSpend | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    fetchSafeToSpend();
  }, [token, router]);

  const fetchSafeToSpend = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/budget/safe-to-spend', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      setSafeToSpend(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading...</div>;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-600';
      case 'HIGH':
        return 'text-orange-600';
      default:
        return 'text-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Budget & Safe to Spend</h1>

        {safeToSpend && (
          <>
            {/* Main Alert */}
            <div className={`bg-white rounded-lg shadow p-8 mb-8 border-l-4 ${
              safeToSpend.riskLevel === 'CRITICAL' 
                ? 'border-red-600 bg-red-50' 
                : safeToSpend.riskLevel === 'HIGH'
                ? 'border-orange-600 bg-orange-50'
                : 'border-green-600 bg-green-50'
            }`}>
              <p className={`text-sm font-semibold mb-2 ${
                safeToSpend.riskLevel === 'CRITICAL'
                  ? 'text-red-600'
                  : safeToSpend.riskLevel === 'HIGH'
                  ? 'text-orange-600'
                  : 'text-green-600'
              }`}>
                RISK LEVEL: {safeToSpend.riskLevel}
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Safe Daily Spend: ₹{Math.round(safeToSpend.dailySafeToSpend).toLocaleString()}
              </h2>
              <p className="text-gray-700 mb-4">
                You have {safeToSpend.daysLeftInMonth} days left in this month. Spend carefully!
              </p>
            </div>

            {/* Cash Flow Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-2">Monthly Income</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{safeToSpend.totalMonthlyIncome.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-2">EMI/Debt</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{safeToSpend.totalMonthlyEMI.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-2">Spent So Far</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{safeToSpend.totalMonthlyExpenses.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-2">Weekly Budget</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ₹{Math.round(safeToSpend.weeklySafeToSpend).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Ideal Week Should Look Like:</h3>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-gray-900">📊 Daily Safe Limit</p>
                  <p className="text-gray-600">₹{Math.round(safeToSpend.dailySafeToSpend).toLocaleString()} / day</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-gray-900">📅 No-Spend Days</p>
                  <p className="text-gray-600">Aim for at least 2 days where you don't spend anything</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-gray-900">💡 Food Budget</p>
                  <p className="text-gray-600">Keep dining out to max ₹{Math.round(safeToSpend.weeklySafeToSpend * 0.3).toLocaleString()}/week</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-gray-900">🛍️ Shopping</p>
                  <p className="text-gray-600">Limit to ₹{Math.round(safeToSpend.weeklySafeToSpend * 0.2).toLocaleString()}/week for non-essentials</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
