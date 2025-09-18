import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { isFirstTimeUser } from "../utils/storageUtils";
import { Typography, GradientBackground, NatureIcon } from "../components/ui";

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start logo animation with bounce effect
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Add subtle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const checkFirstTime = async () => {
      try {
        const isFirstTime = await isFirstTimeUser();
        
        // Simulate splash screen delay with animation time
        setTimeout(() => {
          if (isFirstTime) {
            // First time user - go to onboarding
            router.replace("/onboarding");
          } else {
            // Returning user - go to main tabs
            router.replace("/(tabs)");
          }
        }, 2500);
      } catch (error) {
        console.error("Error checking first time status:", error);
        // Default to onboarding on error
        setTimeout(() => {
          router.replace("/onboarding");
        }, 2500);
      }
    };

    checkFirstTime();
  }, [logoScale, logoOpacity, textOpacity, pulseAnim]);

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground variant="primary" className="flex-1">
        <View className="flex-1 justify-center items-center px-8">
          {/* Logo Container with Enhanced Styling */}
          <Animated.View 
            className="bg-surface-elevated rounded-full w-36 h-36 justify-center items-center mb-12 shadow-strong"
            style={{
              transform: [
                { scale: Animated.multiply(logoScale, pulseAnim) }
              ],
              opacity: logoOpacity,
              shadowColor: '#22c55e',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <NatureIcon name="sprout" size="2xl" variant="default" />
          </Animated.View>

          {/* Text Content with Enhanced Typography */}
          <Animated.View 
            style={{ opacity: textOpacity }}
            className="items-center"
          >
            <Typography 
              variant="h1" 
              color="inverse" 
              weight="bold" 
              align="center"
              className="mb-3 tracking-tight"
            >
              Plantis
            </Typography>
            <Typography 
              variant="body1" 
              color="inverse" 
              align="center"
              className="opacity-90 tracking-wide text-lg"
            >
              Plant Disease Detection
            </Typography>
            
            {/* Subtle tagline */}
            <Typography 
              variant="body2" 
              color="inverse" 
              align="center"
              className="opacity-75 mt-4 max-w-xs"
            >
              AI-powered plant health companion
            </Typography>
          </Animated.View>

          {/* Decorative Elements */}
          <View className="absolute bottom-20 flex-row space-x-4 opacity-20">
            <NatureIcon name="leaf" size="sm" variant="default" />
            <NatureIcon name="flower" size="sm" variant="default" />
            <NatureIcon name="tree" size="sm" variant="default" />
          </View>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
}

