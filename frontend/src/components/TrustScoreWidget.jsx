import React from 'react';

const TrustScoreWidget = ({ trustScore }) => {
  const percentage = (trustScore.current / trustScore.max) * 100;
  const strokeDasharray = 2 * Math.PI * 45;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  const getScoreColor = (score) => {
    if (score >= 700) return 'text-green-400';
    if (score >= 500) return 'text-yellow-400';
    if (score >= 300) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressColor = (score) => {
    if (score >= 700) return '#4ade80'; // green-400
    if (score >= 500) return '#facc15'; // yellow-400
    if (score >= 300) return '#fb923c'; // orange-400
    return '#f87171'; // red-400
  };

  const getScoreLabel = (score) => {
    if (score >= 700) return 'Good';
    if (score >= 500) return 'Fair';
    if (score >= 300) return 'Building';
    return 'New';
  };

  return (
    <div className="dashboard-card">
      <h3 className="text-lg font-semibold text-white mb-6">TRUST SCORE</h3>
      
      <div className="flex flex-col items-center">
        {/* Circular Gauge */}
        <div className="relative w-40 h-40 mb-6">
          <svg className="w-40 h-40 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="#374151"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke={getProgressColor(trustScore.current)}
              strokeWidth="12"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(trustScore.current)}`}>
              {trustScore.current}
            </span>
            <span className="text-sm text-gray-400">{getScoreLabel(trustScore.current)}</span>
          </div>
        </div>

        {/* Score Range */}
        <div className="w-full mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>300</span>
            <span>600</span>
            <span>900</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Trust Status */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">Loan Eligibility</p>
          <p className="text-green-400 font-medium">
            {trustScore.eligibility}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustScoreWidget;
