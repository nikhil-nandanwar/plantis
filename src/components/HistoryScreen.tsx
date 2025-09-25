import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScanHistory {
  id: string;
  date: string;
  status: 'healthy' | 'diseased';
  confidence: number;
  imageUri: string;
}

interface HistoryScreenProps {
  onBack: () => void;
  onViewResult: (scan: ScanHistory) => void;
}

export default function HistoryScreen({ onBack, onViewResult }: HistoryScreenProps) {
  const [history, setHistory] = useState<ScanHistory[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('scanHistory');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all scan history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('scanHistory');
            setHistory([]);
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderHistoryItem = ({ item }: { item: ScanHistory }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={() => onViewResult(item)}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {item.status === 'healthy' ? '✅ Healthy' : '⚠️ Diseased'}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            {formatDate(item.date)}
          </Text>
          <Text className="text-sm text-gray-500">
            Confidence: {Math.round(item.confidence * 100)}%
          </Text>
        </View>
        <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
          <Text className="text-xl">🌿</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-green-50">
      {/* Header */}
      <View className="bg-green-600 pt-12 pb-6 px-6 rounded-b-3xl">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onBack}>
            <Text className="text-white text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Scan History</Text>
          <View className="w-6" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-6">
        {history.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-4xl mb-4">📚</Text>
            <Text className="text-xl font-semibold text-gray-600 text-center mb-2">
              No scans yet
            </Text>
            <Text className="text-gray-500 text-center">
              Your plant scan history will appear here
            </Text>
          </View>
        ) : (
          <>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                {history.length} Scan{history.length !== 1 ? 's' : ''}
              </Text>
              <TouchableOpacity
                className="bg-red-100 px-3 py-1 rounded-full"
                onPress={clearHistory}
              >
                <Text className="text-red-600 text-sm font-medium">Clear All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={history}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>
    </View>
  );
}