import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingSpinner } from '../LoadingSpinner';

// Mock the UI components
jest.mock('../ui', () => ({
  Typography: ({ children, ...props }: any) => <>{children}</>,
  Card: ({ children, ...props }: any) => <>{children}</>,
  NatureIcon: ({ name, ...props }: any) => <>{name}</>,
  AnimatedView: ({ children, ...props }: any) => <>{children}</>,
}));

describe('LoadingSpinner', () => {
  const defaultProps = {
    message: 'Analyzing your plant...',
  };

  it('renders with basic props', () => {
    const { getByText } = render(<LoadingSpinner {...defaultProps} />);
    
    expect(getByText('Analyzing Your Plant')).toBeTruthy();
    expect(getByText('Analyzing your plant...')).toBeTruthy();
  });

  it('shows progress bar when showProgress is true', () => {
    const { getByText } = render(
      <LoadingSpinner 
        {...defaultProps} 
        progress={0.5} 
        showProgress={true} 
      />
    );
    
    expect(getByText('Progress')).toBeTruthy();
    expect(getByText('50%')).toBeTruthy();
  });

  it('displays custom encouraging messages', () => {
    const customMessages = ['Custom message 1', 'Custom message 2'];
    
    const { getByText } = render(
      <LoadingSpinner 
        {...defaultProps} 
        encouragingMessages={customMessages}
      />
    );
    
    expect(getByText('"Custom message 1"')).toBeTruthy();
  });

  it('shows processing steps when enabled', () => {
    const { getByText } = render(
      <LoadingSpinner 
        {...defaultProps} 
        progress={0.3}
        showProcessingSteps={true}
      />
    );
    
    expect(getByText(/Image processing/)).toBeTruthy();
    expect(getByText(/AI analysis/)).toBeTruthy();
    expect(getByText(/Generating recommendations/)).toBeTruthy();
  });

  it('updates processing steps based on progress', () => {
    const { getByText } = render(
      <LoadingSpinner 
        {...defaultProps} 
        progress={0.7}
        showProcessingSteps={true}
      />
    );
    
    expect(getByText(/Image processing complete ✓/)).toBeTruthy();
    expect(getByText(/AI analysis complete ✓/)).toBeTruthy();
    expect(getByText(/Generating recommendations \.\.\./)).toBeTruthy();
  });

  it('hides processing steps when disabled', () => {
    const { queryByText } = render(
      <LoadingSpinner 
        {...defaultProps} 
        showProcessingSteps={false}
      />
    );
    
    expect(queryByText(/Image processing/)).toBeNull();
    expect(queryByText(/AI analysis/)).toBeNull();
  });

  it('handles undefined progress gracefully', () => {
    const { getByText } = render(
      <LoadingSpinner 
        {...defaultProps} 
        showProcessingSteps={true}
      />
    );
    
    // Should show initial state for all steps
    expect(getByText(/Image processing \.\.\./)).toBeTruthy();
    expect(getByText(/AI analysis \.\.\./)).toBeTruthy();
    expect(getByText(/Generating recommendations \.\.\./)).toBeTruthy();
  });
});