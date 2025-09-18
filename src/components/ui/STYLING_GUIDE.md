# Plantis UI Styling Guide

## Overview

This guide documents the comprehensive nature-inspired UI styling system implemented for the Plantis plant disease detection app. The styling system emphasizes natural colors, smooth animations, and intuitive interactions.

## Design System

### Color Palette

#### Primary Colors
- **Primary Green**: `#22c55e` - Main brand color
- **Primary Dark**: `#16a34a` - Darker variant for active states
- **Primary Light**: `#86efac` - Lighter variant for backgrounds
- **Primary Lighter**: `#bbf7d0` - Very light for subtle backgrounds
- **Primary Lightest**: `#dcfce7` - Extremely light for soft cards

#### Secondary Nature Colors
- **Earth Brown**: `#a3a3a3` - Natural earth tones
- **Leaf Green**: `#65a30d` - Vibrant leaf color
- **Forest Green**: `#166534` - Deep forest shade
- **Sage Green**: `#84cc16` - Soft sage color

#### Status Colors
- **Success**: `#10b981` - Healthy plant status
- **Warning**: `#f59e0b` - Attention needed
- **Error**: `#ef4444` - Disease detected
- **Info**: `#3b82f6` - Informational content

### Typography

#### Font Family
- **Primary**: Inter (system fallback: system-ui, sans-serif)
- **Display**: Inter for headings

#### Font Sizes
- **xs**: 12px - Small captions
- **sm**: 14px - Secondary text
- **base**: 16px - Body text
- **lg**: 18px - Large body text
- **xl**: 20px - Small headings
- **2xl**: 24px - Medium headings
- **3xl**: 30px - Large headings
- **4xl**: 36px - Extra large headings

#### Font Weights
- **normal**: 400 - Regular text
- **medium**: 500 - Emphasized text
- **semibold**: 600 - Subheadings
- **bold**: 700 - Main headings

## Component Styling

### Button Component

#### Variants
- **primary**: Main action buttons with gradient option
- **secondary**: Secondary actions with sage green
- **success**: Success confirmations
- **outline**: Outlined buttons for secondary actions
- **ghost**: Minimal buttons without background
- **soft**: Subtle buttons with light background
- **danger**: Destructive actions

#### Sizes
- **xs**: Extra small buttons (px-2 py-1)
- **sm**: Small buttons (px-3 py-2)
- **md**: Medium buttons (px-4 py-3) - Default
- **lg**: Large buttons (px-6 py-4)
- **xl**: Extra large buttons (px-8 py-5)

#### Features
- **gradient**: Applies nature-inspired gradient
- **shadow**: Adds nature-themed shadow
- **rounded**: Makes button fully rounded
- **fullWidth**: Expands to full container width

### Card Component

#### Variants
- **default**: Basic card with light border
- **elevated**: Card with medium shadow
- **outlined**: Card with prominent border
- **soft**: Card with light green background
- **gradient**: Card with nature gradient
- **glass**: Card with backdrop blur effect

#### Padding Options
- **none**: No padding
- **xs**: 8px padding
- **sm**: 12px padding
- **md**: 16px padding - Default
- **lg**: 24px padding
- **xl**: 32px padding

#### Features
- **shadow**: Adds enhanced shadow
- **interactive**: Adds hover and press effects
- **rounded**: Custom border radius options

### NatureIcon Component

#### Icon Library
Comprehensive set of nature-themed emoji icons including:
- Basic: leaf, flower, tree, sun, water, seed, sprout
- Actions: camera, gallery, tips, history
- Status: healthy, diseased, warning, success, error
- Extended: plant, garden, butterfly, bee, rainbow, earth, etc.

#### Variants
- **default**: Plain icon
- **contained**: Icon with colored background
- **outlined**: Icon with border
- **soft**: Icon with subtle background

#### Animation Types
- **pulse**: Gentle pulsing effect
- **bounce**: Bouncing animation
- **float**: Floating up and down
- **glow**: Glowing effect
- **wiggle**: Wiggling motion
- **rotate**: Slow rotation

### Typography Component

#### Variants
- **h1-h4**: Heading levels with appropriate sizing
- **body1-body2**: Body text variants
- **caption**: Small text for captions
- **overline**: Uppercase small text

#### Colors
- **primary**: Main text color
- **secondary**: Muted text color
- **tertiary**: Very muted text color
- **inverse**: White text for dark backgrounds
- **success/warning/error**: Status-specific colors

### AnimatedView Component

