import React from 'react';

const SmartVault = ({ vaultData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Active</span>
        </div>
        <button className="text-gray-400 hover:text-gray-300 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Total Vaulted</h3>
        <p className="text-3xl font-bold text-green-400 mb-4">
          {formatCurrency(vaultData.totalVaulted)}
        </p>
        
        {/* Vault progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Vault Capacity</span>
            <span className="text-sm text-gray-400">
              {Math.round((vaultData.totalVaulted / vaultData.maxCapacity) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(vaultData.totalVaulted / vaultData.maxCapacity) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Vault stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-gray-400 mb-1">Monthly Growth</p>
            <p className="text-green-400 font-semibold">+{vaultData.monthlyGrowth}%</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-gray-400 mb-1">Interest Rate</p>
            <p className="text-green-400 font-semibold">{vaultData.interestRate}% APY</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartVault;
