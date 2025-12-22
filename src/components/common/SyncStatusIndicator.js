import React from 'react';
import { useSyncContext } from '../../context/SyncContext';

const SyncStatusIndicator = () => {
  const { syncStatus, isOnline, pendingCount, failedCount, triggerSync } = useSyncContext();

  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'synced':
        return {
          color: 'bg-green-500',
          text: 'Synced',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'syncing':
        return {
          color: 'bg-blue-500',
          text: 'Syncing...',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          animate: true
        };
      case 'pending':
        return {
          color: 'bg-yellow-500',
          text: `${pendingCount} Pending`,
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'failed':
        return {
          color: 'bg-red-500',
          text: `${failedCount} Failed`,
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'offline':
        return {
          color: 'bg-gray-500',
          text: 'Offline',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
      default:
        return {
          color: 'bg-gray-500',
          text: 'Unknown',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const handleClick = () => {
    if (isOnline && syncStatus !== 'syncing') {
      triggerSync();
    }
  };

  const config = getStatusConfig();

  return (
    <button
      onClick={handleClick}
      disabled={!isOnline || syncStatus === 'syncing'}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${config.bgColor} ${config.borderColor} ${config.textColor} transition ${
        isOnline && syncStatus !== 'syncing' ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'
      }`}
      title={isOnline ? 'Click to sync now' : 'You are offline'}
    >
      {/* Status Dot */}
      <span className="relative flex h-3 w-3">
        {config.animate && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-3 w-3 ${config.color}`}></span>
      </span>

      {/* Status Text */}
      <span className="text-sm font-medium">{config.text}</span>

      {/* Sync Icon (only show when can sync) */}
      {isOnline && syncStatus !== 'syncing' && syncStatus !== 'synced' && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      )}
    </button>
  );
};

export default SyncStatusIndicator;
