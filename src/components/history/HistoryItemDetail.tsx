import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import { ScanResult } from '../../types';
import { historyService } from '../../services/historyService';

interface HistoryItemDetailProps {
  scanResult: ScanResult;
  onClose: () => void;
  onDelete?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const HistoryItemDetail: React.FC<HistoryItemDetailProps> = ({
  scanResult,
  onClose,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDetailedDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: 'healthy' | 'diseased'): string => {
    return status === 'healthy' ? '#22c55e' : '#ef4444';
  };

  const getStatusEmoji = (status: 'healthy' | 'diseased'): string => {
    return status === 'healthy' ? '🌱' : '🚨';
  };

  const getStatusMessage = (status: 'healthy' | 'diseased', confidence: number): string => {
    const confidencePercent = Math.round(confidence * 100);
    
    if (status === 'healthy') {
      if (confidencePercent >= 90) {
        return `Great news! Your plant looks very healthy! 🌟`;
      } else if (confidencePercent >= 70) {
        return `Your plant appears to be healthy! 🌱`;
      } else {
        return `Your plant seems healthy, but keep monitoring it. 👀`;
      }
    } else {
      if (confidencePercent >= 90) {
        return `Your plant needs immediate attention! 🚨`;
      } else if (confidencePercent >= 70) {
        return `Your plant might need some care. 🔍`;
      } else {
        return `Keep an eye on your plant - there might be early signs of issues. 👁️`;
      }
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Scan Result',
      'Are you sure you want to delete this scan result? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              const success = await historyService.deleteScanResult(scanResult.id);
              if (success) {
                onDelete?.();
                onClose();
              } else {
                Alert.alert('Error', 'Failed to delete scan result');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete scan result');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      const message = `Plant Health Scan Result 🌿\n\nStatus: ${scanResult.status === 'healthy' ? 'Healthy 🌱' : 'Needs Attention 🚨'}\nConfidence: ${Math.round(scanResult.confidence * 100)}%\nScanned: ${formatDetailedDate(scanResult.timestamp)}\n\nScanned with Plantis App`;
      
      await Share.share({
        message,
        title: 'Plant Health Scan Result',
      });
    } catch (error) {
      console.error('Failed to share scan result:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
        <TouchableOpacity
          onPress={onClose}
          className="p-2 rounded-full bg-gray-100"
        >
          <Text className="text-lg">←</Text>
        </TouchableOpacity>
        
        <Text className="text-lg font-semibold text-gray-900">
          Scan Details
        </Text>
        
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={handleShare}
            className="p-2 rounded-full bg-gray-100"
          >
            <Text className="text-lg">📤</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-full bg-red-100"
          >
            <Text className="text-lg">{isDeleting ? '⏳' : '🗑️'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image */}
      <View className="p-4">
        <View className="rounded-2xl overflow-hidden bg-gray-100">
          <Image
            source={{ uri: scanResult.imageUri }}
            style={{
              width: screenWidth - 32,
              height: screenWidth - 32,
            }}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Status Section */}
      <View className="px-4 pb-4">
        <View
          className="rounded-2xl p-6 mb-4"
          style={{ backgroundColor: `${getStatusColor(scanResult.status)}10` }}
        >
          <View className="flex-row items-center justify-center mb-3">
            <Text className="text-4xl mr-3">
              {getStatusEmoji(scanResult.status)}
            </Text>
            <Text
              className="text-2xl font-bold"
              style={{ color: getStatusColor(scanResult.status) }}
            >
              {scanResult.status === 'healthy' ? 'Healthy Plant' : 'Needs Attention'}
            </Text>
          </View>
          
          <Text className="text-center text-gray-700 text-lg mb-3">
            {getStatusMessage(scanResult.status, scanResult.confidence)}
          </Text>
          
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 mr-2">Confidence:</Text>
            <Text
              className="text-xl font-bold"
              style={{ color: getStatusColor(scanResult.status) }}
            >
              {Math.round(scanResult.confidence * 100)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Details Section */}
      <View className="px-4 pb-4">
        <View className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Scan Information
          </Text>
          
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Scan Date:</Text>
              <Text className="text-gray-900 font-medium">
                {formatDetailedDate(scanResult.timestamp)}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Scan ID:</Text>
              <Text className="text-gray-900 font-mono text-sm">
                {scanResult.id.slice(0, 8)}...
              </Text>
            </View>
            
            {scanResult.plantType && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Plant Type:</Text>
                <Text className="text-gray-900 font-medium">
                  {scanResult.plantType}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Tips Section */}
      {scanResult.tips && scanResult.tips.length > 0 && (
        <View className="px-4 pb-6">
          <View className="bg-blue-50 rounded-2xl p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              💡 Care Tips
            </Text>
            
            {scanResult.tips.map((tip, index) => (
              <View key={index} className="flex-row mb-2">
                <Text className="text-blue-600 mr-2">•</Text>
                <Text className="text-gray-700 flex-1 leading-5">
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View className="px-4 pb-8">
        <TouchableOpacity
          onPress={onClose}
          className="bg-primary-green py-4 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Back to History
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};