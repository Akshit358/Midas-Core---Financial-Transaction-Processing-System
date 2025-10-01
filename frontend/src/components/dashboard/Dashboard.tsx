'use client';

import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  BanknotesIcon, 
  ArrowTrendingUpIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { StatsCard } from './StatsCard';
import { TransactionChart } from './TransactionChart';
import { RecentTransactions } from './RecentTransactions';
import { SystemHealth } from './SystemHealth';
import { QuickActions } from './QuickActions';
import { AlertsPanel } from './AlertsPanel';

interface DashboardProps {
  stats: any;
  isLoading: boolean;
}

export function Dashboard({ stats, isLoading }: DashboardProps) {
  const statsCards = [
    {
      title: 'Total Volume',
      value: `$${stats?.totalVolume?.toLocaleString() || '0'}`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: CurrencyDollarIcon,
      color: 'blue',
    },
    {
      title: 'Active Customers',
      value: stats?.totalCustomers?.toLocaleString() || '0',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: UserGroupIcon,
      color: 'green',
    },
    {
      title: 'Total Accounts',
      value: stats?.totalAccounts?.toLocaleString() || '0',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: BanknotesIcon,
      color: 'purple',
    },
    {
      title: 'Success Rate',
      value: `${((stats?.totalTransactions - stats?.failedTransactions) / stats?.totalTransactions * 100 || 99.9).toFixed(1)}%`,
      change: '+0.1%',
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      color: 'emerald',
    },
    {
      title: 'Pending Transactions',
      value: stats?.pendingTransactions?.toLocaleString() || '0',
      change: '-5.2%',
      changeType: 'negative' as const,
      icon: ClockIcon,
      color: 'yellow',
    },
    {
      title: 'Failed Transactions',
      value: stats?.failedTransactions?.toLocaleString() || '0',
      change: '-12.1%',
      changeType: 'positive' as const,
      icon: XCircleIcon,
      color: 'red',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your financial platform.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <StatsCard {...card} isLoading={isLoading} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <TransactionChart />
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SystemHealth stats={stats} />
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecentTransactions />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <QuickActions />
        </motion.div>
      </div>

      {/* Alerts Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <AlertsPanel />
      </motion.div>
    </div>
  );
}
