import { apiClient } from './apiClient';
import { SystemStats } from '@/hooks/useSystemStats';

class SystemStatsService {
  private baseUrl = '/api/v1/system';

  async getStats(): Promise<SystemStats> {
    const response = await apiClient.get(`${this.baseUrl}/stats`);
    return response.data;
  }

  async getHealth(): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/health`);
    return response.data;
  }

  async getMetrics(): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/metrics`);
    return response.data;
  }

  async getPerformance(): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/performance`);
    return response.data;
  }

  async getAlerts(): Promise<any[]> {
    const response = await apiClient.get(`${this.baseUrl}/alerts`);
    return response.data;
  }

  async getLogs(level?: string, limit?: number): Promise<any[]> {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (limit) params.append('limit', limit.toString());
    
    const response = await apiClient.get(`${this.baseUrl}/logs?${params}`);
    return response.data;
  }
}

export const systemStatsService = new SystemStatsService();
