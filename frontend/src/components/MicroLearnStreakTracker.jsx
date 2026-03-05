import React from 'react';

const MicroLearnStreakTracker = ({ streak }) => {
  const progressPercentage = (streak.currentDays / streak.requiredDays) * 100;
  
  const getStreakColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-purple-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">MicroLearn Streak</h3>
        <div className="flex items-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < Math.floor(streak.currentDays / 3) ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {streak.currentDays} / {streak.requiredDays} Days
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${getStreakColor(progressPercentage)} transition-all duration-500 ease-out rounded-full relative overflow-hidden`}
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Next Reward */}
      <div className="bg-white rounded-xl p-4 border border-purple-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Next Reward</p>
            <p className="text-xs text-gray-600">{streak.nextReward}</p>
          </div>
          {streak.currentDays >= streak.requiredDays && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Unlocked!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-600">
          {streak.currentDays === 0 && "Start your learning journey today!"}
          {streak.currentDays > 0 && streak.currentDays < streak.requiredDays && 
            `${streak.requiredDays - streak.currentDays} more days to unlock your reward!`}
          {streak.currentDays >= streak.requiredDays && "🎉 Congratulations! Reward unlocked!"}
        </p>
      </div>
    </div>
  );
};

export default MicroLearnStreakTracker;
