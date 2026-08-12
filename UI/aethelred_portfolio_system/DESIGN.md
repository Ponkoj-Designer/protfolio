---
name: Aethelred Portfolio System
colors:
  surface: '#fdf8f7'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f1'
  surface-container: '#f1edec'
  surface-container-high: '#ece7e6'
  surface-container-highest: '#e6e1e0'
  on-surface: '#1c1b1b'
  on-surface-variant: '#4d4540'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#7e7570'
  outline-variant: '#d0c4be'
  surface-tint: '#625d5b'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1e1b19'
  on-primary-container: '#888380'
  inverse-primary: '#ccc5c2'
  secondary: '#2b6954'
  on-secondary: '#ffffff'
  secondary-container: '#adedd3'
  on-secondary-container: '#306d58'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9e1dd'
  primary-fixed-dim: '#ccc5c2'
  on-primary-fixed: '#1e1b19'
  on-primary-fixed-variant: '#4a4643'
  secondary-fixed: '#b0f0d6'
  secondary-fixed-dim: '#95d3ba'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#0b513d'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fdf8f7'
  on-background: '#1c1b1b'
  surface-variant: '#e6e1e0'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.15'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  margin-mobile: 20px
  margin-desktop: 64px
  gutter: 32px
  stack-lg: 80px
  stack-md: 48px
  stack-sm: 24px
---

## Brand & Style

The design system is engineered for high-end creative portfolios, prioritizing the work as the primary focal point. The brand personality is **sophisticated, intentional, and editorial**, evoking the feeling of a premium physical art monograph.

The style is a blend of **Minimalism** and **Modern Editorial**. It leverages expansive whitespace to create "breathing room" for imagery, high-contrast typography for clear information hierarchy, and subtle tactile cues (soft shadows and micro-interactions) to provide a premium digital feel without distracting from the content.

## Colors

The palette is rooted in a "Warm Neutral" foundation. 
- **Base Backgrounds**: Use `#FFFFFF` for the main canvas and `#FAFAF9` (warm off-white) for secondary surfaces like sidebars, cards, or section offsets to provide subtle structural depth.
- **Typography**: The primary charcoal (`#1C1917`) is used for all high-emphasis text, ensuring maximum readability and an editorial "ink-on-paper" quality.
- **Accents**: Deep Emerald (`#064E3B`) serves as the primary action color, offering a sophisticated alternative to standard blues. Indigo is reserved for secondary highlights or specific interactive states.
- **Feedback**: Success and Error states use desaturated versions of green and red to maintain the premium, non-jarring aesthetic of the design system.

## Typography

This design system employs a classic serif-on-sans pairing. 
- **Headlines**: **Playfair Display** provides an authoritative, high-fashion editorial look. Large display sizes should use negative letter-spacing to appear more cohesive.
- **Body & UI**: **Inter** is used for all functional text, navigation, and long-form body copy. Its neutral, systematic nature balances the expressive qualities of the serif headlines.
- **Labels**: Small utility text (like badges or category labels) should use **Inter** in all-caps with increased letter spacing for a refined, "curated" appearance.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop, centered within a 1440px container, and a **Fluid Grid** on mobile devices.
- **Grid**: A 12-column grid is used for desktop (64px margins), while mobile transitions to a 4-column grid with 20px margins.
- **Rhythm**: Vertical rhythm is generous. Large sections are separated by `stack-lg` (80px) to prevent visual clutter.
- **Safe Areas**: Content should never hug the edges of the viewport; the 64px desktop margin is sacred to maintain the "editorial" feel.

## Elevation & Depth

This design system avoids heavy shadows. Depth is communicated through:
- **Tonal Layering**: Placing `#FFFFFF` elements on `#FAFAF9` backgrounds.
- **Soft Ambient Shadows**: Interactive elements (like cards on hover) use a very diffused, low-opacity shadow: `0 20px 40px rgba(28, 25, 23, 0.05)`.
- **Soft Borders**: Non-interactive containers use a subtle `1px` border in `#E7E5E4` (Stone 200) to define edges without creating harsh visual breaks.
- **Glassmorphism**: Modals and sticky navigation bars utilize a heavy backdrop-blur (20px) with a semi-transparent white fill (`rgba(255, 255, 255, 0.8)`) to maintain context of the underlying content.

## Shapes

The shape language is **Soft (0.25rem / 4px)**. This slight rounding takes the "edge" off the brutalism of sharp corners, making the UI feel modern and approachable while maintaining the structural integrity of a grid-based editorial layout. 
- **Buttons and Inputs**: 4px radius.
- **Cards and Modals**: 8px (rounded-lg) to emphasize their role as distinct containers.
- **Images**: Should remain sharp (0px) or use the standard 4px radius to match UI elements.

## Components

### Buttons
- **Primary**: Solid `#1C1917` with white text. On hover, implement a subtle "magnetic" pull towards the cursor (max 5px displacement) and a slight scale increase (1.02x).
- **Secondary**: Ghost style with 1px border (`#1C1917`). Background fills with `#FAFAF9` on hover.

### Interactive Cards
- Cards feature no border by default. On hover, they lift slightly using the "Soft Ambient Shadow" and the image inside scales by 5%.

### Form Inputs
- **States**: Default has a bottom-border only (2px, `#E7E5E4`). On focus, the border transitions to the primary emerald (`#064E3B`) with a floating label animation.
- **Uploaders**: Image upload containers use a dashed `#D6D3D1` border and a soft `#FAFAF9` fill. On drag-over, the background tints to a very pale emerald.

### Feedback & System States
- **Skeletons**: Use a subtle pulse animation transitioning between `#F5F5F4` and `#E7E5E4`.
- **Empty States**: Centered Playfair Display "headline-sm" text with a muted body description and a primary call-to-action button.
- **Badges**: Small capsules using the "label-caps" typography with a subtle background tint of the accent color.