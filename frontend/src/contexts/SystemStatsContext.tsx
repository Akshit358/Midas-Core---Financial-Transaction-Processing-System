'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSystemStats } from '@/hooks/useSystemStats';

interface SystemStatsContextType {
  stats: any;
  isLoading: boolean;
  error: any;
  refreshStats: () => void;
  isPolling: boolean;
}

const SystemStatsContext = createContext<SystemStatsContextType | undefined>(undefined);

interface SystemStatsProviderProps {
  children: ReactNode;
}

export function SystemStatsProvider({ children }: SystemStatsProviderProps) {
  const systemStats = useSystemStats();

  return (
    <SystemStatsContext.Provider value={systemStats}>
      {children}
    </SystemStatsContext.Provider>
  );
}

export function useSystemStatsContext() {
  const context = useContext(SystemStatsContext);
  if (context === undefined) {
    throw new Error('useSystemStatsContext must be used within a SystemStatsProvider');
  }
  return context;
}
