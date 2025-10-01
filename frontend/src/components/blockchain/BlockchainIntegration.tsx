'use client';

import { motion } from 'framer-motion';
import { LockClosedIcon, LinkIcon, ShieldCheckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export function BlockchainIntegration() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Blockchain Integration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Secure, immutable transaction records with smart contract automation
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Blockchain Status
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Network Status
                </span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Block Height
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                1,234,567
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Transactions
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                28,234
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Smart Contracts
          </h2>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white">Transaction Verification</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automated transaction validation</p>
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white">Escrow Management</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Secure fund holding and release</p>
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white">Compliance Checks</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automated regulatory compliance</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
