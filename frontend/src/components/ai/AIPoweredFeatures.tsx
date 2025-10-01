'use client';

import { motion } from 'framer-motion';
import { CpuChipIcon, ShieldCheckIcon, LightBulbIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export function AIPoweredFeatures() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI-Powered Features
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Advanced machine learning capabilities for fraud detection and intelligent automation
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <ShieldCheckIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Fraud Detection
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Real-time AI-powered fraud detection using advanced machine learning algorithms.
          </p>
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            Active • 99.8% accuracy
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Risk Assessment
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Intelligent risk scoring and assessment for all transactions and customers.
          </p>
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Active • Real-time scoring
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <LightBulbIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Smart Automation
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Automated workflows and intelligent decision-making for routine operations.
          </p>
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            Active • 85% automation
          </div>
        </motion.div>
      </div>
    </div>
  );
}
