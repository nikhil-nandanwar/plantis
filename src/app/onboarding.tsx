import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Dimensions, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { markOnboardingComplete } from "../utils/storageUtils";
import { Typography, Button, Card, AnimatedView, NatureIcon, GradientBackground } from "../components/ui";

const { width } = Dimensions.get("window");

const onboardingSlides = [
  {
    icon: "sprout" as const,
    title: "Welcome to Plantis",
    description: "Your AI-powered plant health companion. Detect diseases early and keep your plants thriving with smart technology.",
    features: ["AI Disease Detection", "Instant Results", "Care Recommendations"]
  },
  {
    icon: "camera" as const,
    title: "Snap & Analyze",
    description: "Simply take a photo of your plant's leaf and get instant disease detection results with confidence scores in seconds.",
    features: ["Camera Integration", "Gallery Support", "95% Accuracy"]
  },
  {
    icon: "history" as const,
    title: "Track & Learn",
    description: "View your scan history, track plant health over time, and get personalized care tips to maintain healthy, beautiful plants.",
    features: ["Scan History", "Progress Tracking", "Expert Tips"]
  }
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const slideScale = useRef(new Animated.Value(1)).current;

  const animateSlideChange = (newSlide: number) => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideScale, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentSlide(newSlide);
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      animateSlideChange(currentSlide + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      animateSlideChange(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    try {
      await markOnboardingComplete();
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      router.replace("/(tabs)");
    }
  };

  const slide = onboardingSlides[currentSlide];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <GradientBackground variant="subtle" className="flex-1">
        <View className="flex-1 px-6 py-8">
          {/* Skip Button */}
          <View className="flex-row justify-end mb-8">
            <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
              <Typography variant="body1" color="secondary" weight="medium">
                Skip
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <Animated.View 
            className="flex-1 justify-center items-center px-4"
            style={{ 
              opacity: contentOpacity,
              transform: [{ scale: slideScale }]
            }}
          >
            {/* Enhanced Icon Container */}
            <Card variant="gradient" padding="xl" rounded="full" shadow className="mb-12">
              <NatureIcon 
                name={slide.icon} 
                size="2xl" 
                variant="soft" 
                color="neutral"
                animated
                animationType="bounce"
              />
            </Card>

            {/* Title */}
            <Typography 
              variant="h2" 
              weight="bold" 
              align="center" 
              className="mb-6 max-w-sm"
            >
              {slide.title}
            </Typography>

            {/* Description */}
            <Typography 
              variant="body1" 
              color="secondary" 
              align="center" 
              className="leading-relaxed px-4 mb-8 max-w-md"
            >
              {slide.description}
            </Typography>

            {/* Features List */}
            <Card variant="glass" padding="md" rounded="xl" className="w-full max-w-sm">
              <View className="space-y-3">
                {slide.features.map((feature, index) => (
                  <AnimatedView key={index} animation="slideLeft" delay={index * 100}>
                    <View className="flex-row items-center">
                      <NatureIcon 
                        name="success" 
                        size="sm" 
                        variant="contained" 
                        color="success" 
                        animated
                        animationType="pulse"
                        className="mr-3" 
                      />
                      <Typography variant="body2" weight="medium" className="flex-1">
                        {feature}
                      </Typography>
                    </View>
                  </AnimatedView>
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Bottom Section */}
          <View className="mt-8">
            {/* Enhanced Pagination Dots */}
            <View className="flex-row justify-center mb-8">
              {onboardingSlides.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => animateSlideChange(index)}
                  activeOpacity={0.7}
                  className="mx-1"
                >
                  <View
                    testID={`pagination-dot-${index}`}
                    className={`w-3 h-3 rounded-full ${
                      index === currentSlide 
                        ? 'bg-primary-green w-8' 
                        : 'bg-border-medium'
                    }`}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Navigation Buttons */}
            <View className="flex-row justify-between items-center">
              <Button
                variant="ghost"
                size="lg"
                onPress={handleBack}
                disabled={currentSlide === 0}
                className={currentSlide === 0 ? 'opacity-0' : 'opacity-100'}
              >
                Back
              </Button>

              <Button
                variant="primary"
                size="lg"
                onPress={handleNext}
                rightIcon={currentSlide === onboardingSlides.length - 1 ? "🚀" : undefined}
                shadow
                gradient
                rounded={currentSlide === onboardingSlides.length - 1}
              >
                {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
              </Button>
            </View>
          </View>

          {/* Progress Indicator */}
          <View className="mt-4">
            <View className="w-full h-1 bg-border-light rounded-full overflow-hidden">
              <View 
                className="h-full bg-primary-green rounded-full"
                style={{ 
                  width: `${((currentSlide + 1) / onboardingSlides.length) * 100}%` 
                }}
              />
            </View>
          </View>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
}