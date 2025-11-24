import React from 'react';
import { Tile } from '../types';
import { Download, Archive } from 'lucide-react';

interface TileGalleryProps {
  tiles: Tile[];
  onDownloadAll: () => void;
}

const TileGallery: React.FC<TileGalleryProps> = ({ tiles, onDownloadAll }) => {
  if (tiles.length === 0) return null;

  return (
    <div className="mt-8 bg-surface rounded-xl p-6 border border-white/10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="text-xl font-bold text-white">Results</h2>
           <p className="text-secondary text-sm">You have generated {tiles.length} tiles.</p>
        </div>
        <button
          onClick={onDownloadAll}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20"
        >
          <Archive className="w-4 h-4" />
          Download All (ZIP)
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {tiles.map((tile) => (
          <div key={tile.id} className="group relative aspect-square bg-dark rounded-lg overflow-hidden border border-white/10">
            <img src={tile.url} alt={`Tile ${tile.row}-${tile.col}`} className="w-full h-full object-contain" />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <a
                href={tile.url}
                download={`${String(tile.sequence).padStart(2, '0')}.png`}
                className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform"
                title="Download this tile"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
            
            <div className="absolute bottom-1 right-1 text-[10px] bg-black/70 text-white px-1.5 rounded pointer-events-none">
                {tile.row + 1}x{tile.col + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TileGallery;
