import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { ScanResult } from '../../types';
import { PlantTip, DiseaseInfo } from '../../types/tips';
import { getTipsForScanResult, getDiseaseInfo } from '../../services/tipsService';
import { ExpandableTipCard } from './ExpandableTipCard';

interface DiseaseTipsDisplayProps {
  scanResult: ScanResult;
  diseaseType?: string;
}

export const DiseaseTipsDisplay: React.FC<DiseaseTipsDisplayProps> = ({
  scanResult,
  diseaseType,
}) => {
  const isHealthy = scanResult.status === 'healthy';
  const tips = getTipsForScanResult(scanResult.status, scanResult.confidence);
  const diseaseInfo = getDiseaseInfo(diseaseType);

  const getHeaderMessage = () => {
    if (isHealthy) {
      return {
        title: "Keep Up the Great Work! 🌱",
        subtitle: "Your plant looks healthy. Here are some tips to maintain its health:",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800"
      };
    } else {
      return {
        title: "Your Plant Needs Attention 🚨",
        subtitle: "Don't worry! Here's how to help your plant recover:",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-800"
      };
    }
  };

  const headerInfo = getHeaderMessage();

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Header Message */}
      <View className={`${headerInfo.bgColor} ${headerInfo.borderColor} border rounded-2xl p-6 mb-6`}>
        <Text className={`text-xl font-bold ${headerInfo.textColor} mb-2`}>
          {headerInfo.title}
        </Text>
        <Text className={`${headerInfo.textColor} leading-6`}>
          {headerInfo.subtitle}
        </Text>
        
        {/* Confidence Level */}
        <View className="mt-4 pt-4 border-t border-current/20">
          <Text className={`text-sm ${headerInfo.textColor}/80`}>
            Detection Confidence: <Text className="font-semibold">{Math.round(scanResult.confidence * 100)}%</Text>
          </Text>
        </View>
      </View>

      {/* Disease-Specific Information */}
      {diseaseInfo && !isHealthy && (
        <View className="mb-6">
          <Text className="text-xl font-bold text-text-primary mb-4">
            About {diseaseInfo.diseaseType}
          </Text>
          
          {/* Symptoms */}
          <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <Text className="text-lg font-semibold text-red-800 mb-2">
              🔍 Common Symptoms:
            </Text>
            {diseaseInfo.symptoms.map((symptom, index) => (
              <View key={index} className="flex-row items-center mb-1">
                <Text className="text-red-600 mr-2">•</Text>
                <Text className="text-red-700 flex-1">{symptom}</Text>
              </View>
            ))}
          </View>

          {/* Causes */}
          <View className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4">
            <Text className="text-lg font-semibold text-yellow-800 mb-2">
              ⚠️ Common Causes:
            </Text>
            {diseaseInfo.causes.map((cause, index) => (
              <View key={index} className="flex-row items-center mb-1">
                <Text className="text-yellow-600 mr-2">•</Text>
                <Text className="text-yellow-700 flex-1">{cause}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Recommended Tips */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-text-primary mb-4">
          {isHealthy ? "Maintenance Tips" : "Treatment Plan"}
        </Text>
        
        {tips.map((tip, index) => (
          <ExpandableTipCard
            key={tip.id}
            tip={tip}
            initiallyExpanded={index === 0 && !isHealthy} // Expand first treatment tip for diseased plants
          />
        ))}
      </View>

      {/* Disease-Specific Treatment Tips */}
      {diseaseInfo && !isHealthy && diseaseInfo.treatment.length > 0 && (
        <View className="mb-6">
          <Text className="text-xl font-bold text-text-primary mb-4">
            🏥 Specific Treatment
          </Text>
          
          {diseaseInfo.treatment.map((tip, index) => (
            <ExpandableTipCard
              key={`treatment-${tip.id}`}
              tip={tip}
              initiallyExpanded={index === 0}
            />
          ))}
        </View>
      )}

      {/* Prevention Tips */}
      {diseaseInfo && diseaseInfo.prevention.length > 0 && (
        <View className="mb-6">
          <Text className="text-xl font-bold text-text-primary mb-4">
            🛡️ Prevention for Future
          </Text>
          
          {diseaseInfo.prevention.map((tip) => (
            <ExpandableTipCard
              key={`prevention-${tip.id}`}
              tip={tip}
            />
          ))}
        </View>
      )}

      {/* Additional Encouragement */}
      <View className="bg-primary-green/5 border border-primary-green/20 rounded-2xl p-6 mb-8">
        <Text className="text-lg font-semibold text-primary-green mb-2">
          🌟 Remember
        </Text>
        <Text className="text-text-secondary leading-6">
          {isHealthy 
            ? "Regular monitoring and consistent care are key to keeping your plants healthy. Use the scan feature weekly to catch any issues early!"
            : "Plant recovery takes time and patience. Follow the treatment steps consistently, and don't hesitate to scan again in a week to monitor progress. You've got this!"
          }
        </Text>
      </View>
    </ScrollView>
  );
};