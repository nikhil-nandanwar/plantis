import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePlantAnalysis } from '../hooks/usePlantAnalysis';
import PageHeader from '../components/ui/PageHeader';

export default function Output() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const { result, isAnalyzing, analyzeImage } = usePlantAnalysis();

  useEffect(() => {
    if (imageUri) {
      analyzeImage(imageUri);
    }
  }, [imageUri]);

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

        {/* Analysis Loading */}
        {isAnalyzing && (
          <View className="bg-white rounded-2xl p-8 mb-6 shadow-sm items-center">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-lg font-semibold text-gray-800 mt-4">Analyzing your plant...</Text>
            <Text className="text-gray-600 text-center mt-2">
              Our AI is examining the leaf for health indicators
            </Text>
            <View className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <View className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
            </View>
          </View>
        )}

        {/* Results Display */}
        {result && !isAnalyzing && (
          <>
            {/* Status Card */}
            <View className={`rounded-2xl p-6 mb-6 shadow-sm border-2 ${
              result.status === 'healthy' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <View className="items-center mb-4">
                <Text className="text-4xl mb-2">{result.status === 'healthy' ? '✅' : '⚠️'}</Text>
                <Text className={`text-2xl font-bold ${
                  result.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {result.status === 'healthy' ? 'Healthy Plant' : 'Issue Detected'}
                </Text>
                <Text className="text-lg text-gray-600 mt-1">
                  Confidence: {Math.round(result.confidence * 100)}%
                </Text>
              </View>

              {result.disease && (
                <View className="bg-white rounded-xl p-4 mt-4">
                  <Text className="text-lg font-semibold text-red-700 mb-2">🦠 Detected Issue:</Text>
                  <Text className="text-gray-800 text-base">{result.disease}</Text>
                </View>
              )}
            </View>

            {/* Recommendations */}
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <Text className="text-xl font-semibold text-gray-800 mb-4 text-center">
                💡 Recommendations
              </Text>
              <View className="space-y-3">
                {result.recommendations?.map((recommendation, index) => (
                  <View key={index} className="flex-row items-start">
                    <View className="bg-green-100 rounded-full w-6 h-6 items-center justify-center mr-3 mt-1">
                      <Text className="text-green-600 text-sm font-bold">{index + 1}</Text>
                    </View>
                    <Text className="text-gray-700 flex-1 leading-5">{recommendation}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Additional Info */}
            {result.status === 'diseased' && (
              <View className="bg-amber-50 rounded-2xl p-6 mb-6 shadow-sm border border-amber-200">
                <Text className="text-lg font-semibold text-amber-800 mb-3 text-center">
                  ⚠️ Important Notice
                </Text>
                <Text className="text-amber-700 text-center leading-5">
                  Early detection and treatment are key to plant recovery. 
                  Consider consulting with a local gardening expert for severe cases.
                </Text>
              </View>
            )}

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

              <TouchableOpacity
                className="bg-gray-100 px-8 py-4 rounded-full border border-gray-200"
                onPress={() => router.push('/history')}
              >
                <Text className="text-gray-700 text-lg font-semibold text-center">View History</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}