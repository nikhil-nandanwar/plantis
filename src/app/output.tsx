import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import PageHeader from '../components/ui/PageHeader';

export default function Output() {
  const router = useRouter();
  const { imageUri, result } = useLocalSearchParams<{ imageUri?: string; result?: string }>();

  const [parsedResult, setParsedResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (result) {
      try {
        const parsed = JSON.parse(result);
        if (Object.keys(parsed).length > 0) {
          setParsedResult(parsed);
          setIsLoading(false);
        } else {
          // Empty object case
          setIsLoading(true);
        }
      } catch (e) {
        setIsLoading(true);
      }
    } else {
      setIsLoading(true);
    }
  }, [result]);

  // 🔄 Show loader if result is not available yet
  if (isLoading) {
    return (
      <View className="flex-1 bg-green-50 items-center justify-center px-6">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-lg font-semibold text-gray-800 mt-4">Analyzing your plant...</Text>
        <Text className="text-gray-600 text-center mt-2">
          Our AI is examining the leaf for health indicators
        </Text>
        <View className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <View className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
        </View>
      </View>
    );
  }

  // ✅ Once result available
  const { prediction, confidence } = parsedResult || {};
  const isHealthy = prediction?.toLowerCase().includes("healthy");

  return (
    <ScrollView className="flex-1 bg-green-50">
      <PageHeader 
        icon="🔍"
        title="Analysis Results"
        subtitle="Plant Health Report"
        showBack
      />

      <View className="px-6 pt-6">
        {/* Image Display */}
        {imageUri && (
          <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3 text-center">Analyzed Image</Text>
            <Image 
              source={{ uri: imageUri }} 
              className="w-full h-64 rounded-xl"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Result Card */}
        <View className={`rounded-2xl p-6 mb-6 shadow-sm border-2 ${
          isHealthy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <View className="items-center mb-4">
            <Text className="text-4xl mb-2">{isHealthy ? '✅' : '⚠️'}</Text>
            <Text className={`text-2xl font-bold ${
              isHealthy ? 'text-green-600' : 'text-red-600'
            }`}>
              {isHealthy ? 'Healthy Plant' : 'Issue Detected'}
            </Text>
            <Text className="text-lg text-gray-600 mt-1">
              Confidence: {(confidence * 100).toFixed(2)}%
            </Text>
          </View>

          {!isHealthy && (
            <View className="bg-white rounded-xl p-4 mt-4">
              <Text className="text-lg font-semibold text-red-700 mb-2">🦠 Detected Issue:</Text>
              <Text className="text-gray-800 text-base">{prediction}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="space-y-4 mb-8">
          <TouchableOpacity
            className="bg-green-600 px-8 py-4 rounded-full"
            onPress={() => router.push('/input')}
          >
            <Text className="text-white text-lg font-semibold text-center">Scan Another Plant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-100 px-8 py-4 rounded-full border border-blue-200"
            onPress={() => router.push('/')}
          >
            <Text className="text-blue-700 text-lg font-semibold text-center">Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
