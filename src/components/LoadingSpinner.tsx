import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  Easing,
} from 'react-native';
import { Typography, Card, NatureIcon, AnimatedView } from './ui';

interface LoadingSpinnerProps {
  message: string;
  progress?: number;
  showProgress?: boolean;
  encouragingMessages?: string[];
  showProcessingSteps?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  progress,
  showProgress = false,
  encouragingMessages = [
    "Our AI is carefully examining your plant for the best care recommendations...",
    "Analyzing leaf patterns and health indicators...",
    "Almost there! Preparing personalized plant care tips...",
    "Great job taking care of your plants! 🌱"
  ],
  showProcessingSteps = true,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const floatValue = useRef(new Animated.Value(0)).current;
  const messageOpacity = useRef(new Animated.Value(1)).current;

  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);

  useEffect(() => {
    // Rotate encouraging messages every 3 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % encouragingMessages.length);
      
      // Animate message transition
      Animated.sequence([
        Animated.timing(messageOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(messageOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    return () => clearInterval(messageInterval);
  }, [encouragingMessages.length, messageOpacity]);

  useEffect(() => {
    // Create spinning animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Create pulsing animation for the container
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Create gentle floating animation
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatValue, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Create pulse for nature icons
    const iconPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    spinAnimation.start();
    pulseAnimation.start();
    floatAnimation.start();
    iconPulse.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
      floatAnimation.stop();
      iconPulse.stop();
    };
  }, [spinValue, scaleValue, floatValue, pulseValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const float = floatValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 8],
  });

  return (
    <View className="flex-1 justify-center items-center bg-background px-6">
      {/* Floating Nature Icons Background */}
      <View className="absolute inset-0 justify-center items-center opacity-10">
        <Animated.View
          style={{
            transform: [
              { translateY: float },
              { scale: pulseValue }
            ],
          }}
          className="absolute top-1/4 left-1/4"
        >
          <NatureIcon name="leaf" size="lg" variant="default" />
        </Animated.View>
        <Animated.View
          style={{
            transform: [
              { translateY: Animated.multiply(float, -1) },
              { scale: pulseValue }
            ],
          }}
          className="absolute top-1/3 right-1/4"
        >
          <NatureIcon name="flower" size="md" variant="default" />
        </Animated.View>
        <Animated.View
          style={{
            transform: [
              { translateY: float },
              { scale: pulseValue }
            ],
          }}
          className="absolute bottom-1/3 left-1/3"
        >
          <NatureIcon name="sprout" size="md" variant="default" />
        </Animated.View>
      </View>

      {/* Main Loading Content */}
      <AnimatedView animation="scaleIn" className="items-center">
        {/* Enhanced Spinner */}
        <Card variant="elevated" padding="lg" className="mb-8 shadow-nature">
          <Animated.View
            style={{
              transform: [
                { rotate: spin }, 
                { scale: scaleValue },
                { translateY: float }
              ],
            }}
            className="w-20 h-20 items-center justify-center"
          >
            <View className="w-20 h-20 border-4 border-primary-lightest rounded-full border-t-primary-green" />
            <View className="absolute w-12 h-12 border-2 border-primary-light rounded-full border-b-primary-dark" />
            <NatureIcon 
              name="sprout" 
              size="md" 
              variant="default" 
              className="absolute"
            />
          </Animated.View>
        </Card>

        {/* Loading Message */}
        <Typography 
          variant="h3" 
          weight="semibold" 
          align="center" 
          className="mb-3"
        >
          Analyzing Your Plant
        </Typography>
        
        <View className="flex-row items-center mb-6">
          <NatureIcon name="sprout" size="sm" variant="contained" color="success" className="mr-2" />
          <Typography 
            variant="body1" 
            color="secondary" 
            align="center" 
            className="max-w-sm"
          >
            {message}
          </Typography>
        </View>

        {/* Enhanced Progress Bar */}
        {showProgress && progress !== undefined && (
          <Card variant="soft" padding="md" className="w-full max-w-sm mb-6">
            <View className="mb-3">
              <View className="w-full h-3 bg-border-light rounded-full overflow-hidden">
                <Animated.View
                  className="h-full bg-gradient-to-r from-primary-green to-sage-green rounded-full"
                  style={{
                    width: `${Math.max(0, Math.min(100, progress * 100))}%`,
                  }}
                />
              </View>
            </View>
            <View className="flex-row justify-between items-center">
              <Typography variant="caption" color="secondary">
                Progress
              </Typography>
              <Typography variant="caption" weight="semibold" color="primary">
                {Math.round(progress * 100)}%
              </Typography>
            </View>
          </Card>
        )}

        {/* Encouraging Messages */}
        <Card variant="soft" padding="md" className="max-w-sm">
          <View className="flex-row items-center">
            <NatureIcon name="tips" size="sm" variant="contained" color="warning" className="mr-3" />
            <Animated.View 
              style={{ opacity: messageOpacity }}
              className="flex-1"
            >
              <Typography 
                variant="body2" 
                color="secondary" 
                align="center" 
                className="italic"
              >
                "{encouragingMessages[currentMessageIndex]}"
              </Typography>
            </Animated.View>
          </View>
        </Card>

        {/* Processing Steps Indicator */}
        {showProcessingSteps && (
          <View className="mt-8 space-y-2">
            {/* Step 1: Image Processing */}
            <View className="flex-row items-center justify-center">
              <View className={`w-2 h-2 rounded-full mr-2 ${
                (progress || 0) > 0.2 ? 'bg-primary-green' : 'bg-border-medium'
              }`} />
              <Typography 
                variant="caption" 
                color={(progress || 0) > 0.2 ? "secondary" : "tertiary"}
              >
                Image processing {(progress || 0) > 0.2 ? 'complete ✓' : '...'}
              </Typography>
            </View>

            {/* Step 2: AI Analysis */}
            <View className="flex-row items-center justify-center">
              <Animated.View 
                className={`w-2 h-2 rounded-full mr-2 ${
                  (progress || 0) > 0.6 ? 'bg-primary-green' : 
                  (progress || 0) > 0.2 ? 'bg-primary-green' : 'bg-border-medium'
                }`}
                style={{
                  opacity: (progress || 0) > 0.2 && (progress || 0) <= 0.6 ? pulseValue : 1,
                }}
              />
              <Typography 
                variant="caption" 
                color={(progress || 0) > 0.6 ? "secondary" : (progress || 0) > 0.2 ? "secondary" : "tertiary"}
              >
                AI analysis {(progress || 0) > 0.6 ? 'complete ✓' : (progress || 0) > 0.2 ? 'in progress...' : '...'}
              </Typography>
            </View>

            {/* Step 3: Generating Recommendations */}
            <View className="flex-row items-center justify-center">
              <Animated.View 
                className={`w-2 h-2 rounded-full mr-2 ${
                  (progress || 0) > 0.9 ? 'bg-primary-green' : 
                  (progress || 0) > 0.6 ? 'bg-primary-green' : 'bg-border-medium'
                }`}
                style={{
                  opacity: (progress || 0) > 0.6 && (progress || 0) <= 0.9 ? pulseValue : 1,
                }}
              />
              <Typography 
                variant="caption" 
                color={(progress || 0) > 0.9 ? "secondary" : (progress || 0) > 0.6 ? "secondary" : "tertiary"}
              >
                Generating recommendations {(progress || 0) > 0.9 ? 'complete ✓' : (progress || 0) > 0.6 ? '...' : '...'}
              </Typography>
            </View>
          </View>
        )}
      </AnimatedView>
    </View>
  );
};