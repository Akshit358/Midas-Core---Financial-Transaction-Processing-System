import { apiClient } from './apiClient';
import { User, LoginRequest, RegisterRequest, AuthResponse, PasswordResetRequest, PasswordResetConfirm, ChangePasswordRequest } from '@/types/user';

class AuthService {
  private baseUrl = '/api/v1/auth';

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post(`${this.baseUrl}/login`, {
      email,
      password,
    });
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post(`${this.baseUrl}/register`, userData);
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post(`${this.baseUrl}/logout`);
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post(`${this.baseUrl}/refresh`);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get(`${this.baseUrl}/me`);
    return response.data;
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.post(`${this.baseUrl}/change-password`, data);
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    await apiClient.post(`${this.baseUrl}/forgot-password`, data);
  }

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
    await apiClient.post(`${this.baseUrl}/reset-password`, data);
  }

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/verify-email`, { token });
  }

  async resendVerificationEmail(): Promise<void> {
    await apiClient.post(`${this.baseUrl}/resend-verification`);
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put(`${this.baseUrl}/profile`, userData);
    return response.data;
  }

  async deleteAccount(): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/account`);
  }
}

export const authService = new AuthService();
