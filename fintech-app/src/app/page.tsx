'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">FinFlow</h1>
          <div className="space-x-4">
            <a href="/login" className="text-gray-700 hover:text-indigo-600">
              Login
            </a>
            <a href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Sign Up
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Your Personal Finance Coach 🚀
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop wondering where your money goes. FinFlow helps you track expenses, manage debt, 
          plan goals, and understand your wealth—all in one intelligent app.
        </p>
        <a
          href="/signup"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
        >
          Get Started Free
        </a>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why FinFlow?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Complete Visibility</h3>
            <p className="text-gray-600">
              Track every rupee. Understand exactly where your money goes with detailed breakdowns and analytics.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💳 Debt Management</h3>
            <p className="text-gray-600">
              Calculate debt-free dates, compare repayment strategies, and save thousands in interest.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Smart Planning</h3>
            <p className="text-gray-600">
              Plan your marriage, home, education. Get realistic timelines based on your actual finances.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">⚠️ Early Warnings</h3>
            <p className="text-gray-600">
              Know how much you can safely spend each day. Get alerts before you run out of money.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🤖 AI Coach</h3>
            <p className="text-gray-600">
              Get personalized recommendations every week. Understand spending patterns and fix them.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Wealth Tracking</h3>
            <p className="text-gray-600">
              See your net worth grow. Track assets, goals, and financial health over time.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Finances?</h2>
          <p className="text-lg mb-8">Join thousands who are already managing their money smarter with FinFlow.</p>
          <a
            href="/signup"
            className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start for Free
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 FinFlow. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
