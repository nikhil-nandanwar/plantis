import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useScanHistory } from '../hooks/useScanHistory';
import PageHeader from '../components/ui/PageHeader';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function History() {
  const router = useRouter();
  const { history, isLoading, clearHistory } = useScanHistory();

  const handleViewResult = (scan: any) => {
    router.push({
      pathname: '/output',
      params: { imageUri: scan.imageUri }
    });
  };

  const renderHistoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={() => handleViewResult(item)}
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
      <PageHeader 
        title="Scan History"
        showBack
      />

      <View className="flex-1 px-6 pt-6">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-600">Loading history...</Text>
          </View>
        ) : history.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-4xl mb-4">📚</Text>
            <Text className="text-xl font-semibold text-gray-600 text-center mb-2">
              No scans yet
            </Text>
            <Text className="text-gray-500 text-center mb-8">
              Your plant scan history will appear here
            </Text>
            <TouchableOpacity
              className="bg-green-600 px-8 py-4 rounded-full"
              onPress={() => router.push('/input')}
            >
              <Text className="text-white text-lg font-semibold">Start Scanning</Text>
            </TouchableOpacity>
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
