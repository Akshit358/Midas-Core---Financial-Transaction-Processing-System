'use client';

import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface SystemHealthProps {
  stats: any;
}

const healthMetrics = [
  {
    name: 'API Response Time',
    value: '145ms',
    status: 'good',
    threshold: 200,
  },
  {
    name: 'Database Connection',
    value: 'Connected',
    status: 'good',
  },
  {
    name: 'Memory Usage',
    value: '68%',
    status: 'warning',
    threshold: 80,
  },
  {
    name: 'CPU Usage',
    value: '45%',
    status: 'good',
    threshold: 70,
  },
  {
    name: 'Disk Space',
    value: '82%',
    status: 'warning',
    threshold: 85,
  },
  {
    name: 'Active Connections',
    value: '1,247',
    status: 'good',
  },
];

export function SystemHealth({ stats }: SystemHealthProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          System Health
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            All Systems Operational
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {healthMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(metric.status)}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {metric.name}
                </p>
                <p className={`text-xs ${getStatusColor(metric.status)}`}>
                  {metric.status === 'good' ? 'Healthy' : 
                   metric.status === 'warning' ? 'Warning' : 'Critical'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {metric.value}
              </p>
              {metric.threshold && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Threshold: {metric.threshold}%
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Status */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            System Status: All services running normally
          </span>
        </div>
        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
