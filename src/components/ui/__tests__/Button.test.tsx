import React from 'react';
import { render } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(
      <Button>Test Button</Button>
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders with primary variant', () => {
    const { getByText } = render(
      <Button variant="primary">Primary Button</Button>
    );
    
    expect(getByText('Primary Button')).toBeTruthy();
  });

  it('renders with gradient and shadow', () => {
    const { getByText } = render(
      <Button variant="primary" gradient shadow>Gradient Button</Button>
    );
    
    expect(getByText('Gradient Button')).toBeTruthy();
  });
});