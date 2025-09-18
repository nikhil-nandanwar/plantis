import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ExpandableTipCard } from '../ExpandableTipCard';
import { PlantTip } from '../../../types/tips';

const mockTip: PlantTip = {
  id: 'test-tip',
  title: 'Test Tip',
  description: 'This is a test tip description',
  icon: '🌱',
  category: 'general',
  expandedContent: 'This is expanded content with more details',
  steps: ['Step 1', 'Step 2', 'Step 3'],
  relatedTips: ['related-tip-1', 'related-tip-2']
};

describe('ExpandableTipCard', () => {
  it('renders tip title and description', () => {
    const { getByText } = render(<ExpandableTipCard tip={mockTip} />);
    
    expect(getByText('Test Tip')).toBeTruthy();
    expect(getByText('This is a test tip description')).toBeTruthy();
    expect(getByText('🌱')).toBeTruthy();
  });

  it('shows category badge', () => {
    const { getByText } = render(<ExpandableTipCard tip={mockTip} />);
    
    expect(getByText('general')).toBeTruthy();
  });

  it('shows severity badge when provided', () => {
    const tipWithSeverity: PlantTip = {
      ...mockTip,
      severity: 'high'
    };
    
    const { getByText } = render(<ExpandableTipCard tip={tipWithSeverity} />);
    
    expect(getByText('high priority')).toBeTruthy();
  });

  it('expands and shows detailed content when tapped', () => {
    const { getByText, queryByText } = render(<ExpandableTipCard tip={mockTip} />);
    
    // Initially expanded content should not be visible
    expect(queryByText('This is expanded content with more details')).toBeFalsy();
    expect(queryByText('Step-by-Step Guide:')).toBeFalsy();
    
    // Tap to expand
    fireEvent.press(getByText('Test Tip'));
    
    // Now expanded content should be visible
    expect(getByText('This is expanded content with more details')).toBeTruthy();
    expect(getByText('Step-by-Step Guide:')).toBeTruthy();
    expect(getByText('Step 1')).toBeTruthy();
    expect(getByText('Step 2')).toBeTruthy();
    expect(getByText('Step 3')).toBeTruthy();
  });

  it('shows related tips when expanded', () => {
    const { getByText } = render(<ExpandableTipCard tip={mockTip} />);
    
    // Tap to expand
    fireEvent.press(getByText('Test Tip'));
    
    // Check for related tips section
    expect(getByText('💡 Related Tips:')).toBeTruthy();
  });

  it('can be initially expanded', () => {
    const { getByText } = render(
      <ExpandableTipCard tip={mockTip} initiallyExpanded={true} />
    );
    
    // Expanded content should be visible immediately
    expect(getByText('This is expanded content with more details')).toBeTruthy();
  });

  it('collapses when tapped again', () => {
    const { getByText, queryByText } = render(
      <ExpandableTipCard tip={mockTip} initiallyExpanded={true} />
    );
    
    // Initially expanded
    expect(getByText('This is expanded content with more details')).toBeTruthy();
    
    // Tap to collapse
    fireEvent.press(getByText('Test Tip'));
    
    // Should be collapsed now
    expect(queryByText('This is expanded content with more details')).toBeFalsy();
  });
});