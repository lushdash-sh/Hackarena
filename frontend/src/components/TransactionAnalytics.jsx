import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TransactionAnalytics = ({ analyticsData }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Savings Growth Over Time */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold text-white mb-6">Savings Growth Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.savingsGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#f3f4f6' }}
              formatter={(value) => [formatCurrency(value), 'Saved']}
            />
            <Legend 
              wrapperStyle={{ color: '#9ca3af' }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Savings by Category */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold text-white mb-6">Savings by Category</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analyticsData.savingsByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.savingsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#f3f4f6' }}
                formatter={(value) => [formatCurrency(value), 'Saved']}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            <h4 className="text-white font-medium">Category Breakdown</h4>
            {analyticsData.savingsByCategory.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-300">{category.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{formatCurrency(category.value)}</p>
                  <p className="text-gray-400 text-sm">{category.transactions} transactions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Saved (30 days)</span>
            <span className="text-green-400 text-xl">📈</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(analyticsData.totalSaved30Days)}
          </p>
          <p className="text-green-400 text-sm mt-2">
            ↑ {analyticsData.growthPercentage}% vs last month
          </p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Most Active Category</span>
            <span className="text-blue-400 text-xl">🍔</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {analyticsData.mostActiveCategory}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {analyticsData.mostActiveCategoryTransactions} transactions
          </p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Avg. Daily Saving</span>
            <span className="text-purple-400 text-xl">💰</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(analyticsData.avgDailySaving)}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Based on last 30 days
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionAnalytics;
