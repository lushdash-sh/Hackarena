import React, { useState, useMemo } from 'react';

const TransactionLedger = ({ transactions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'date') {
        aValue = new Date(a.date + ' ' + a.time);
        bValue = new Date(b.date + ' ' + b.time);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [transactions, sortField, sortDirection]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedTransactions.slice(startIndex, endIndex);
  }, [sortedTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
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
      'Gas': '⛽',
      'Subscriptions': '📱'
    };
    
    if (description.toLowerCase().includes('coffee')) return icons.Coffee;
    if (description.toLowerCase().includes('lunch') || description.toLowerCase().includes('food')) return icons.Lunch;
    if (description.toLowerCase().includes('grocer')) return icons.Groceries;
    if (description.toLowerCase().includes('movie') || description.toLowerCase().includes('theater')) return icons.Entertainment;
    if (description.toLowerCase().includes('target') || description.toLowerCase().includes('shop')) return icons.Shopping;
    if (description.toLowerCase().includes('chipotle') || description.toLowerCase().includes('mcdonald')) return icons.FastFood;
    if (description.toLowerCase().includes('barnes') || description.toLowerCase().includes('education')) return icons.Education;
    if (description.toLowerCase().includes('gas') || description.toLowerCase().includes('shell')) return icons.Gas;
    if (description.toLowerCase().includes('netflix') || description.toLowerCase().includes('spotify')) return icons.Subscriptions;
    
    return '💳';
  };

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Transaction Ledger</h3>
        <div className="flex items-center space-x-4">
          <select 
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-gray-700 text-gray-300 border border-gray-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th 
                className="px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {sortField === 'date' && (
                    <span className="text-green-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('merchant')}
              >
                <div className="flex items-center space-x-1">
                  <span>Merchant</span>
                  {sortField === 'merchant' && (
                    <span className="text-green-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('originalAmount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Original Price</span>
                  {sortField === 'originalAmount' && (
                    <span className="text-green-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-gray-400 font-medium">
                Round-Up Multiplier
              </th>
              <th 
                className="px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('roundUpSaved')}
              >
                <div className="flex items-center space-x-1">
                  <span>Total Saved</span>
                  {sortField === 'roundUpSaved' && (
                    <span className="text-green-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction) => (
              <tr 
                key={transaction.id} 
                className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="text-white text-sm">
                      {new Date(transaction.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                    <p className="text-gray-400 text-xs">{transaction.time}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getMerchantIcon(transaction.description)}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{transaction.description}</p>
                      <p className="text-gray-400 text-xs">{transaction.category || 'General'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-gray-300">{formatCurrency(transaction.actualAmount)}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.multiplier === 1 
                        ? 'bg-gray-600 text-gray-300' 
                        : 'bg-green-900/50 text-green-400'
                    }`}>
                      {transaction.multiplier}x
                    </span>
                    {transaction.multiplier > 1 && (
                      <span className="text-green-400 text-xs">Boosted</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-green-400 font-medium">
                    +{formatCurrency(transaction.roundUpSaved)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-gray-400 text-sm">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, sortedTransactions.length)} of{' '}
          {sortedTransactions.length} transactions
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionLedger;
