import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import PageHeader from '../components/ui/PageHeader';
import FeatureCard from '../components/ui/FeatureCard';
import StepItem from '../components/ui/StepItem';

const features = [
  {
    icon: '📷',
    title: 'Smart Image Analysis',
    description: 'Simply take a photo of any plant leaf or upload from your gallery. Our AI instantly analyzes the image.'
  },
  {
    icon: '🤖',
    title: 'AI-Powered Detection',
    description: 'Advanced machine learning algorithms detect diseases, nutrient deficiencies, and overall plant health.'
  },
  {
    icon: '💚',
    title: 'Expert Recommendations',
    description: 'Get personalized care tips, treatment suggestions, and preventive measures for your plants.'
  },
  {
    icon: '📚',
    title: 'Scan History',
    description: 'Keep track of all your plant scans and monitor their health progress over time.'
  }
];

const steps = [
  'Capture or upload a clear photo of a plant leaf',
  'Our AI analyzes the image for health indicators',
  'Receive instant results with care recommendations'
];

export default function Introduction() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-green-50">
      <PageHeader 
        icon="🌱"
        title="Welcome to Plantis"
        subtitle="Your AI Plant Health Companion"
        showBack
      />

      <View className="px-6 pt-8">
        <Text className="text-2xl font-semibold text-green-800 text-center mb-4">
          Discover Plant Health with AI
        </Text>
        <Text className="text-base text-gray-600 text-center mb-8 leading-6">
          Plantis uses advanced artificial intelligence to analyze your plant leaves and provide 
          instant health assessments. Whether you're a gardening enthusiast or a professional botanist, 
          our app helps you keep your plants thriving.
        </Text>

        {/* Features Section */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-green-800 mb-6 text-center">
            What You Can Do
          </Text>
          <View className="space-y-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-green-800 mb-6 text-center">
            How It Works
          </Text>
          <View className="space-y-4">
            {steps.map((step, index) => (
              <StepItem key={index} number={index + 1} description={step} />
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-4 mb-8">
          <TouchableOpacity
            className="bg-green-600 px-8 py-4 rounded-full"
            onPress={() => router.push('/input')}
          >
            <Text className="text-white text-lg font-semibold text-center">Start Scanning Plants</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-100 px-8 py-4 rounded-full border border-green-200"
            onPress={() => router.push('/')}
          >
            <Text className="text-green-700 text-lg font-semibold text-center">Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}