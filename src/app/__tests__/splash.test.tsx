import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SplashScreen from '../index';
import { isFirstTimeUser } from '../../utils/storageUtils';

// Mock the router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

// Mock the storage utils
jest.mock('../../utils/storageUtils', () => ({
  isFirstTimeUser: jest.fn(),
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

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders splash screen correctly', () => {
    const { getByText } = render(<SplashScreen />);
    
    expect(getByText('Plantis')).toBeTruthy();
    expect(getByText('Plant Disease Detection')).toBeTruthy();
    expect(getByText('🌱')).toBeTruthy();
  });

  it('navigates to onboarding for first time users', async () => {
    const { router } = require('expo-router');
    (isFirstTimeUser as jest.Mock).mockResolvedValue(true);
    
    render(<SplashScreen />);
    
    // Fast forward the timer
    jest.advanceTimersByTime(2500);
    
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/onboarding');
    });
  });

  it('navigates to main tabs for returning users', async () => {
    const { router } = require('expo-router');
    (isFirstTimeUser as jest.Mock).mockResolvedValue(false);
    
    render(<SplashScreen />);
    
    // Fast forward the timer
    jest.advanceTimersByTime(2500);
    
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('defaults to onboarding on error', async () => {
    const { router } = require('expo-router');
    (isFirstTimeUser as jest.Mock).mockRejectedValue(new Error('Storage error'));
    
    render(<SplashScreen />);
    
    // Fast forward the timer
    jest.advanceTimersByTime(2500);
    
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/onboarding');
    });
  });
});