import React from 'react';
import { render } from '@testing-library/react-native';
import { DiseaseTipsDisplay } from '../DiseaseTipsDisplay';
import { ScanResult } from '../../../types';

const mockHealthyScanResult: ScanResult = {
  id: 'test-1',
  imageUri: 'test-uri',
  status: 'healthy',
  confidence: 0.95,
  timestamp: new Date(),
  tips: ['Keep up the good work', 'Continue current care routine']
};

const mockDiseasedScanResult: ScanResult = {
  id: 'test-2',
  imageUri: 'test-uri',
  status: 'diseased',
  confidence: 0.87,
  timestamp: new Date(),
  tips: ['Remove affected leaves', 'Improve air circulation']
};

describe('DiseaseTipsDisplay', () => {
  it('renders healthy plant message correctly', () => {
    const { getByText } = render(
      <DiseaseTipsDisplay scanResult={mockHealthyScanResult} />
    );
    
    expect(getByText('Keep Up the Great Work! 🌱')).toBeTruthy();
    expect(getByText('Your plant looks healthy. Here are some tips to maintain its health:')).toBeTruthy();
    expect(getByText('Detection Confidence: 95%')).toBeTruthy();
  });

  it('renders diseased plant message correctly', () => {
    const { getByText } = render(
      <DiseaseTipsDisplay scanResult={mockDiseasedScanResult} />
    );
    
    expect(getByText('Your Plant Needs Attention 🚨')).toBeTruthy();
    expect(getByText('Don\'t worry! Here\'s how to help your plant recover:')).toBeTruthy();
    expect(getByText('Detection Confidence: 87%')).toBeTruthy();
  });

  it('shows maintenance tips section for healthy plants', () => {
    const { getByText } = render(
      <DiseaseTipsDisplay scanResult={mockHealthyScanResult} />
    );
    
    expect(getByText('Maintenance Tips')).toBeTruthy();
  });

  it('shows treatment plan section for diseased plants', () => {
    const { getByText } = render(
      <DiseaseTipsDisplay scanResult={mockDiseasedScanResult} />
    );
    
    expect(getByText('Treatment Plan')).toBeTruthy();
  });

  it('displays disease-specific information when provided', () => {
    const { getByText } = render(
      <DiseaseTipsDisplay 
        scanResult={mockDiseasedScanResult} 
        diseaseType="leaf-spot"
      />
    );
    
    expect(getByText('About Leaf Spot Disease')).toBeTruthy();
    expect(getByText('🔍 Common Symptoms:')).toBeTruthy();
    expect(getByText('⚠️ Common Causes:')).toBeTruthy();
  });

  it('shows encouragement message at the bottom', () => {
    const { getByText } = render(
      <DiseaseTipsDisplay scanResult={mockHealthyScanResult} />
    );
    
    expect(getByText('🌟 Remember')).toBeTruthy();
    expect(getByText(/Regular monitoring and consistent care/)).toBeTruthy();
  });

  it('shows recovery encouragement for diseased plants', () => {
    const { getByText } = render(
      <DiseaseTipsDisplay scanResult={mockDiseasedScanResult} />
    );
    
    expect(getByText('🌟 Remember')).toBeTruthy();
    expect(getByText(/Plant recovery takes time and patience/)).toBeTruthy();
  });
});