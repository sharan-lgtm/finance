'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    age: '',
    city: '',
    monthlyIncome: '',
    salaryDate: '',
    fixedExpenses: '',
    dependents: '0',
    maritalStatus: 'single',
  });
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Update profile
      await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          age: parseInt(formData.age),
          city: formData.city,
          maritalStatus: formData.maritalStatus,
          dependents: parseInt(formData.dependents),
        }),
      });

      // Add income
      if (formData.monthlyIncome) {
        await fetch('http://localhost:5000/api/income', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            source: 'salary',
            amount: parseFloat(formData.monthlyIncome),
            frequency: 'monthly',
            salaryDate: parseInt(formData.salaryDate) || 1,
            isStable: true,
          }),
        });
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's Get Started! 🚀</h1>
        <p className="text-gray-600 mb-8">Tell us about your finances so we can help you manage them better.</p>

        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 mx-1 rounded-full ${
                  s <= step ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">Step {step} of 3</p>
        </div>

        <div className="space-y-4 mb-8">
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <input
                type="text"
                name="firstName"
                placeholder="Your Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
              </select>
              <input
                type="number"
                name="dependents"
                placeholder="Number of Dependents"
                value={formData.dependents}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Income Details</h2>
              <input
                type="number"
                name="monthlyIncome"
                placeholder="Monthly Salary (₹)"
                value={formData.monthlyIncome}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="number"
                name="salaryDate"
                placeholder="Salary Date (1-31)"
                value={formData.salaryDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="number"
                name="fixedExpenses"
                placeholder="Fixed Monthly Expenses (₹)"
                value={formData.fixedExpenses}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Confirm</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong> {formData.firstName || 'Not provided'}<br />
                  <strong>Age:</strong> {formData.age || 'Not provided'}<br />
                  <strong>Monthly Income:</strong> ₹{formData.monthlyIncome || '0'}<br />
                  <strong>Salary Date:</strong> {formData.salaryDate || 'Not provided'}<br />
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                You can update these details later in your profile settings.
              </p>
            </>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Processing...' : step === 3 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
