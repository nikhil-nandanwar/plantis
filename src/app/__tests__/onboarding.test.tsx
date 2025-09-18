import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OnboardingScreen from '../onboarding';
import { markOnboardingComplete } from '../../utils/storageUtils';

// Mock the router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

// Mock the storage utils
jest.mock('../../utils/storageUtils', () => ({
  markOnboardingComplete: jest.fn(),
}));

// Mock Animated
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = () => ({
    start: jest.fn(),
  });
  RN.Animated.sequence = () => ({
    start: jest.fn(),
  });
  RN.Animated.parallel = () => ({
    start: jest.fn(),
  });
  return RN;
});

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the first onboarding slide correctly', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    expect(getByText('Welcome to Plantis')).toBeTruthy();
    expect(getByText('Your AI-powered plant health companion. Detect diseases early and keep your plants thriving.')).toBeTruthy();
    expect(getByText('Skip')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
  });

  it('navigates to next slide when Next is pressed', async () => {
    const { getByText } = render(<OnboardingScreen />);
    
    fireEvent.press(getByText('Next'));
    
    await waitFor(() => {
      expect(getByText('Snap & Analyze')).toBeTruthy();
    });
  });

  it('navigates to previous slide when Back is pressed', async () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // Go to second slide
    fireEvent.press(getByText('Next'));
    
    await waitFor(() => {
      expect(getByText('Snap & Analyze')).toBeTruthy();
    });
    
    // Go back to first slide
    fireEvent.press(getByText('Back'));
    
    await waitFor(() => {
      expect(getByText('Welcome to Plantis')).toBeTruthy();
    });
  });

  it('shows Get Started button on last slide', async () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // Navigate to last slide
    fireEvent.press(getByText('Next')); // Slide 2
    await waitFor(() => {
      fireEvent.press(getByText('Next')); // Slide 3
    });
    
    await waitFor(() => {
      expect(getByText('Get Started 🚀')).toBeTruthy();
    });
  });

  it('completes onboarding when Get Started is pressed', async () => {
    const { getByText } = render(<OnboardingScreen />);
    const { router } = require('expo-router');
    
    // Navigate to last slide
    fireEvent.press(getByText('Next')); // Slide 2
    await waitFor(() => {
      fireEvent.press(getByText('Next')); // Slide 3
    });
    
    await waitFor(() => {
      fireEvent.press(getByText('Get Started 🚀'));
    });
    
    expect(markOnboardingComplete).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });

  it('skips onboarding when Skip is pressed', async () => {
    const { getByText } = render(<OnboardingScreen />);
    const { router } = require('expo-router');
    
    fireEvent.press(getByText('Skip'));
    
    expect(markOnboardingComplete).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });

  it('displays correct pagination dots', () => {
    const { getAllByTestId } = render(<OnboardingScreen />);
    
    // Should have 3 pagination dots
    const dots = getAllByTestId(/pagination-dot/);
    expect(dots).toHaveLength(3);
  });
});