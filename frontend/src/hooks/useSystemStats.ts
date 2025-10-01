import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { systemStatsService } from '@/services/systemStatsService';

export interface SystemStats {
  totalCustomers: number;
  totalAccounts: number;
  totalTransactions: number;
  totalVolume: number;
  systemUptime: number;
  activeUsers: number;
  pendingTransactions: number;
  failedTransactions: number;
  averageResponseTime: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  networkLatency: number;
  lastUpdated: string;
}

export function useSystemStats() {
  const [isPolling, setIsPolling] = useState(false);

  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery<SystemStats>(
    'systemStats',
    () => systemStatsService.getStats(),
    {
      refetchInterval: isPolling ? 5000 : false,
      refetchOnWindowFocus: true,
      staleTime: 30000,
    }
  );

  useEffect(() => {
    // Start polling when component mounts
    setIsPolling(true);

    // Stop polling when component unmounts
    return () => setIsPolling(false);
  }, []);

  const refreshStats = () => {
    refetch();
  };

  return {
    stats,
    isLoading,
    error,
    refreshStats,
    isPolling,
  };
}
