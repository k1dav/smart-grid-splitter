import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { Tile, GridConfig } from '../types';

export const splitImage = async (
  imageSrc: string, 
  config: GridConfig
): Promise<Tile[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;
    
    img.onload = () => {
      const tiles: Tile[] = [];
      const { rows, cols, padding } = config;
      
      // Ensure rows/cols are at least 1
      const safeRows = Math.max(1, rows);
      const safeCols = Math.max(1, cols);

      // Calculate the active area dimensions
      const activeWidth = Math.max(1, img.width - padding.left - padding.right);
      const activeHeight = Math.max(1, img.height - padding.top - padding.bottom);

      // Calculate individual tile size based on the active area
      const tileWidth = Math.floor(activeWidth / safeCols);
      const tileHeight = Math.floor(activeHeight / safeRows);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = tileWidth;
      canvas.height = tileHeight;

      let completed = 0;
      const total = safeRows * safeCols;

      for (let r = 0; r < safeRows; r++) {
        for (let c = 0; c < safeCols; c++) {
          // Clear canvas for new tile
          ctx.clearRect(0, 0, tileWidth, tileHeight);
          
          // Calculate source position (offset by padding)
          const srcX = padding.left + (c * tileWidth);
          const srcY = padding.top + (r * tileHeight);

          // Draw specific slice
          ctx.drawImage(
            img,
            srcX,          // Source x
            srcY,          // Source y
            tileWidth,     // Source width
            tileHeight,    // Source height
            0,             // Dest x
            0,             // Dest y
            tileWidth,     // Dest width
            tileHeight     // Dest height
          );

          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) {
              tiles.push({
                id: `tile_${r}_${c}`,
                url: URL.createObjectURL(blob),
                blob: blob,
                row: r,
                col: c,
                width: tileWidth,
                height: tileHeight
              });
            }
            
            completed++;
            if (completed === total) {
              // Sort tiles by position (row-major)
              tiles.sort((a, b) => {
                 if (a.row === b.row) return a.col - b.col;
                 return a.row - b.row;
              });
              resolve(tiles);
            }
          }, 'image/png', 1.0); // Use PNG to preserve transparency if present
        }
      }
    };

    img.onerror = (err) => reject(err);
  });
};

export const downloadAllTiles = async (tiles: Tile[], baseName: string = 'split_image') => {
  const zip = new JSZip();
  const folder = zip.folder("tiles");

  if (folder) {
    tiles.forEach((tile) => {
      // Use png for transparency support
      const filename = `${baseName}_row${tile.row + 1}_col${tile.col + 1}.png`;
      folder.file(filename, tile.blob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(content, `${baseName}_tiles.zip`);
  }
};

/**
 * Removes a specific color from an image within a tolerance range.
 * This is done client-side using Canvas manipulation.
 */
export const removeColorFromImage = (
  imageSrc: string,
  targetHexColor: string,
  tolerance: number = 20
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert hex to RGB
      const rTarget = parseInt(targetHexColor.slice(1, 3), 16);
      const gTarget = parseInt(targetHexColor.slice(3, 5), 16);
      const bTarget = parseInt(targetHexColor.slice(5, 7), 16);

      // Simple Euclidean distance or Manhattan distance
      // Here we use a simplified distance check relative to tolerance (0-100)
      // Tolerance of 0 means exact match. 100 means almost everything.
      // Max Euclidean distance in RGB is sqrt(255^2 * 3) ~ 441.
      const maxDist = 441;
      const threshold = (tolerance / 100) * maxDist;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // data[i+3] is alpha

        const dist = Math.sqrt(
          Math.pow(r - rTarget, 2) +
          Math.pow(g - gTarget, 2) +
          Math.pow(b - bTarget, 2)
        );

        if (dist <= threshold) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = (err) => reject(err);
  });
};
