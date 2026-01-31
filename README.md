# Visual Product Configurator

A high-performance, interactive product configurator built with Next.js 14 (App Router), Tailwind CSS, and TypeScript.

## Features

- **Layer Composition**: Multi-layer image stacking (Frame → Backrest → Cushion) with proper z-index management
- **Real-time Preview**: Instant visual feedback when selecting options
- **Responsive Design**: Mobile-first layout that adapts to all screen sizes
- **Performance Optimized**: Uses Next.js Image component with lazy loading and optimization
- **Smooth Interactions**: Loading states, hover effects, and smooth transitions
- **Accessible**: ARIA labels and keyboard navigation support

## Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles with Tailwind
├── components/
│   ├── ProductConfigurator.tsx  # Main configurator with layer composition
│   └── ConfigPanel.tsx          # Configuration panel with swatch selectors
├── lib/
│   └── mock-data.ts        # Product data types and mock data
├── public/                 # Static assets
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies

```

## Tech Stack

- **Framework**: Next.js 14.2+ (App Router)
- **Styling**: Tailwind CSS 3.4+
- **Icons**: Lucide React
- **Language**: TypeScript 5+
- **Image Optimization**: Next.js Image component

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Layer Composition Logic

The configurator uses a three-layer stacking system:

```
┌─────────────────────────────────┐
│  Cushion Layer (z-index: 30)     │  ← Top layer
├─────────────────────────────────┤
│  Backrest Layer (z-index: 20)    │  ← Middle layer
├─────────────────────────────────┤
│  Frame Layer (z-index: 10)       │  ← Bottom layer
└─────────────────────────────────┘
```

Each layer is an absolute-positioned `Image` component that updates its `src` when the user selects a different option.

## Component Architecture

### ProductConfigurator

Main component that manages:
- Selection state for all three categories
- Layer loading states
- Price calculation
- Layout orchestration

**Props:**
- `productName`: string
- `basePrice`: number
- `options`: ProductOptions object

### ConfigPanel

Handles the option selection UI:
- Grid-based swatch display
- Hover tooltips
- Selected state indicators
- Section organization (Frame, Cushion, Backrest)

## Data Structure

```typescript
interface ProductOption {
  id: string;
  name: string;
  swatchUrl: string;     // Thumbnail image
  layerImage: string;    // Full-size transparent PNG/WebP
}

interface ProductOptions {
  frames: ProductOption[];
  cushions: ProductOption[];
  backrests: ProductOption[];
}
```

## Customization

### Adding More Options

Edit `lib/mock-data.ts` and add new options to the respective arrays:

```typescript
frames: [
  {
    id: "custom-frame",
    name: "Custom Frame",
    swatchUrl: "/path/to/swatch.jpg",
    layerImage: "/path/to/layer.png"
  },
  // ... more options
]
```

### Changing Layer Order

Modify the z-index values in `ProductConfigurator.tsx`:

```tsx
{/* Layer 1 - Adjust z-10 as needed */}
<div className="absolute inset-0 z-10">

{/* Layer 2 - Adjust z-20 as needed */}
<div className="absolute inset-0 z-20">

{/* Layer 3 - Adjust z-30 as needed */}
<div className="absolute inset-0 z-30">
```

### Styling

All styles use Tailwind CSS utility classes. Modify colors, spacing, and effects directly in the component files.

## Performance Optimizations

1. **Next.js Image**: Automatic optimization, lazy loading, and responsive sizing
2. **useMemo**: Price calculation is memoized to prevent unnecessary recalculations
3. ** useCallback**: Event handlers are memoized to prevent child re-renders
4. **Priority Loading**: Bottom layer images are loaded with priority
5. **Skeleton Loading**: Loading states prevent layout shift

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
