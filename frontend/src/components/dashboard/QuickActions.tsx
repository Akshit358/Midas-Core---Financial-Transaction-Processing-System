'use client';

import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  ArrowUpDownIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  UserPlusIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const quickActions = [
  {
    name: 'New Transaction',
    description: 'Process a new transaction',
    icon: PlusIcon,
    color: 'blue',
    href: '#',
  },
  {
    name: 'Transfer Funds',
    description: 'Transfer between accounts',
    icon: ArrowUpDownIcon,
    color: 'green',
    href: '#',
  },
  {
    name: 'Generate Report',
    description: 'Create financial reports',
    icon: DocumentTextIcon,
    color: 'purple',
    href: '#',
  },
  {
    name: 'View Analytics',
    description: 'Access detailed analytics',
    icon: ChartBarIcon,
    color: 'indigo',
    href: '#',
  },
  {
    name: 'Add Customer',
    description: 'Register new customer',
    icon: UserPlusIcon,
    color: 'emerald',
    href: '#',
  },
  {
    name: 'System Settings',
    description: 'Configure system settings',
    icon: CogIcon,
    color: 'gray',
    href: '#',
  },
  {
    name: 'Security Audit',
    description: 'Review security logs',
    icon: ShieldCheckIcon,
    color: 'red',
    href: '#',
  },
  {
    name: 'Notifications',
    description: 'Manage notifications',
    icon: BellIcon,
    color: 'yellow',
    href: '#',
  },
];

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  gray: 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
};

export function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
          >
            <div className={`p-2 rounded-lg ${colorClasses[action.color as keyof typeof colorClasses]}`}>
              <action.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {action.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Recent Activity
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Transaction TXN-001 completed</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>New customer registered</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>System maintenance scheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
