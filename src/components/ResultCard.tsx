import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { ScanResult } from '../types';
import { Typography, Card, Badge, NatureIcon, Divider, AnimatedView } from './ui';

interface ResultCardProps {
  result: ScanResult;
  showDetails?: boolean;
  onPress?: () => void;
  compact?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  showDetails = true,
  onPress,
  compact = false,
}) => {
  const isHealthy = result.status === 'healthy';
  const confidencePercentage = Math.round(result.confidence * 100);
  
  // Format timestamp
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusVariant = () => {
    return isHealthy ? 'success' : 'warning';
  };

  const getStatusIcon = () => {
    return isHealthy ? 'healthy' : 'diseased';
  };

  const getStatusMessage = () => {
    if (isHealthy) {
      return "Great news! Your plant looks healthy";
    } else {
      return "Your plant might need attention";
    }
  };

  const getConfidenceColor = () => {
    if (confidencePercentage >= 90) return 'success';
    if (confidencePercentage >= 70) return 'warning';
    return 'error';
  };

  const CardContent = () => (
    <AnimatedView animation="scaleIn">
      <Card 
        variant="elevated" 
        padding={compact ? "sm" : "md"} 
        className="shadow-soft"
      >
        <View className={`flex-row ${compact ? 'space-x-3' : 'space-x-4'}`}>
          {/* Enhanced Image Thumbnail */}
          <View className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} rounded-xl overflow-hidden border-2 border-border-light`}>
            <Image
              source={{ uri: result.imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Status Overlay */}
            <View className="absolute top-1 right-1">
              <NatureIcon 
                name={getStatusIcon()} 
                size="sm" 
                variant="contained" 
                color={getStatusVariant()}
              />
            </View>
          </View>

          {/* Result Content */}
          <View className="flex-1">
            {/* Status Badge */}
            <View className="mb-3">
              <Badge 
                variant={getStatusVariant()} 
                size={compact ? "sm" : "md"}
              >
                {result.status.charAt(0).toUpperCase() + result.status.slice(1)} Plant
              </Badge>
            </View>

            {/* Confidence Level */}
            <View className="flex-row items-center justify-between mb-2">
              <Typography 
                variant={compact ? "caption" : "body2"} 
                color="secondary"
              >
                Confidence:
              </Typography>
              <Badge 
                variant={getConfidenceColor()} 
                size="sm"
              >
                {confidencePercentage}%
              </Badge>
            </View>

            {/* Timestamp */}
            <View className="flex-row items-center">
              <NatureIcon name="history" size="sm" variant="default" className="mr-2 opacity-60" />
              <Typography 
                variant={compact ? "caption" : "body2"} 
                color="tertiary"
              >
                {formatDate(result.timestamp)}
              </Typography>
            </View>
          </View>
        </View>

        {/* Detailed Information */}
        {showDetails && !compact && (
          <View className="mt-4">
            <Divider spacing="sm" />
            
            {/* Status Message */}
            <View className="flex-row items-center mb-4">
              <NatureIcon 
                name={getStatusIcon()} 
                size="md" 
                variant="contained" 
                color={getStatusVariant()} 
                className="mr-3" 
              />
              <Typography variant="body1" weight="medium" className="flex-1">
                {getStatusMessage()}
              </Typography>
            </View>

            {/* Tips Preview */}
            {result.tips && result.tips.length > 0 && (
              <View className="mb-4">
                <View className="flex-row items-center mb-3">
                  <NatureIcon name="tips" size="sm" variant="contained" color="warning" className="mr-2" />
                  <Typography variant="body2" weight="semibold">
                    Quick Tips:
                  </Typography>
                </View>
                
                <View className="space-y-2">
                  {result.tips.slice(0, 2).map((tip, index) => (
                    <View key={index} className="flex-row items-start">
                      <View className="w-1.5 h-1.5 bg-primary-green rounded-full mt-2 mr-3" />
                      <Typography variant="body2" color="secondary" className="flex-1">
                        {tip}
                      </Typography>
                    </View>
                  ))}
                </View>
                
                {result.tips.length > 2 && (
                  <View className="mt-2">
                    <Badge variant="primary" size="sm">
                      +{result.tips.length - 2} more tips available
                    </Badge>
                  </View>
                )}
              </View>
            )}

            {/* Plant Type */}
            {result.plantType && (
              <View className="mt-3 pt-3 border-t border-border-light">
                <View className="flex-row items-center">
                  <NatureIcon name="leaf" size="sm" variant="contained" color="primary" className="mr-2" />
                  <Typography variant="body2" color="secondary">
                    Plant Type: 
                  </Typography>
                  <Typography variant="body2" weight="medium" className="ml-1">
                    {result.plantType}
                  </Typography>
                </View>
              </View>
            )}

            {/* Action Hint */}
            {onPress && (
              <View className="mt-3 pt-3 border-t border-border-light">
                <View className="flex-row items-center justify-center">
                  <Typography variant="caption" color="tertiary">
                    Tap for detailed analysis
                  </Typography>
                  <Typography variant="caption" color="tertiary" className="ml-1">
                    →
                  </Typography>
                </View>
              </View>
            )}
          </View>
        )}
      </Card>
    </AnimatedView>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};