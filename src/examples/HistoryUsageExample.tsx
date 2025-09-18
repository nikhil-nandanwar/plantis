import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { HistoryList, HistoryItemDetail } from '../components/history';
import { useHistory } from '../hooks/useHistory';
import { ScanResult } from '../types';

/**
 * Example component demonstrating how to use the history management system
 */
export const HistoryUsageExample: React.FC = () => {
  const [selectedScanResult, setSelectedScanResult] = useState<ScanResult | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'healthy' | 'diseased'>('all');
  
  const {
    scanResults,
    isLoading,
    error,
    historyCount,
    refreshHistory,
    addScanResult,
    deleteScanResult,
    clearAllHistory,
    performCleanup,
  } = useHistory();

  const handleItemPress = (scanResult: ScanResult) => {
    setSelectedScanResult(scanResult);
  };

  const handleCloseDetail = () => {
    setSelectedScanResult(null);
  };

  const handleDeleteFromDetail = () => {
    setSelectedScanResult(null);
    refreshHistory(); // Refresh the list after deletion
  };

  const handleAddTestScanResult = async () => {
    const testScanResult: ScanResult = {
      id: 'test-' + Date.now(),
      imageUri: 'file://test-image.jpg',
      status: Math.random() > 0.5 ? 'healthy' : 'diseased',
      confidence: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
      timestamp: new Date(),
      tips: ['This is a test scan result'],
      plantType: 'Test Plant',
    };

    try {
      await addScanResult(testScanResult);
      Alert.alert('Success', 'Test scan result added!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add test scan result');
    }
  };

  const handleClearAllHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all scan history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllHistory();
              Alert.alert('Success', 'All history cleared!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const handlePerformCleanup = async () => {
    try {
      const result = await performCleanup();
      Alert.alert(
        'Cleanup Complete',
        `Removed ${result.removedCount} old entries. Storage size: ${Math.round(result.totalSize / 1024)}KB`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to perform cleanup');
    }
  };

  // Show detail view if a scan result is selected
  if (selectedScanResult) {
    return (
      <HistoryItemDetail
        scanResult={selectedScanResult}
        onClose={handleCloseDetail}
        onDelete={handleDeleteFromDetail}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with controls */}
      <View className="bg-white p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Plant Scan History ({historyCount})
        </Text>
        
        {/* Filter buttons */}
        <View className="flex-row space-x-2 mb-4">
          <TouchableOpacity
            className={`px-4 py-2 rounded-xl ${
              filterStatus === 'all' ? 'bg-primary-green' : 'bg-gray-200'
            }`}
            onPress={() => setFilterStatus('all')}
          >
            <Text className={`font-medium ${
              filterStatus === 'all' ? 'text-white' : 'text-gray-700'
            }`}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`px-4 py-2 rounded-xl ${
              filterStatus === 'healthy' ? 'bg-primary-green' : 'bg-gray-200'
            }`}
            onPress={() => setFilterStatus('healthy')}
          >
            <Text className={`font-medium ${
              filterStatus === 'healthy' ? 'text-white' : 'text-gray-700'
            }`}>
              🌱 Healthy
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`px-4 py-2 rounded-xl ${
              filterStatus === 'diseased' ? 'bg-primary-green' : 'bg-gray-200'
            }`}
            onPress={() => setFilterStatus('diseased')}
          >
            <Text className={`font-medium ${
              filterStatus === 'diseased' ? 'text-white' : 'text-gray-700'
            }`}>
              🚨 Diseased
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action buttons */}
        <View className="flex-row space-x-2">
          <TouchableOpacity
            className="flex-1 bg-blue-500 py-3 rounded-xl"
            onPress={handleAddTestScanResult}
          >
            <Text className="text-white text-center font-semibold">
              Add Test Result
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-orange-500 py-3 rounded-xl"
            onPress={handlePerformCleanup}
          >
            <Text className="text-white text-center font-semibold">
              Cleanup
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-red-500 py-3 rounded-xl"
            onPress={handleClearAllHistory}
          >
            <Text className="text-white text-center font-semibold">
              Clear All
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* History List */}
      <HistoryList
        onItemPress={handleItemPress}
        filterStatus={filterStatus}
        refreshTrigger={historyCount} // Trigger refresh when count changes
      />

      {/* Status information */}
      {error && (
        <View className="bg-red-100 p-4 m-4 rounded-xl">
          <Text className="text-red-800 font-medium">Error: {error}</Text>
        </View>
      )}
      
      {isLoading && (
        <View className="bg-blue-100 p-4 m-4 rounded-xl">
          <Text className="text-blue-800 font-medium">Loading history...</Text>
        </View>
      )}
    </View>
  );
};

/**
 * Example of integrating history with scan workflow
 */
export const ScanWithHistoryExample: React.FC = () => {
  const { addScanResult } = useHistory();

  const handleScanComplete = async (scanResult: ScanResult) => {
    try {
      // Save the scan result to history
      await addScanResult(scanResult);
      console.log('Scan result saved to history:', scanResult.id);
      
      // Navigate to results screen or show success message
      Alert.alert('Success', 'Plant scanned and saved to history!');
    } catch (error) {
      console.error('Failed to save scan result:', error);
      Alert.alert('Warning', 'Scan completed but failed to save to history');
    }
  };

  const simulateScan = () => {
    const mockScanResult: ScanResult = {
      id: 'scan-' + Date.now(),
      imageUri: 'file://scanned-image.jpg',
      status: Math.random() > 0.5 ? 'healthy' : 'diseased',
      confidence: Math.random() * 0.3 + 0.7,
      timestamp: new Date(),
      tips: ['Simulated scan result'],
    };

    handleScanComplete(mockScanResult);
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-8">
        Scan Integration Example
      </Text>
      
      <TouchableOpacity
        className="bg-primary-green px-8 py-4 rounded-xl"
        onPress={simulateScan}
      >
        <Text className="text-white text-lg font-semibold">
          Simulate Plant Scan
        </Text>
      </TouchableOpacity>
      
      <Text className="text-gray-600 text-center mt-4 px-8">
        This demonstrates how to integrate the history system with the scanning workflow.
        Each completed scan is automatically saved to history.
      </Text>
    </View>
  );
};