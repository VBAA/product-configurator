'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { ProductOption, ProductOptions } from '@/lib/mock-data';
import ConfigPanel from './ConfigPanel';

interface ProductConfiguratorProps {
  productName: string;
  basePrice: number;
  options: ProductOptions;
}

interface SelectionState {
  frame: ProductOption;
  cushion: ProductOption;
  backrest: ProductOption;
}

interface LayerImageState {
  frame: 'loading' | 'loaded' | 'error';
  cushion: 'loading' | 'loaded' | 'error';
  backrest: 'loading' | 'loaded' | 'error';
}

interface MagnifierPosition {
  x: number;
  y: number;
  show: boolean;
}

export default function ProductConfigurator({
  productName,
  basePrice,
  options,
}: ProductConfiguratorProps) {
  // Initialize with first option of each category
  const [selection, setSelection] = useState<SelectionState>({
    frame: options.frames[0],
    cushion: options.cushions[0],
    backrest: options.backrests[0],
  });

  const [imageStates, setImageStates] = useState<LayerImageState>({
    frame: 'loaded',
    cushion: 'loaded',
    backrest: 'loaded',
  });

  const [magnifier, setMagnifier] = useState<MagnifierPosition>({
    x: 0,
    y: 0,
    show: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Update selection when user clicks an option
  const handleSelect = useCallback((
    category: keyof SelectionState,
    option: ProductOption
  ) => {
    setSelection((prev) => ({
      ...prev,
      [category]: option,
    }));

    // Set loading state
    setImageStates((prev) => ({
      ...prev,
      [category]: 'loading',
    }));
  }, []);

  // Handle image load
  const handleImageLoad = useCallback((category: keyof LayerImageState) => {
    setImageStates((prev) => ({
      ...prev,
      [category]: 'loaded',
    }));
  }, []);

  // Handle image error
  const handleImageError = useCallback((category: keyof LayerImageState) => {
    setImageStates((prev) => ({
      ...prev,
      [category]: 'error',
    }));
  }, []);

  // Handle mouse move for magnifier
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMagnifier({ x, y, show: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMagnifier((prev) => ({ ...prev, show: false }));
  }, []);

  // Calculate current price
  const totalPrice = useMemo(() => {
    return basePrice;
  }, [basePrice]);

  // Magnifier settings
  const ZOOM_LEVEL = 3;
  const MAGNIFIER_SIZE = 200;

  // Calculate magnifier background position
  const getBackgroundPosition = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const { x, y } = magnifier;
    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;

    // Calculate percentage position
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    return { x: xPercent, y: yPercent };
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT: Product Display Area (60%) */}
        <div className="lg:col-span-3">
          <div className="sticky top-8">
            <div
              ref={containerRef}
              className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 cursor-crosshair"
              style={{
                backgroundImage: 'conic-gradient(#e5e7eb 90deg, #ffffff 90deg 180deg, #e5e7eb 180deg 270deg, #ffffff 270deg)',
                backgroundSize: '40px 40px'
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Layer 1: Frame (Bottom - z-10) */}
              <div className="absolute inset-0 z-10" data-layer="frame">
                {imageStates.frame === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
                    <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
                  </div>
                )}
                <img
                  src={selection.frame.layerImage}
                  alt={`${selection.frame.name} Frame`}
                  className="absolute inset-0 w-full h-full object-contain layer-image"
                  data-src={selection.frame.layerImage}
                  onLoad={() => handleImageLoad('frame')}
                  onError={() => handleImageError('frame')}
                  style={{ opacity: imageStates.frame === 'loaded' ? 1 : 0 }}
                />
              </div>

              {/* Layer 2: Backrest (Middle - z-20) */}
              <div className="absolute inset-0 z-20" data-layer="backrest">
                {imageStates.backrest === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
                  </div>
                )}
                <img
                  src={selection.backrest.layerImage}
                  alt={`${selection.backrest.name} Backrest`}
                  className="absolute inset-0 w-full h-full object-contain layer-image"
                  data-src={selection.backrest.layerImage}
                  onLoad={() => handleImageLoad('backrest')}
                  onError={() => handleImageError('backrest')}
                  style={{ opacity: imageStates.backrest === 'loaded' ? 1 : 0.5 }}
                />
              </div>

              {/* Layer 3: Cushion (Top - z-30) */}
              <div className="absolute inset-0 z-30" data-layer="cushion">
                {imageStates.cushion === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
                  </div>
                )}
                <img
                  src={selection.cushion.layerImage}
                  alt={`${selection.cushion.name} Cushion`}
                  className="absolute inset-0 w-full h-full object-contain layer-image"
                  data-src={selection.cushion.layerImage}
                  onLoad={() => handleImageLoad('cushion')}
                  onError={() => handleImageError('cushion')}
                  style={{ opacity: imageStates.cushion === 'loaded' ? 1 : 0.5 }}
                />
              </div>

              {/* Magnifier - shows zoomed view of hovered area */}
              {magnifier.show && (
                <div
                  className="absolute rounded-full border-4 border-white shadow-2xl overflow-hidden pointer-events-none z-50 bg-white"
                  style={{
                    width: MAGNIFIER_SIZE,
                    height: MAGNIFIER_SIZE,
                    left: magnifier.x - MAGNIFIER_SIZE / 2,
                    top: magnifier.y - MAGNIFIER_SIZE / 2,
                  }}
                >
                  {/* Create a stacked view of all layers for magnification */}
                  {[
                    { src: selection.frame.layerImage, opacity: imageStates.frame === 'loaded' ? 1 : 0 },
                    { src: selection.backrest.layerImage, opacity: imageStates.backrest === 'loaded' ? 1 : 0.5 },
                    { src: selection.cushion.layerImage, opacity: imageStates.cushion === 'loaded' ? 1 : 0.5 },
                  ].map((layer, idx) => (
                    <div
                      key={idx}
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${layer.src})`,
                        backgroundSize: `${(containerRef.current?.offsetWidth || 0) * ZOOM_LEVEL}px ${(containerRef.current?.offsetHeight || 0) * ZOOM_LEVEL}px`,
                        backgroundPosition: `-${magnifier.x * ZOOM_LEVEL - MAGNIFIER_SIZE / 2}px -${magnifier.y * ZOOM_LEVEL - MAGNIFIER_SIZE / 2}px`,
                        opacity: layer.opacity,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Loading overlay */}
              {(imageStates.frame === 'loading' || imageStates.cushion === 'loading' || imageStates.backrest === 'loading') && (
                <div className="absolute inset-0 z-40 bg-white/5 backdrop-blur-sm pointer-events-none" />
              )}
            </div>

            {/* Product Info */}
            <div className="mt-6 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{productName}</h1>
              <p className="text-gray-500">Customize your perfect seating solution</p>
              <p className="text-sm text-gray-400 mt-2">💡 Hover over the product to zoom in</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Configuration Panel (40%) */}
        <div className="lg:col-span-2">
          <div className="sticky top-8 space-y-6">
            {/* Price Display */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow-lg">
              <p className="text-sm text-gray-300 mb-1">Total Price</p>
              <p className="text-4xl font-bold">${totalPrice.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-2">Free shipping • 30-day returns</p>
            </div>

            {/* Configuration Options */}
            <ConfigPanel
              selection={selection}
              onSelect={handleSelect}
              options={options}
            />

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full py-4 px-6 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Add to Cart
              </button>
              <button className="w-full py-4 px-6 bg-white text-gray-900 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                Save Configuration
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 pt-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>In Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>2 Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
