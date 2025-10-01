'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const mockData = [
  { name: 'Jan', transactions: 2400, volume: 120000, success: 98.5 },
  { name: 'Feb', transactions: 1398, volume: 98000, success: 97.8 },
  { name: 'Mar', transactions: 9800, volume: 156000, success: 99.1 },
  { name: 'Apr', transactions: 3908, volume: 189000, success: 98.9 },
  { name: 'May', transactions: 4800, volume: 234000, success: 99.3 },
  { name: 'Jun', transactions: 3800, volume: 198000, success: 98.7 },
  { name: 'Jul', transactions: 4300, volume: 221000, success: 99.0 },
];

const chartTypes = [
  { id: 'line', name: 'Line Chart', icon: '📈' },
  { id: 'area', name: 'Area Chart', icon: '📊' },
  { id: 'bar', name: 'Bar Chart', icon: '📋' },
];

export function TransactionChart() {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const handleTimeRangeChange = async (range: string) => {
    setIsLoading(true);
    setTimeRange(range);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  const renderChart = () => {
    const commonProps = {
      data: mockData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: 'none', 
                borderRadius: '8px',
                color: 'white'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="transactions" 
              stroke="#3b82f6" 
              fill="url(#colorGradient)" 
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: 'none', 
                borderRadius: '8px',
                color: 'white'
              }} 
            />
            <Bar dataKey="transactions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: 'none', 
                borderRadius: '8px',
                color: 'white'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="transactions" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaction Analytics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time transaction volume and trends
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Period:</span>
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {chartTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setChartType(type.id)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  chartType === type.id
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {type.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                28,234
              </p>
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+12.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                99.1%
              </p>
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+0.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Avg. Response Time
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                145ms
              </p>
            </div>
            <div className="flex items-center text-red-600 dark:text-red-400">
              <ArrowDownIcon className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">-8.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
