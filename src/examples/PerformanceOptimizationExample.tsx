import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { HistoryList } from '../components/history/HistoryList';
import { PerformanceMonitor } from '../components/PerformanceMonitor';
import { 
  performanceManager, 
  imageCacheManager, 
  memoryManager,
  formatBytes,
  formatDuration 
} from '../utils';
import { backgroundTaskService, initializeBackgroundTasks } from '../services';
import { ScanResult } from '../types';

/**
 * Example component demonstrating performance optimization features
 */
export const PerformanceOptimizationExample: React.FC = () => {
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializePerformanceFeatures();
  }, []);

  const initializePerformanceFeatures = async () => {
    try {
      // Initialize background tasks with custom configuration
      await initializeBackgroundTasks({
        enablePeriodicCleanup: true,
        enableMemoryOptimization: true,
        enableCacheOptimization: true,
        cleanupInterval: 30 * 60 * 1000, // 30 minutes
      });

      // Configure memory manager
      memoryManager.configure({
        maxConcurrentOperations: 2,
        memoryThreshold: 50 * 1024 * 1024, // 50MB
      });

      setIsInitialized(true);
      console.log('Performance features initialized');
    } catch (error) {
      console.error('Failed to initialize performance features:', error);
      Alert.alert('Error', 'Failed to initialize performance features');
    }
  };

  const loadPerformanceStats = async () => {
    try {
      const [metrics, cacheStats, memoryStats] = await Promise.all([
        performanceManager.updateMetrics(),
        imageCacheManager.getCacheStats(),
        memoryManager.getMemoryStats(),
      ]);

      setPerformanceStats({
        metrics,
        cacheStats,
        memoryStats,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Failed to load performance stats:', error);
    }
  };

  const handleManualCleanup = async () => {
    try {
      Alert.alert(
        'Manual Cleanup',
        'This will clear expired cache and optimize memory usage. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Cleanup',
            onPress: async () => {
              await Promise.all([
                performanceManager.performBackgroundCleanup(),
                imageCacheManager.clearExpiredCache(),
                memoryManager.performMemoryCleanup(),
              ]);
              
              Alert.alert('Success', 'Cleanup completed successfully');
              await loadPerformanceStats();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Cleanup failed');
    }
  };

  const handleOptimizeCache = async () => {
    try {
      const removedCount = await imageCacheManager.optimizeCache(30 * 1024 * 1024); // 30MB limit
      Alert.alert(
        'Cache Optimized',
        `Removed ${removedCount} old cache entries`
      );
      await loadPerformanceStats();
    } catch (error) {
      Alert.alert('Error', 'Cache optimization failed');
    }
  };

  const handleHistoryItemPress = (scanResult: ScanResult) => {
    // Handle history item press
    console.log('History item pressed:', scanResult.id);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Performance Optimization Demo
        </Text>
        <Text className="text-gray-600">
          Demonstrating image caching, lazy loading, memory optimization, and background cleanup
        </Text>
      </View>

      {/* Status Section */}
      <View className="p-4">
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            📊 System Status
          </Text>
          
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Performance Features:</Text>
              <Text className={`font-medium ${isInitialized ? 'text-green-600' : 'text-red-600'}`}>
                {isInitialized ? '✅ Initialized' : '❌ Not Initialized'}
              </Text>
            </View>
            
            {performanceStats && (
              <>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Memory Usage:</Text>
                  <Text className="font-medium">
                    {formatBytes(performanceStats.memoryStats.estimatedUsage)}
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Cache Size:</Text>
                  <Text className="font-medium">
                    {formatBytes(performanceStats.cacheStats.totalSize)}
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Cache Items:</Text>
                  <Text className="font-medium">
                    {performanceStats.cacheStats.fileCount}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3 mb-4">
          <TouchableOpacity
            onPress={loadPerformanceStats}
            className="bg-blue-500 py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              📊 Load Performance Stats
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowPerformanceMonitor(true)}
            className="bg-green-500 py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              🔍 Open Performance Monitor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleManualCleanup}
            className="bg-orange-500 py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              🧹 Manual Cleanup
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOptimizeCache}
            className="bg-purple-500 py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              ⚡ Optimize Cache
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Optimized History List Demo */}
      <View className="p-4">
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            📱 Optimized History List
          </Text>
          <Text className="text-gray-600 mb-4">
            Features: Image caching, lazy loading, memory optimization
          </Text>
          
          <View className="h-96">
            <HistoryList
              onItemPress={handleHistoryItemPress}
              enableLazyLoading={true}
              pageSize={10}
            />
          </View>
        </View>
      </View>

      {/* Performance Monitor Modal */}
      {showPerformanceMonitor && (
        <View className="absolute inset-0 bg-white">
          <PerformanceMonitor
            visible={showPerformanceMonitor}
            onClose={() => setShowPerformanceMonitor(false)}
          />
        </View>
      )}

      {/* Performance Tips */}
      <View className="p-4">
        <View className="bg-blue-50 rounded-2xl p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            💡 Performance Tips
          </Text>
          
          <View className="space-y-2">
            <View className="flex-row">
              <Text className="text-blue-600 mr-2">•</Text>
              <Text className="text-gray-700 flex-1">
                Images are automatically cached as thumbnails for faster loading
              </Text>
            </View>
            
            <View className="flex-row">
              <Text className="text-blue-600 mr-2">•</Text>
              <Text className="text-gray-700 flex-1">
                Lazy loading reduces initial memory usage and improves scroll performance
              </Text>
            </View>
            
            <View className="flex-row">
              <Text className="text-blue-600 mr-2">•</Text>
              <Text className="text-gray-700 flex-1">
                Background cleanup runs automatically when the app goes to background
              </Text>
            </View>
            
            <View className="flex-row">
              <Text className="text-blue-600 mr-2">•</Text>
              <Text className="text-gray-700 flex-1">
                Memory optimization queues image processing to prevent overload
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PerformanceOptimizationExample;