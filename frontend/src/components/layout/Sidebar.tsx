'use client';

import { motion } from 'framer-motion';
import { 
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CpuChipIcon,
  LockClosedIcon,
  EyeIcon,
  CogIcon,
  UserGroupIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: HomeIcon,
    description: 'Overview and analytics',
  },
  {
    id: 'transactions',
    name: 'Transactions',
    icon: CurrencyDollarIcon,
    description: 'Process and manage transactions',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: ChartBarIcon,
    description: 'Advanced analytics and insights',
  },
  {
    id: 'ai',
    name: 'AI Features',
    icon: CpuChipIcon,
    description: 'AI-powered tools and automation',
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    icon: LockClosedIcon,
    description: 'Blockchain integration and smart contracts',
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    icon: EyeIcon,
    description: 'Real-time system monitoring',
  },
  {
    id: 'customers',
    name: 'Customers',
    icon: UserGroupIcon,
    description: 'Customer management',
  },
  {
    id: 'accounts',
    name: 'Accounts',
    icon: BanknotesIcon,
    description: 'Account management',
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: ArrowTrendingUpIcon,
    description: 'Financial reports and statements',
  },
  {
    id: 'security',
    name: 'Security',
    icon: ShieldCheckIcon,
    description: 'Security settings and audit logs',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: CogIcon,
    description: 'System configuration',
  },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isActive ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                    {item.name}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-blue-600 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              System Online
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            All systems operational
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Quick Actions
          </h3>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              New Transaction
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              Generate Report
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              View Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
