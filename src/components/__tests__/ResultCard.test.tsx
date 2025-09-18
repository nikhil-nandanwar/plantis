import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ResultCard } from '../ResultCard';
import { ScanResult } from '../../types';

const mockHealthyResult: ScanResult = {
  id: '1',
  imageUri: 'test-uri',
  status: 'healthy',
  confidence: 0.95,
  timestamp: new Date('2024-01-01T12:00:00Z'),
  tips: ['Your plant looks healthy!', 'Continue current care routine.'],
  plantType: 'Rose',
};

const mockDiseasedResult: ScanResult = {
  id: '2',
  imageUri: 'test-uri',
  status: 'diseased',
  confidence: 0.85,
  timestamp: new Date('2024-01-01T12:00:00Z'),
  tips: ['Check watering schedule', 'Improve drainage'],
};

describe('ResultCard', () => {
  it('renders healthy plant result correctly', () => {
    const { getByText } = render(
      <ResultCard result={mockHealthyResult} />
    );

    expect(getByText('Healthy Plant')).toBeTruthy();
    expect(getByText('95%')).toBeTruthy();
    expect(getByText('Great news! Your plant looks healthy 🌱')).toBeTruthy();
  });

  it('renders diseased plant result correctly', () => {
    const { getByText } = render(
      <ResultCard result={mockDiseasedResult} />
    );

    expect(getByText('Diseased Plant')).toBeTruthy();
    expect(getByText('85%')).toBeTruthy();
    expect(getByText('Your plant might need attention 🚨')).toBeTruthy();
  });

  it('displays tips when provided', () => {
    const { getByText } = render(
      <ResultCard result={mockHealthyResult} showDetails={true} />
    );

    expect(getByText('Care Tips:')).toBeTruthy();
    expect(getByText('Your plant looks healthy!')).toBeTruthy();
    expect(getByText('Continue current care routine.')).toBeTruthy();
  });

  it('hides details when showDetails is false', () => {
    const { queryByText } = render(
      <ResultCard result={mockHealthyResult} showDetails={false} />
    );

    expect(queryByText('Care Tips:')).toBeNull();
    expect(queryByText('Great news! Your plant looks healthy 🌱')).toBeNull();
  });

  it('renders in compact mode', () => {
    const { getByText } = render(
      <ResultCard result={mockHealthyResult} compact={true} />
    );

    expect(getByText('Healthy Plant')).toBeTruthy();
    expect(getByText('95%')).toBeTruthy();
  });

  it('calls onPress when provided', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <ResultCard result={mockHealthyResult} onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Healthy Plant'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('displays plant type when provided', () => {
    const { getByText } = render(
      <ResultCard result={mockHealthyResult} showDetails={true} />
    );

    expect(getByText('Plant Type:')).toBeTruthy();
    expect(getByText('Rose')).toBeTruthy();
  });
});