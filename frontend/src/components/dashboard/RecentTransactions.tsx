'use client';

import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const mockTransactions = [
  {
    id: 'TXN-001',
    type: 'deposit',
    amount: 2500.00,
    currency: 'USD',
    status: 'completed',
    timestamp: '2024-01-15T10:30:00Z',
    from: 'John Doe',
    to: 'Account #1234',
  },
  {
    id: 'TXN-002',
    type: 'transfer',
    amount: 750.00,
    currency: 'USD',
    status: 'pending',
    timestamp: '2024-01-15T10:25:00Z',
    from: 'Account #1234',
    to: 'Account #5678',
  },
  {
    id: 'TXN-003',
    type: 'withdrawal',
    amount: 500.00,
    currency: 'USD',
    status: 'completed',
    timestamp: '2024-01-15T10:20:00Z',
    from: 'Account #1234',
    to: 'ATM #001',
  },
  {
    id: 'TXN-004',
    type: 'deposit',
    amount: 1200.00,
    currency: 'USD',
    status: 'failed',
    timestamp: '2024-01-15T10:15:00Z',
    from: 'Jane Smith',
    to: 'Account #5678',
  },
  {
    id: 'TXN-005',
    type: 'transfer',
    amount: 300.00,
    currency: 'USD',
    status: 'completed',
    timestamp: '2024-01-15T10:10:00Z',
    from: 'Account #5678',
    to: 'Account #9012',
  },
];

export function RecentTransactions() {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpIcon className="w-4 h-4 text-red-500" />;
      case 'transfer':
        return <ArrowRightIcon className="w-4 h-4 text-blue-500" />;
      default:
        return <ArrowRightIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {mockTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.id}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {transaction.from} → {transaction.to}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatAmount(transaction.amount, transaction.currency)}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(transaction.timestamp)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          Load More Transactions
        </button>
      </div>
    </div>
  );
}
