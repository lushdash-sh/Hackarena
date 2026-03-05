import React from 'react';

const Sidebar = ({ activeItem = 'dashboard' }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'trust-score', label: 'Trust Score', icon: '🛡️' },
    { id: 'smart-vault', label: 'Smart Vault', icon: '🔐' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen flex flex-col border-r border-gray-800">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">₿</span>
          </div>
          <h1 className="text-xl font-bold text-white">CoinStash</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`sidebar-item w-full text-left ${
                  activeItem === item.id ? 'sidebar-item-active' : 'text-gray-400'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">AC</span>
          </div>
          <div>
            <p className="text-white font-medium">Alex Chen</p>
            <p className="text-gray-400 text-sm">Student</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
