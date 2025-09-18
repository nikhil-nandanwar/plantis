import { APIConfig } from '../types';

export const API_CONFIG: APIConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.plantis.app',
  endpoints: {
    analyze: '/v1/analyze',
    health: '/v1/health'
  },
  timeout: 30000,
  maxRetries: 3
};

export const IMAGE_CONFIG = {
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.8,
  maxSizeBytes: 2 * 1024 * 1024, // 2MB
};