import React, { useEffect, useRef } from 'react';
import { Animated, ViewProps } from 'react-native';

interface AnimatedViewProps extends ViewProps {
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'bounceIn' | 'rotateIn' | 'flipIn' | 'zoomIn';
  duration?: number;
  delay?: number;
  loop?: boolean;
  children: React.ReactNode;
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  animation = 'fadeIn',
  duration = 500,
  delay = 0,
  loop = false,
  children,
  style,
  ...props
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      const animationConfig = {
        toValue: 1,
        duration,
        useNativeDriver: true,
      };

      if (loop) {
        Animated.loop(
          Animated.timing(animatedValue, animationConfig)
        ).start();
      } else {
        Animated.timing(animatedValue, animationConfig).start();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [animatedValue, duration, delay, loop]);

  const getAnimationStyle = () => {
    switch (animation) {
      case 'fadeIn':
        return {
          opacity: animatedValue,
        };
      case 'slideUp':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        };
      case 'slideDown':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-30, 0],
              }),
            },
          ],
        };
      case 'slideLeft':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        };
      case 'slideRight':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-30, 0],
              }),
            },
          ],
        };
      case 'scaleIn':
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };
      case 'zoomIn':
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            },
          ],
        };
      case 'bounceIn':
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 0.3, 0.7, 1],
                outputRange: [0.3, 1.1, 0.9, 1],
              }),
            },
          ],
        };
      case 'rotateIn':
        return {
          opacity: animatedValue,
          transform: [
            {
              rotate: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['180deg', '0deg'],
              }),
            },
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };
      case 'flipIn':
        return {
          opacity: animatedValue,
          transform: [
            {
              rotateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['90deg', '0deg'],
              }),
            },
          ],
        };
      default:
        return {
          opacity: animatedValue,
        };
    }
  };

  return (
    <Animated.View
      {...props}
      style={[getAnimationStyle(), style]}
    >
      {children}
    </Animated.View>
  );
};