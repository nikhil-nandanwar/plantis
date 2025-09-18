import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ErrorState } from '../types';

interface ErrorDisplayProps {
  error: ErrorState;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  compact?: boolean;
}

/**
 * Component to display error messages with retry and dismiss options
 */
export function ErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  className = '',
  compact = false 
}: ErrorDisplayProps) {
  if (!error.hasError) {
    return null;
  }

  const getErrorIcon = (code?: string) => {
    switch (code) {
      case 'NETWORK_ERROR':
        return '📡';
      case 'PERMISSION_ERROR':
        return '🔒';
      case 'IMAGE_ERROR':
        return '📷';
      case 'API_ERROR':
        return '⚠️';
      case 'STORAGE_ERROR':
        return '💾';
      default:
        return '❌';
    }
  };

  const getErrorTitle = (code?: string) => {
    switch (code) {
      case 'NETWORK_ERROR':
        return 'Connection Error';
      case 'PERMISSION_ERROR':
        return 'Permission Required';
      case 'IMAGE_ERROR':
        return 'Image Error';
      case 'API_ERROR':
        return 'Service Error';
      case 'STORAGE_ERROR':
        return 'Storage Error';
      default:
        return 'Error';
    }
  };

  if (compact) {
    return (
      <View className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}>
        <View className="flex-row items-center">
          <Text className="text-lg mr-2">{getErrorIcon(error.code)}</Text>
          <Text className="flex-1 text-red-800 text-sm">{error.message}</Text>
          {error.retryable && onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              className="bg-red-100 px-2 py-1 rounded ml-2"
              activeOpacity={0.7}
            >
              <Text className="text-red-700 text-xs font-medium">Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className={`bg-white rounded-2xl shadow-lg border border-red-100 ${className}`}>
      <View className="p-6">
        {/* Error Icon and Title */}
        <View className="items-center mb-4">
          <Text className="text-4xl mb-2">{getErrorIcon(error.code)}</Text>
          <Text className="text-xl font-bold text-gray-800">
            {getErrorTitle(error.code)}
          </Text>
        </View>

        {/* Error Message */}
        <Text className="text-gray-600 text-center leading-6 mb-6">
          {error.message}
        </Text>

        {/* Action Buttons */}
        <View className="gap-3">
          {error.retryable && onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              className="bg-red-500 py-3 px-6 rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-center text-lg">
                Try Again
              </Text>
            </TouchableOpacity>
          )}

          {onDismiss && (
            <TouchableOpacity
              onPress={onDismiss}
              className="bg-gray-200 py-3 px-6 rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-gray-700 font-medium text-center">
                Dismiss
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Error Code (for debugging) */}
        {__DEV__ && error.code && (
          <View className="mt-4 p-2 bg-gray-100 rounded">
            <Text className="text-gray-500 text-xs text-center">
              Error Code: {error.code}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * Inline error message component for forms and inputs
 */
export function InlineError({ 
  message, 
  className = '' 
}: { 
  message: string; 
  className?: string; 
}) {
  return (
    <View className={`flex-row items-center mt-1 ${className}`}>
      <Text className="text-red-500 text-xs mr-1">⚠️</Text>
      <Text className="text-red-500 text-xs flex-1">{message}</Text>
    </View>
  );
}

/**
 * Banner error component for top-level errors
 */
export function ErrorBanner({ 
  error, 
  onDismiss,
  className = '' 
}: { 
  error: ErrorState; 
  onDismiss?: () => void;
  className?: string;
}) {
  if (!error.hasError) {
    return null;
  }

  return (
    <View className={`bg-red-500 px-4 py-3 ${className}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <Text className="text-white text-sm mr-2">⚠️</Text>
          <Text className="text-white text-sm flex-1">{error.message}</Text>
        </View>
        
        {onDismiss && (
          <TouchableOpacity
            onPress={onDismiss}
            className="ml-2 p-1"
            activeOpacity={0.7}
          >
            <Text className="text-white text-lg">×</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}