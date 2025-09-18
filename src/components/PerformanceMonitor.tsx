import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { performanceManager, formatBytes, formatDuration } from '../utils/performanceUtils';
import { imageCacheManager } from '../utils/imageCacheUtils';
import { memoryManager } from '../utils/memoryUtils';

interface PerformanceMonitorProps {
  visible?: boolean;
  onClose?: () => void;
}

interface PerformanceData {
  metrics: any;
  cacheStats: any;
  memoryStats: any;
  recommendations: string[];
  lastUpdated: Date;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  visible = false,
  onClose,
}) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPerformingCleanup, setIsPerformingCleanup] = useState(false);

  const loadPerformanceData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [report, cacheStats, memoryStats] = await Promise.all([
        performanceManager.getPerformanceReport(),
        imageCacheManager.getCacheStats(),
        memoryManager.getMemoryStats(),
      ]);

      setPerformanceData({
        metrics: report.metrics,
        cacheStats: report.cacheStats,
        memoryStats,
        recommendations: report.recommendations,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Failed to load performance data:', error);
      Alert.alert('Error', 'Failed to load performance data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      loadPerformanceData();
    }
  }, [visible, loadPerformanceData]);

  const handleCleanup = useCallback(async () => {
    setIsPerformingCleanup(true);
    try {
      await Promise.all([
        performanceManager.performBackgroundCleanup(),
        imageCacheManager.clearExpiredCache(),
        memoryManager.performMemoryCleanup(),
      ]);

      Alert.alert('Success', 'Performance cleanup completed successfully');
      await loadPerformanceData();
    } catch (error) {
      console.error('Cleanup failed:', error);
      Alert.alert('Error', 'Performance cleanup failed');
    } finally {
      setIsPerformingCleanup(false);
    }
  }, [loadPerformanceData]);

  const handleClearCache = useCallback(async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached images and may affect performance temporarily. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await imageCacheManager.clearAllCache();
              Alert.alert('Success', 'Cache cleared successfully');
              await loadPerformanceData();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  }, [loadPerformanceData]);

  const handleOptimizeCache = useCallback(async () => {
    try {
      const removedCount = await imageCacheManager.optimizeCache();
      Alert.alert(
        'Cache Optimized',
        `Removed ${removedCount} old cache entries to improve performance`
      );
      await loadPerformanceData();
    } catch (error) {
      Alert.alert('Error', 'Failed to optimize cache');
    }
  }, [loadPerformanceData]);

  if (!visible) {
    return null;
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-900">Performance Monitor</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} className="p-2">
            <Text className="text-lg text-gray-600">✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="text-gray-600 mt-4">Loading performance data...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          {performanceData && (
            <>
              {/* Memory Usage */}
              <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                <Text className="text-lg font-semibold text-gray-900 mb-3">
                  📊 Memory Usage
                </Text>
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Estimated Usage:</Text>
                    <Text className="font-medium">
                      {formatBytes(performanceData.memoryStats.estimatedUsage)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Cache Size:</Text>
                    <Text className="font-medium">
                      {formatBytes(performanceData.memoryStats.cacheSize)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Temp Files:</Text>
                    <Text className="font-medium">
                      {formatBytes(performanceData.memoryStats.tempFileSize)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Cache Statistics */}
              <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                <Text className="text-lg font-semibold text-gray-900 mb-3">
                  🗂️ Cache Statistics
                </Text>
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Total Size:</Text>
                    <Text className="font-medium">
                      {formatBytes(performanceData.cacheStats.totalSize)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">File Count:</Text>
                    <Text className="font-medium">
                      {performanceData.cacheStats.itemCount}
                    </Text>
                  </View>
                  {performanceData.cacheStats.oldestItem && (
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Oldest Item:</Text>
                      <Text className="font-medium text-sm">
                        {formatDuration(
                          Date.now() - performanceData.cacheStats.oldestItem.getTime()
                        )} ago
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* App Statistics */}
              <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                <Text className="text-lg font-semibold text-gray-900 mb-3">
                  📱 App Statistics
                </Text>
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">History Count:</Text>
                    <Text className="font-medium">
                      {performanceData.metrics.historyCount}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Last Cleanup:</Text>
                    <Text className="font-medium text-sm">
                      {formatDuration(
                        Date.now() - performanceData.metrics.lastCleanup.getTime()
                      )} ago
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">App Uptime:</Text>
                    <Text className="font-medium text-sm">
                      {formatDuration(
                        Date.now() - performanceData.metrics.appStartTime.getTime()
                      )}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Recommendations */}
              {performanceData.recommendations.length > 0 && (
                <View className="bg-yellow-50 rounded-2xl p-4 mb-4">
                  <Text className="text-lg font-semibold text-gray-900 mb-3">
                    💡 Recommendations
                  </Text>
                  {performanceData.recommendations.map((recommendation, index) => (
                    <View key={index} className="flex-row mb-2">
                      <Text className="text-yellow-600 mr-2">•</Text>
                      <Text className="text-gray-700 flex-1">
                        {recommendation}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Action Buttons */}
              <View className="space-y-3 mb-6">
                <TouchableOpacity
                  onPress={loadPerformanceData}
                  className="bg-blue-500 py-3 rounded-xl"
                  disabled={isLoading}
                >
                  <Text className="text-white text-center font-semibold">
                    🔄 Refresh Data
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCleanup}
                  className="bg-green-500 py-3 rounded-xl"
                  disabled={isPerformingCleanup}
                >
                  <Text className="text-white text-center font-semibold">
                    {isPerformingCleanup ? '⏳ Cleaning...' : '🧹 Perform Cleanup'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleOptimizeCache}
                  className="bg-orange-500 py-3 rounded-xl"
                >
                  <Text className="text-white text-center font-semibold">
                    ⚡ Optimize Cache
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleClearCache}
                  className="bg-red-500 py-3 rounded-xl"
                >
                  <Text className="text-white text-center font-semibold">
                    🗑️ Clear All Cache
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Last Updated */}
              <View className="items-center pb-4">
                <Text className="text-gray-500 text-sm">
                  Last updated: {performanceData.lastUpdated.toLocaleTimeString()}
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default PerformanceMonitor;