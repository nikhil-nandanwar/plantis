import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LoadingSpinner } from './LoadingSpinner';
import { HapticService } from '../services/hapticService';

/**
 * Demo component to showcase enhanced loading states and haptic feedback
 */
export const LoadingStatesDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('Preparing to analyze...');

  const encouragingMessages = [
    "Our AI is carefully examining your plant for the best care recommendations...",
    "Analyzing leaf patterns, colors, and health indicators with precision...",
    "Your plant care journey is important to us - we're being thorough! 🌱",
    "Almost there! Preparing personalized plant care tips just for you...",
    "Great job taking care of your plants! Results coming up...",
    "Every plant deserves the best care - we're making sure you get expert advice! 🌿"
  ];

  const simulateLoading = () => {
    setIsLoading(true);
    setProgress(0);
    HapticService.scanStart();

    const messages = [
      'Preparing to analyze your plant...',
      'Validating image quality...',
      'Uploading to our AI system...',
      'Analyzing plant health patterns...',
      'Identifying potential issues...',
      'Generating care recommendations...',
      'Finalizing results...',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const newProgress = currentStep / messages.length;
      setProgress(newProgress);
      setCurrentMessage(messages[currentStep - 1] || 'Complete!');

      // Haptic feedback at milestones
      if (newProgress === 0.5 || newProgress === 0.8) {
        HapticService.progressMilestone();
      }

      if (currentStep >= messages.length) {
        clearInterval(interval);
        setTimeout(() => {
          HapticService.scanComplete();
          setIsLoading(false);
          setProgress(0);
        }, 500);
      }
    }, 1000);
  };

  const testHapticFeedback = (type: string) => {
    switch (type) {
      case 'light':
        HapticService.light();
        break;
      case 'medium':
        HapticService.medium();
        break;
      case 'heavy':
        HapticService.heavy();
        break;
      case 'success':
        HapticService.success();
        break;
      case 'warning':
        HapticService.warning();
        break;
      case 'error':
        HapticService.error();
        break;
      case 'selection':
        HapticService.selection();
        break;
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        message={currentMessage}
        progress={progress}
        showProgress={true}
        encouragingMessages={encouragingMessages}
        showProcessingSteps={true}
      />
    );
  }

  return (
    <View className="flex-1 bg-background p-6">
      <Text className="text-2xl font-bold text-center mb-8">
        Loading States & Haptic Feedback Demo
      </Text>

      {/* Loading Demo */}
      <View className="mb-8">
        <Text className="text-lg font-semibold mb-4">Loading Animation Demo</Text>
        <TouchableOpacity
          onPress={simulateLoading}
          className="bg-primary-green px-6 py-4 rounded-xl mb-4"
        >
          <Text className="text-white font-semibold text-center">
            Start Loading Simulation
          </Text>
        </TouchableOpacity>
      </View>

      {/* Haptic Feedback Demo */}
      <View className="mb-8">
        <Text className="text-lg font-semibold mb-4">Haptic Feedback Demo</Text>
        <View className="space-y-2">
          {['light', 'medium', 'heavy', 'success', 'warning', 'error', 'selection'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => testHapticFeedback(type)}
              className="bg-gray-200 px-4 py-3 rounded-lg"
            >
              <Text className="text-gray-800 font-medium text-center capitalize">
                {type} Haptic
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text className="text-sm text-gray-600 text-center">
        Tap the buttons above to test different haptic feedback types.
        Note: Haptic feedback requires a physical device to experience.
      </Text>
    </View>
  );
};