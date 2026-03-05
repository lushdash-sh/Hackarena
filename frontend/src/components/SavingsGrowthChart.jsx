import React from 'react';

const SavingsGrowthChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

  return (
    <div className="dashboard-card">
      <h3 className="text-lg font-semibold text-white mb-6">SAVINGS GROWTH</h3>
      
      <div className="relative h-48">
        {/* Chart area */}
        <div className="absolute inset-0 flex items-end justify-between">
          {data.map((point, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              {/* Bar */}
              <div 
                className="w-full max-w-8 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg relative"
                style={{ height: `${(point.value / maxValue) * 100}%` }}
              >
                {/* Value label */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-green-400 font-medium">
                  ${point.value}
                </div>
              </div>
              
              {/* Month label */}
              <div className="mt-2 text-xs text-gray-400">
                {months[index]}
              </div>
            </div>
          ))}
        </div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full flex flex-col justify-between">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div 
                key={percent}
                className="border-t border-gray-700 border-dashed"
                style={{ opacity: percent === 0 ? 0 : 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Chart summary */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-400">Monthly Savings</span>
        </div>
        <div className="text-sm text-green-400 font-medium">
          +${data[data.length - 1].value} this month
        </div>
      </div>
    </div>
  );
};

export default SavingsGrowthChart;
