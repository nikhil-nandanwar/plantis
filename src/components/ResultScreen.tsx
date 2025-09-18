import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { ScanResult, ErrorState } from '../types';
import { HapticService } from '../services/hapticService';
import { ResultCard } from './ResultCard';
import { DiseaseTipsDisplay } from './tips';

interface ResultScreenProps {
  result?: ScanResult;
  error?: ErrorState;
  onRetry?: () => void;
  onNewScan?: () => void;
  onViewHistory?: () => void;
  diseaseType?: string;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  error,
  onRetry,
  onNewScan,
  onViewHistory,
  diseaseType,
}) => {
  const [showDetailedTips, setShowDetailedTips] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Animate screen entrance
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();

    // Provide haptic feedback based on result type
    if (result) {
      if (result.status === 'healthy') {
        HapticService.success();
      } else {
        HapticService.warning();
      }
    } else if (error) {
      HapticService.error();
    }
  }, [result, error, fadeAnim, slideAnim, scaleAnim]);

  const handleButtonPress = (action: () => void, hapticType: 'light' | 'medium' | 'success' = 'light') => {
    switch (hapticType) {
      case 'light':
        HapticService.light();
        break;
      case 'medium':
        HapticService.medium();
        break;
      case 'success':
        HapticService.success();
        break;
    }
    action();
  };
  // Error Screen
  if (error?.hasError) {
    return (
      <Animated.View 
        className="flex-1 bg-background"
        style={{
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
          <View className="flex-1 justify-center items-center">
            {/* Error Icon */}
            <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
              <Text className="text-4xl">❌</Text>
            </View>

            {/* Error Title */}
            <Text className="text-2xl font-bold text-text-primary mb-4 text-center">
              Analysis Failed
            </Text>

            {/* Error Message */}
            <Text className="text-base text-text-secondary text-center mb-8 max-w-sm">
              {error.message || 'Something went wrong while analyzing your plant. Please try again.'}
            </Text>

            {/* Action Buttons */}
            <View className="w-full max-w-sm space-y-4">
              {error.retryable && onRetry && (
                <TouchableOpacity
                  onPress={() => handleButtonPress(onRetry, 'medium')}
                  className="bg-primary-green px-6 py-4 rounded-xl"
                >
                  <Text className="text-white font-semibold text-base text-center">
                    Try Again
                  </Text>
                </TouchableOpacity>
              )}

              {onNewScan && (
                <TouchableOpacity
                  onPress={() => handleButtonPress(onNewScan, 'light')}
                  className="bg-white border-2 border-primary-green px-6 py-4 rounded-xl"
                >
                  <Text className="text-primary-green font-semibold text-base text-center">
                    New Scan
                  </Text>
                </TouchableOpacity>
              )}

              {onViewHistory && (
                <TouchableOpacity
                  onPress={() => handleButtonPress(onViewHistory, 'light')}
                  className="bg-gray-100 px-6 py-4 rounded-xl"
                >
                  <Text className="text-text-primary font-semibold text-base text-center">
                    View History
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Help Text */}
            <Text className="text-sm text-text-secondary text-center mt-8 max-w-sm">
              If the problem persists, please check your internet connection or try again later.
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    );
  }

  // Success Screen
  if (result) {
    const isHealthy = result.status === 'healthy';
    
    // Show detailed tips view
    if (showDetailedTips) {
      return (
        <View className="flex-1 bg-background">
          <View className="px-6 py-4 bg-white border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => handleButtonPress(() => setShowDetailedTips(false), 'light')}
                className="flex-row items-center"
              >
                <Text className="text-2xl mr-2">←</Text>
                <Text className="text-lg font-semibold text-text-primary">
                  Back to Results
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View className="flex-1 px-6 py-4">
            <DiseaseTipsDisplay 
              scanResult={result}
              diseaseType={diseaseType}
            />
          </View>
        </View>
      );
    }
    
    return (
      <Animated.View 
        className="flex-1 bg-background"
        style={{
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
          <View className="flex-1 justify-center">
            {/* Success Icon */}
            <View className="items-center mb-6">
              <View className={`w-24 h-24 ${isHealthy ? 'bg-green-100' : 'bg-orange-100'} rounded-full items-center justify-center mb-4`}>
                <Text className="text-4xl">
                  {isHealthy ? '✅' : '⚠️'}
                </Text>
              </View>
              
              <Text className="text-2xl font-bold text-text-primary text-center">
                Analysis Complete!
              </Text>
            </View>

            {/* Result Card */}
            <View className="mb-8">
              <ResultCard 
                result={result} 
                showDetails={true}
              />
            </View>

            {/* Detailed Tips Button */}
            <TouchableOpacity
              onPress={() => handleButtonPress(() => setShowDetailedTips(true), 'light')}
              className="bg-blue-600 px-6 py-4 rounded-xl mb-4"
            >
              <Text className="text-white font-semibold text-base text-center">
                {isHealthy ? '📚 View Care Guide' : '🏥 View Treatment Plan'}
              </Text>
            </TouchableOpacity>

            {/* Action Buttons */}
            <View className="space-y-4">
              {onNewScan && (
                <TouchableOpacity
                  onPress={() => handleButtonPress(onNewScan, 'success')}
                  className="bg-primary-green px-6 py-4 rounded-xl"
                >
                  <Text className="text-white font-semibold text-base text-center">
                    Scan Another Plant
                  </Text>
                </TouchableOpacity>
              )}

              {onViewHistory && (
                <TouchableOpacity
                  onPress={() => handleButtonPress(onViewHistory, 'light')}
                  className="bg-white border-2 border-primary-green px-6 py-4 rounded-xl"
                >
                  <Text className="text-primary-green font-semibold text-base text-center">
                    View All Scans
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Quick Tips Preview */}
            {!isHealthy && result.tips && result.tips.length > 0 && (
              <View className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <Text className="text-base font-semibold text-orange-800 mb-2">
                  🚨 Immediate Action Needed:
                </Text>
                <Text className="text-sm text-orange-700 mb-3">
                  {result.tips[0]}
                </Text>
                <TouchableOpacity
                  onPress={() => handleButtonPress(() => setShowDetailedTips(true), 'medium')}
                  className="bg-orange-600 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium text-sm text-center">
                    View Full Treatment Plan
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Healthy Plant Encouragement */}
            {isHealthy && (
              <View className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                <Text className="text-base font-semibold text-green-800 mb-2">
                  🎉 Keep up the great work!
                </Text>
                <Text className="text-sm text-green-700 mb-3">
                  Your plant is thriving! Continue your current care routine to maintain its health.
                </Text>
                <TouchableOpacity
                  onPress={() => handleButtonPress(() => setShowDetailedTips(true), 'light')}
                  className="bg-green-600 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium text-sm text-center">
                    View Maintenance Tips
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    );
  }

  // Fallback - should not reach here
  return (
    <View className="flex-1 bg-background justify-center items-center px-6">
      <Text className="text-base text-text-secondary text-center">
        No results to display
      </Text>
    </View>
  );
};