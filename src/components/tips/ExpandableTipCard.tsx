import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { PlantTip } from '../../types/tips';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ExpandableTipCardProps {
  tip: PlantTip;
  initiallyExpanded?: boolean;
}

export const ExpandableTipCard: React.FC<ExpandableTipCardProps> = ({
  tip,
  initiallyExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [rotateAnim] = useState(new Animated.Value(initiallyExpanded ? 1 : 0));

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
    
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const getSeverityColor = () => {
    switch (tip.severity) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-primary-green bg-primary-green/10 border-primary-green/20';
    }
  };

  const getCategoryColor = () => {
    switch (tip.category) {
      case 'treatment':
        return 'text-blue-600 bg-blue-50';
      case 'prevention':
        return 'text-green-600 bg-green-50';
      case 'disease':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
      <TouchableOpacity
        onPress={toggleExpanded}
        activeOpacity={0.7}
        className="p-6"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            {/* Icon */}
            <View className="bg-primary-green/10 rounded-full w-12 h-12 justify-center items-center mr-4">
              <Text className="text-2xl">{tip.icon}</Text>
            </View>
            
            {/* Title and Category */}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-text-primary mb-1">
                {tip.title}
              </Text>
              <View className="flex-row items-center space-x-2">
                <View className={`px-2 py-1 rounded-full ${getCategoryColor()}`}>
                  <Text className="text-xs font-medium capitalize">
                    {tip.category}
                  </Text>
                </View>
                {tip.severity && (
                  <View className={`px-2 py-1 rounded-full border ${getSeverityColor()}`}>
                    <Text className="text-xs font-medium capitalize">
                      {tip.severity} priority
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Expand/Collapse Arrow */}
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <Text className="text-2xl text-gray-400">⌄</Text>
          </Animated.View>
        </View>

        {/* Basic Description */}
        <Text className="text-text-secondary mt-4 leading-6">
          {tip.description}
        </Text>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View className="px-6 pb-6">
          <View className="border-t border-gray-100 pt-4">
            {/* Expanded Description */}
            {tip.expandedContent && (
              <View className="mb-4">
                <Text className="text-text-primary leading-6">
                  {tip.expandedContent}
                </Text>
              </View>
            )}

            {/* Steps */}
            {tip.steps && tip.steps.length > 0 && (
              <View className="mb-4">
                <Text className="text-base font-semibold text-text-primary mb-3">
                  Step-by-Step Guide:
                </Text>
                {tip.steps.map((step, index) => (
                  <View key={index} className="flex-row items-start mb-2">
                    <View className="bg-primary-green rounded-full w-6 h-6 justify-center items-center mr-3 mt-0.5">
                      <Text className="text-white text-xs font-bold">
                        {index + 1}
                      </Text>
                    </View>
                    <Text className="text-text-secondary flex-1 leading-6">
                      {step}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Related Tips */}
            {tip.relatedTips && tip.relatedTips.length > 0 && (
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-sm font-semibold text-text-primary mb-2">
                  💡 Related Tips:
                </Text>
                <View className="flex-row flex-wrap">
                  {tip.relatedTips.map((relatedTip, index) => (
                    <View
                      key={index}
                      className="bg-white rounded-full px-3 py-1 mr-2 mb-2 border border-gray-200"
                    >
                      <Text className="text-xs text-text-secondary">
                        {relatedTip.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};