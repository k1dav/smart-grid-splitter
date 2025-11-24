import React, { useState, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import { GridConfig, Tile } from './types';
import ImagePreview from './components/ImagePreview';
import ControlPanel from './components/ControlPanel';
import TileGallery from './components/TileGallery';
import { splitImage, downloadAllTiles, removeColorFromImage, downloadTabTile } from './utils/imageUtils';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [config, setConfig] = useState<GridConfig>({ 
    rows: 4, 
    cols: 6,
    padding: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRemovingColor, setIsRemovingColor] = useState(false);
  const [isGeneratingTab, setIsGeneratingTab] = useState(false);
  const [generateTabMode, setGenerateTabMode] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const result = e.target.result as string;
          setImageSrc(result);
          setOriginalImageSrc(result);
          setTiles([]); // Reset tiles on new image
          setSelectedTileId(null);
          // Reset padding on new image
          setConfig(prev => ({...prev, padding: { top: 0, right: 0, bottom: 0, left: 0 }}));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSplit = useCallback(async () => {
    if (!imageSrc) return;
    
    setIsProcessing(true);
    try {
      // Small delay to allow UI to update
      setTimeout(async () => {
        const generatedTiles = await splitImage(imageSrc, config);
        setTiles(generatedTiles);
        setSelectedTileId(null);
        setIsProcessing(false);
        
        // Scroll to results
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Split error:", error);
      alert("Failed to split image. Please try again.");
      setIsProcessing(false);
    }
  }, [imageSrc, config]);

  const handleColorRemoval = async (targetColor: string, tolerance: number) => {
    if (!imageSrc) return;

    setIsRemovingColor(true);
    try {
        const newImageBase64 = await removeColorFromImage(imageSrc, targetColor, tolerance);
        setImageSrc(newImageBase64);
        setTiles([]); // Reset split results since source changed
    } catch (error) {
        console.error("Color removal failed", error);
        alert("Failed to remove color.");
    } finally {
        setIsRemovingColor(false);
    }
  };

  const handleResetImage = () => {
    if (originalImageSrc) {
      setImageSrc(originalImageSrc);
      setTiles([]);
    }
  };

  const handleDownloadAll = () => {
    if (tiles.length > 0) {
      downloadAllTiles(tiles);
    }
  };

  const handleToggleTabMode = (checked: boolean) => {
    setGenerateTabMode(checked);
    if (!checked) {
      setSelectedTileId(null);
    }
  };

  const handleTileSelect = (tileId: string) => {
    if (!generateTabMode) return;
    setSelectedTileId(prev => prev === tileId ? null : tileId);
  };

  const handleGenerateTab = async () => {
    if (!generateTabMode || !selectedTileId) return;
    const targetTile = tiles.find(tile => tile.id === selectedTileId);
    if (!targetTile) return;

    setIsGeneratingTab(true);
    try {
      const paddedName = String(targetTile.sequence).padStart(2, '0');
      await downloadTabTile(targetTile, 96, 74, `${paddedName}_tab.png`);
    } catch (error) {
      console.error("Tab generation error:", error);
      alert("產生 TAB 檔失敗，請再試一次。");
    } finally {
      setIsGeneratingTab(false);
    }
  };

  const isModified = imageSrc !== originalImageSrc;

  return (
    <div className="min-h-screen bg-dark p-4 md:p-8 max-w-7xl mx-auto font-sans">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          極致切圖：靈動網格大師
        </h1>
        <p className="text-secondary mt-2">Professional Grid Splitting with Image Tools.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Controls */}
        <aside className="lg:col-span-4 space-y-6">
            {/* File Uploader Area */}
            <div className="bg-surface border border-dashed border-secondary/50 rounded-xl p-6 text-center transition-colors hover:border-primary group relative overflow-hidden">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-dark rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <p className="text-white font-medium">Click to Upload Image</p>
                        <p className="text-secondary text-xs mt-1">JPG, PNG, WEBP supported</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <ControlPanel 
                config={config}
                setConfig={setConfig}
                onSplit={handleSplit}
                isProcessing={isProcessing}
                hasImage={!!imageSrc}
                onRemoveColor={handleColorRemoval}
                isRemovingColor={isRemovingColor}
                onResetImage={handleResetImage}
                isModified={isModified}
                generateTabMode={generateTabMode}
                onToggleTabMode={handleToggleTabMode}
            />
        </aside>

        {/* Right Column: Preview */}
        <section className="lg:col-span-8 bg-surface rounded-xl border border-white/10 overflow-hidden h-[500px] md:h-[700px] relative">
             <ImagePreview imageSrc={imageSrc} gridConfig={config} />
        </section>
      </main>

      {/* Results Section */}
      <TileGallery 
          tiles={tiles} 
          onDownloadAll={handleDownloadAll} 
          enableTabMode={generateTabMode}
          selectedTileId={selectedTileId}
          onSelectTile={handleTileSelect}
          onGenerateTab={handleGenerateTab}
          isGeneratingTab={isGeneratingTab}
      />
    </div>
  );
};

export default App;