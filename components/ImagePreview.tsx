import React, { useEffect, useState, useRef } from 'react';
import { GridConfig } from '../types';
import { ScanLine } from 'lucide-react';

interface ImagePreviewProps {
  imageSrc: string | null;
  gridConfig: GridConfig;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageSrc, gridConfig }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgDimensions, setImgDimensions] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setImgDimensions({ w: img.width, h: img.height });
      };
    }
  }, [imageSrc]);

  if (!imageSrc) {
    return (
      <div className="w-full h-96 border-2 border-dashed border-secondary/50 rounded-xl flex flex-col items-center justify-center text-secondary bg-surface/50">
        <ScanLine className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No image uploaded</p>
        <p className="text-sm">Upload an image to see the cut preview</p>
      </div>
    );
  }

  // Calculate percentage based positions for the grid overlay
  const getGridStyle = () => {
    if (!imgDimensions) return {};
    const { top, right, bottom, left } = gridConfig.padding;
    
    // Convert px padding to % relative to original image size
    const topPct = (top / imgDimensions.h) * 100;
    const leftPct = (left / imgDimensions.w) * 100;
    const widthPct = ((imgDimensions.w - left - right) / imgDimensions.w) * 100;
    const heightPct = ((imgDimensions.h - top - bottom) / imgDimensions.h) * 100;

    return {
      top: `${topPct}%`,
      left: `${leftPct}%`,
      width: `${Math.max(0, widthPct)}%`,
      height: `${Math.max(0, heightPct)}%`,
    };
  };

  return (
    <div className="w-full h-full flex flex-col items-center overflow-auto p-4 bg-black/20 rounded-xl">
      <div className="relative shadow-2xl inline-block" ref={containerRef}>
        {/* The Source Image */}
        <img
          src={imageSrc}
          alt="Preview"
          className="max-w-full max-h-[70vh] object-contain block rounded-md"
        />

        {/* Overlay for Padding (Visualizes the excluded area) */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none rounded-md">
            {/* Cutout the active area */}
            <div 
                className="absolute bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                style={getGridStyle()}
            />
        </div>

        {/* The Grid Overlay (Active Area) */}
        <div
          className="absolute border border-primary/80 pointer-events-none overflow-hidden box-border"
          style={{
            ...getGridStyle(),
            display: 'grid',
            gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
            gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
          }}
        >
          {Array.from({ length: gridConfig.rows * gridConfig.cols }).map((_, i) => (
            <div
              key={i}
              className="border border-primary/50 relative group flex items-center justify-center"
            >
               <span className="text-[10px] text-white bg-primary/70 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                 #{i + 1}
               </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-secondary flex flex-wrap gap-4 justify-center">
        <span>Original: {imgDimensions?.w}×{imgDimensions?.h}px</span>
        {imgDimensions && (
           <>
             <span>
                Active Area: {imgDimensions.w - gridConfig.padding.left - gridConfig.padding.right}×{imgDimensions.h - gridConfig.padding.top - gridConfig.padding.bottom}px
             </span>
             <span>
               Tile: ~{Math.floor((imgDimensions.w - gridConfig.padding.left - gridConfig.padding.right) / gridConfig.cols)}×{Math.floor((imgDimensions.h - gridConfig.padding.top - gridConfig.padding.bottom) / gridConfig.rows)}px
             </span>
           </>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;