'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon, 
  BoltIcon,
  CpuChipIcon,
  GlobeAltIcon,
  LockClosedIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  UserGroupIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { TransactionProcessor } from '@/components/transactions/TransactionProcessor';
import { AnalyticsPanel } from '@/components/analytics/AnalyticsPanel';
import { AIPoweredFeatures } from '@/components/ai/AIPoweredFeatures';
import { BlockchainIntegration } from '@/components/blockchain/BlockchainIntegration';
import { RealTimeMonitor } from '@/components/monitoring/RealTimeMonitor';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useSystemStats } from '@/hooks/useSystemStats';

const features = [
  {
    name: 'AI-Powered Analytics',
    description: 'Advanced machine learning algorithms for fraud detection and risk assessment',
    icon: CpuChipIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Blockchain Integration',
    description: 'Secure, immutable transaction records with smart contract automation',
    icon: LockClosedIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    name: 'Real-Time Processing',
    description: 'Ultra-fast transaction processing with sub-second response times',
    icon: BoltIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    name: 'Advanced Security',
    description: 'Multi-layer security with biometric authentication and zero-trust architecture',
    icon: ShieldCheckIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    name: 'Global Scale',
    description: 'Worldwide transaction processing with multi-currency support',
    icon: GlobeAltIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Smart Automation',
    description: 'Intelligent workflow automation and predictive analytics',
    icon: SparklesIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { stats, isLoading: statsLoading } = useSystemStats();
  const { isConnected, lastMessage } = useWebSocket();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Midas Core</h2>
          <p className="text-gray-600">Initializing Next-Gen Financial Platform...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 ml-64 p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard stats={stats} isLoading={statsLoading} />
              </motion.div>
            )}
            
            {activeTab === 'transactions' && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TransactionProcessor />
              </motion.div>
            )}
            
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AnalyticsPanel />
              </motion.div>
            )}
            
            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AIPoweredFeatures />
              </motion.div>
            )}
            
            {activeTab === 'blockchain' && (
              <motion.div
                key="blockchain"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BlockchainIntegration />
              </motion.div>
            )}
            
            {activeTab === 'monitoring' && (
              <motion.div
                key="monitoring"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RealTimeMonitor />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Hero Section for non-authenticated users */}
      {!isAuthenticated && (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="gradient-text">Midas Core</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Next-Generation Financial Platform powered by AI, Blockchain, and Advanced Analytics
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                  >
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                    <p className="text-gray-200">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-12"
              >
                <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Started
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
