import React from 'react';
import { Tile } from '../types';
import { Download, Archive } from 'lucide-react';

interface TileGalleryProps {
  tiles: Tile[];
  onDownloadAll: () => void;
  enableTabMode: boolean;
  selectedTileId: string | null;
  onSelectTile: (tileId: string) => void;
  onGenerateTab: () => void;
  isGeneratingTab: boolean;
}

const TileGallery: React.FC<TileGalleryProps> = ({ 
  tiles, 
  onDownloadAll,
  enableTabMode,
  selectedTileId,
  onSelectTile,
  onGenerateTab,
  isGeneratingTab,
}) => {
  if (tiles.length === 0) return null;

  return (
    <div className="mt-8 bg-surface rounded-xl p-6 border border-white/10">
      <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4 w-full">
        <div className="w-full">
           <h2 className="text-xl font-bold text-white flex items-center gap-2">Results</h2>
           <p className="text-secondary text-sm">
             已產生 {tiles.length} 張切片
             {enableTabMode && ' - 點擊任一張完成 TAB 選取'}
           </p>
        </div>
        <button
          onClick={onDownloadAll}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20 w-full xl:w-auto justify-center"
        >
          <Archive className="w-4 h-4" />
          Download All (ZIP)
        </button>
        {enableTabMode && (
          <button
            onClick={onGenerateTab}
            disabled={!selectedTileId || isGeneratingTab}
            className="w-full xl:w-auto px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {isGeneratingTab ? '產出中…' : '輸出 96×74 PNG'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {tiles.map((tile) => (
          <div 
            key={tile.id} 
            className={`group relative aspect-square bg-dark rounded-lg overflow-hidden border ${selectedTileId === tile.id ? 'border-amber-400 ring-2 ring-amber-300/60' : 'border-white/10'} ${enableTabMode ? 'cursor-pointer' : ''}`}
            onClick={() => enableTabMode && onSelectTile(tile.id)}
            role={enableTabMode ? 'button' : undefined}
            aria-pressed={enableTabMode && selectedTileId === tile.id}
          >
            <img src={tile.url} alt={`Tile ${tile.row}-${tile.col}`} className="w-full h-full object-contain" />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <a
                href={tile.url}
                download={`${String(tile.sequence).padStart(2, '0')}.png`}
                className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform"
                title="Download this tile"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
            
            <div className="absolute bottom-1 right-1 text-[10px] bg-black/70 text-white px-1.5 rounded pointer-events-none">
                {tile.row + 1}x{tile.col + 1}
            </div>
            {enableTabMode && selectedTileId === tile.id && (
              <div className="absolute top-1 left-1 text-[10px] bg-amber-300 text-black px-1.5 rounded pointer-events-none">
                已選取
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TileGallery;
