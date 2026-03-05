import React from 'react';

const RecentRoundUps = ({ transactions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTimeAgo = (dateStr, timeStr) => {
    // Simple time ago logic - in real app would use proper date calculation
    const now = new Date();
    const transactionTime = new Date(`${dateStr} ${timeStr}`);
    const diffInMinutes = Math.floor((now - transactionTime) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const getMerchantIcon = (description) => {
    const icons = {
      'Coffee': '☕',
      'Lunch': '🍽️',
      'Groceries': '🛒',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'FastFood': '🍔',
      'Education': '📚',
      'Gas': '⛽'
    };
    
    // Simple categorization based on description
    if (description.toLowerCase().includes('coffee')) return icons.Coffee;
    if (description.toLowerCase().includes('lunch') || description.toLowerCase().includes('food')) return icons.Lunch;
    if (description.toLowerCase().includes('grocer')) return icons.Groceries;
    if (description.toLowerCase().includes('movie') || description.toLowerCase().includes('theater')) return icons.Entertainment;
    if (description.toLowerCase().includes('target') || description.toLowerCase().includes('shop')) return icons.Shopping;
    if (description.toLowerCase().includes('chipotle') || description.toLowerCase().includes('mcdonald')) return icons.FastFood;
    if (description.toLowerCase().includes('barnes') || description.toLowerCase().includes('education')) return icons.Education;
    if (description.toLowerCase().includes('gas') || description.toLowerCase().includes('shell')) return icons.Gas;
    
    return '💳'; // Default icon
  };

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">RECENT ROUND-UPS</h3>
        <button className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {transactions.slice(0, 3).map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-lg">{getMerchantIcon(transaction.description)}</span>
              </div>
              <div>
                <p className="text-white font-medium">{transaction.description}</p>
                <p className="text-gray-400 text-sm">
                  {getTimeAgo(transaction.date, transaction.time)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-green-400 font-semibold">
                +{formatCurrency(transaction.roundUpSaved)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Total saved */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Total from round-ups</span>
          <span className="text-green-400 font-semibold">
            +{formatCurrency(transactions.reduce((sum, t) => sum + t.roundUpSaved, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecentRoundUps;
