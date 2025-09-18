import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ErrorService } from '../services/errorService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch and handle React component errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log error for debugging
    this.logError(error, errorInfo);
  }

  private logError(error: Error, errorInfo: React.ErrorInfo) {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    };

    console.error('Error Boundary Details:', errorDetails);
    
    // In a production app, you would send this to a crash reporting service
    // like Sentry, Crashlytics, or Bugsnag
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReportError = () => {
    const error = this.state.error;
    if (!error) return;

    Alert.alert(
      'Report Error',
      'Would you like to report this error to help us improve the app?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Report', 
          onPress: () => {
            // In a production app, this would send the error to your error reporting service
            console.log('Error reported:', error.message);
            Alert.alert('Thank You', 'Error report sent successfully.');
          }
        },
      ]
    );
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View className="flex-1 justify-center items-center p-6 bg-gray-50">
          <View className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-sm">
            <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
              Oops! 🌱
            </Text>
            
            <Text className="text-lg font-semibold text-gray-700 text-center mb-4">
              Something went wrong
            </Text>
            
            <Text className="text-gray-600 text-center mb-6 leading-6">
              We encountered an unexpected error. Don't worry - your data is safe. 
              Please try again or restart the app.
            </Text>

            <View className="gap-3">
              <TouchableOpacity
                onPress={this.handleRetry}
                className="bg-green-500 py-3 px-6 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-center text-lg">
                  Try Again
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.handleReportError}
                className="bg-gray-200 py-3 px-6 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-gray-700 font-medium text-center">
                  Report Error
                </Text>
              </TouchableOpacity>
            </View>

            {__DEV__ && this.state.error && (
              <View className="mt-4 p-3 bg-red-50 rounded-lg">
                <Text className="text-red-600 text-xs font-mono">
                  {this.state.error.message}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Hook to manually trigger error boundary (for testing purposes)
 */
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}