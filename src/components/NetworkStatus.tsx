import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { networkService } from '../services/networkService';
import { queueService } from '../services/queueService';
import { NetworkState, QueuedScan } from '../types';

interface NetworkStatusProps {
  showWhenOnline?: boolean;
  className?: string;
}

/**
 * Component to display network connectivity status and queued scans
 */
export function NetworkStatus({ showWhenOnline = false, className = '' }: NetworkStatusProps) {
  const [networkState, setNetworkState] = useState<NetworkState>(networkService.getNetworkState());
  const [queuedScans, setQueuedScans] = useState<QueuedScan[]>([]);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribeNetwork = networkService.addListener(setNetworkState);
    
    // Subscribe to queue changes
    const unsubscribeQueue = queueService.addListener(setQueuedScans);
    
    // Get initial queue state
    setQueuedScans(queueService.getQueue());

    return () => {
      unsubscribeNetwork();
      unsubscribeQueue();
    };
  }, []);

  const handleRetryQueue = async () => {
    if (networkState.isConnected) {
      await queueService.processQueue();
    }
  };

  // Don't show anything if online and showWhenOnline is false
  if (networkState.isConnected && !showWhenOnline && queuedScans.length === 0) {
    return null;
  }

  return (
    <View className={`${className}`}>
      {/* Network Status */}
      {(!networkState.isConnected || showWhenOnline) && (
        <View className={`px-4 py-2 rounded-lg ${
          networkState.isConnected 
            ? 'bg-green-100 border border-green-200' 
            : 'bg-red-100 border border-red-200'
        }`}>
          <Text className={`text-sm font-medium text-center ${
            networkState.isConnected ? 'text-green-800' : 'text-red-800'
          }`}>
            {networkState.isConnected ? '🟢 Online' : '🔴 Offline'}
          </Text>
        </View>
      )}

      {/* Queued Scans Status */}
      {queuedScans.length > 0 && (
        <View className="mt-2 px-4 py-3 bg-yellow-100 border border-yellow-200 rounded-lg">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-yellow-800 font-medium text-sm">
                📤 {queuedScans.length} scan{queuedScans.length !== 1 ? 's' : ''} queued
              </Text>
              <Text className="text-yellow-700 text-xs mt-1">
                {networkState.isConnected 
                  ? 'Processing when possible...' 
                  : 'Will process when back online'
                }
              </Text>
            </View>
            
            {networkState.isConnected && (
              <TouchableOpacity
                onPress={handleRetryQueue}
                className="bg-yellow-200 px-3 py-1 rounded-md ml-2"
                activeOpacity={0.7}
              >
                <Text className="text-yellow-800 text-xs font-medium">
                  Retry
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

/**
 * Simple network indicator for status bars
 */
export function NetworkIndicator() {
  const [isConnected, setIsConnected] = useState(networkService.isConnected());

  useEffect(() => {
    const unsubscribe = networkService.addListener((state) => {
      setIsConnected(state.isConnected);
    });

    return unsubscribe;
  }, []);

  if (isConnected) {
    return null;
  }

  return (
    <View className="bg-red-500 px-2 py-1">
      <Text className="text-white text-xs font-medium text-center">
        No Internet Connection
      </Text>
    </View>
  );
}