#### Animation Types
- **fadeIn**: Fade in effect
- **slideUp/slideDown**: Vertical slide animations
- **slideLeft/slideRight**: Horizontal slide animations
- **scaleIn**: Scale up animation
- **zoomIn**: Zoom in effect
- **bounceIn**: Bounce in animation
- **rotateIn**: Rotation with scale
- **flipIn**: 3D flip effect

## Responsive Design

### Breakpoints
- **xs**: 0-575px - Small phones
- **sm**: 576-767px - Large phones
- **md**: 768-991px - Tablets
- **lg**: 992-1199px - Small desktops
- **xl**: 1200px+ - Large desktops

### Responsive Utilities
- **ResponsiveView**: Component for responsive styling
- **responsive.ts**: Utility functions for responsive calculations
- **Device detection**: Automatic device type detection

## Animation System

### CSS Animations
- **animate-fade-in**: Fade in animation
- **animate-slide-up/down**: Slide animations
- **animate-scale-in**: Scale animation
- **animate-bounce-gentle**: Gentle bounce
- **animate-pulse-soft**: Soft pulsing
- **animate-shimmer**: Shimmer effect
- **animate-float**: Floating animation
- **animate-glow**: Glowing effect
- **animate-wiggle**: Wiggle animation
- **animate-heartbeat**: Heartbeat effect
- **animate-rotate-slow**: Slow rotation

### Interactive States
- **hover-lift**: Lift effect on hover
- **press-scale**: Scale down on press
- **focus-nature**: Nature-themed focus ring

## Utility Classes

### Shadows
- **shadow-soft**: Subtle shadow
- **shadow-medium**: Medium shadow
- **shadow-strong**: Strong shadow
- **shadow-nature**: Nature-themed green shadow

### Gradients
- **gradient-nature**: Primary nature gradient
- **gradient-success**: Success gradient
- **gradient-warning**: Warning gradient

### Status Indicators
- **status-healthy**: Healthy plant styling
- **status-diseased**: Diseased plant styling
- **status-error**: Error state styling

### Patterns
- **pattern-dots**: Subtle dot pattern
- **pattern-leaves**: Leaf pattern background

### Backdrop Effects
- **backdrop-nature**: Nature-themed backdrop
- **backdrop-soft**: Soft backdrop blur

## Theme Provider

### Usage
```tsx
import { ThemeProvider, useTheme } from './components/ui';

// Wrap your app
<ThemeProvider>
  <App />
</ThemeProvider>

// Use in components
const { colors, spacing, typography } = useTheme();
```

### Hooks
- **useTheme**: Access complete theme object
- **useColors**: Access color palette
- **useSpacing**: Access spacing values
- **useTypography**: Access typography settings
- **useAnimations**: Access animation presets
- **useResponsive**: Access responsive utilities

## Best Practices

### Color Usage
1. Use primary green for main actions and branding
2. Use success green for healthy plant indicators
3. Use warning orange for attention-needed states
4. Use error red sparingly for critical issues
5. Maintain sufficient contrast ratios (4.5:1 minimum)

### Animation Guidelines
1. Keep animations subtle and purposeful
2. Use consistent timing (200-500ms for most interactions)
3. Prefer ease-out easing for natural feel
4. Avoid excessive or distracting animations
5. Provide reduced motion alternatives

### Responsive Design
1. Design mobile-first
2. Use flexible layouts with proper spacing
3. Ensure touch targets are at least 44px
4. Test on various screen sizes
5. Use responsive typography scaling

### Accessibility
1. Maintain proper color contrast
2. Provide focus indicators
3. Use semantic HTML elements
4. Include proper ARIA labels
5. Support keyboard navigation

## Implementation Examples

### Enhanced Button
```tsx
<Button
  variant="primary"
  size="lg"
  gradient
  shadow
  leftIcon="🌱"
  onPress={handleAction}
>
  Analyze Plant
</Button>
```

### Animated Card
```tsx
<AnimatedView animation="slideUp" delay={200}>
  <Card variant="elevated" padding="lg" interactive shadow>
    <NatureIcon 
      name="leaf" 
      size="xl" 
      variant="contained" 
      animated 
      animationType="pulse" 
    />
    <Typography variant="h3" weight="semibold">
      Plant Health
    </Typography>
  </Card>
</AnimatedView>
```

### Responsive Layout
```tsx
<ResponsiveView
  xs="px-4 py-2"
  md="px-6 py-4"
  lg="px-8 py-6"
>
  <Typography variant="h2" weight="bold">
    Welcome to Plantis
  </Typography>
</ResponsiveView>
```

This styling system provides a comprehensive, nature-inspired design language that enhances the user experience while maintaining consistency and accessibility throughout the Plantis application.