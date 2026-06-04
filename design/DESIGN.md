---
name: Solidez Corporativa
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 4.8rem
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 3.2rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 2.8rem
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 2.4rem
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 1.8rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 1.6rem
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 1.4rem
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 1.2rem
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
  base: 1rem
  xs: 0.4rem
  sm: 0.8rem
  md: 1.6rem
  lg: 2.4rem
  xl: 4.8rem
  gutter: 2.4rem
  margin-desktop: 8rem
  margin-mobile: 2rem
---

## Brand & Style

The design system is engineered to project **trust, architectural precision, and multi-sector expertise**. The brand personality is rooted in the Spanish concept of *Seriedad*—a blend of professional gravity and reliability. It caters to a high-stakes audience including real estate investors, homeowners, and corporate partners.

The aesthetic follows a **Corporate Minimalism** approach. It avoids unnecessary ornamentation, favoring structural integrity and generous whitespace to allow high-quality property imagery and financial data to take center stage. The emotional response should be one of "seguridad" (security) and "eficiencia" (efficiency), ensuring the user feels they are in the hands of an established institution.

## Colors

The palette is anchored by **Deep Midnight Blue** (Primary), symbolizing stability and corporate heritage. A **Vibrant Professional Blue** (Secondary) is used sparingly for primary actions and highlights to guide the user’s eye without overwhelming the minimalist aesthetic.

**Slate Greys** (Tertiary) provide depth for secondary text and decorative elements, while the **Soft Alabaster** (Neutral) backgrounds ensure the UI feels airy and modern. Functional colors (Success, Warning, Error) must follow standard professional conventions but should be slightly desaturated to maintain the sophisticated tone.

## Typography

The typography system leverages a dual-sans-serif approach. **Hanken Grotesk** is used for headlines to provide a sharp, contemporary edge that feels modern yet established. **Inter** is utilized for all body copy and UI labels to ensure maximum legibility across data-dense property listings and insurance terms.

Given the **10px base font size**, all sizing is defined in `rem` units (e.g., `1.6rem` = 16px). Headlines use tighter tracking and leading to maintain a cohesive visual block, while body text uses a generous `1.6` line-height to facilitate comfortable reading of long-form service descriptions.

## Layout & Spacing

This design system employs a **12-column fixed grid** for desktop experiences (max-width 1280px) to mirror the structured nature of construction and investment. For mobile, the system shifts to a fluid single-column layout with 20px (2rem) side margins.

Spacing follows an 8pt-inspired rhythm scaled to the 10px base. Generous whitespace (*espaciado negativo*) is a core requirement to distinguish between the different business units (Real Estate vs. Insurance). Use `xl` (4.8rem) spacing between major sections and `md` (1.6rem) for internal component padding.

## Elevation & Depth

Depth is communicated through **low-contrast outlines** and **tonal layering** rather than heavy shadows. This maintains the "Minimalist" requirement while ensuring hierarchy.

- **Level 0 (Surface):** The main background (`#F8FAFC`).
- **Level 1 (Cards/Containers):** Pure white (`#FFFFFF`) with a subtle 1px border in `#E2E8F0`. 
- **Level 2 (Interaction):** When a user interacts with a property card or service block, a soft, diffused ambient shadow (10% opacity of the Primary color) is applied to suggest lift.
- **Backdrop Blurs:** Used exclusively for navigation headers to maintain context while scrolling through high-resolution property imagery.

## Shapes

The shape language is **Soft (Level 1)**. This choice balances the precision of the construction/investment sectors (sharp lines) with the approachability required for insurance and maintenance (softened edges).

- **Standard Elements:** Buttons and input fields use a `0.4rem` (4px) radius.
- **Containers:** Property cards and modal windows use `0.8rem` (8px) to create a distinct frame for content.
- **Iconography:** Icons should be linear, using a 2px stroke weight with slightly rounded caps to match the UI's radius.

## Components

### Buttons (Botones)
- **Primary:** Solid Deep Blue background with White text. No gradients.
- **Secondary:** Transparent background with a Deep Blue 1px border.
- **Tertiary:** Text-only with a blue underline on hover.

### Cards (Fichas)
Property and service cards must use a "White-on-Grey" strategy: a white container over the neutral background. Use high-resolution imagery for the top half, with text content padded at `2.4rem`. Labels (e.g., "En Venta", "Mantenimiento") should be placed as top-left overlays using the secondary blue.

### Forms (Formularios)
Inputs require a 1px border in `#CBD5E1`. Labels must be positioned above the field in `label-md` style. Focus states are indicated by a 2px border in the secondary blue.

### Headers & Footers
The Header should be persistent (sticky) with a subtle blur effect. The Footer should be high-contrast (Primary Blue background) to signify the end of the page and provide a sense of "foundation."