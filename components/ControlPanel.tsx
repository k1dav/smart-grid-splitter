import React from 'react';
import { GridConfig } from '../types';
import { Grid3X3, Scissors, Droplets, ArrowUpFromLine, ArrowDownFromLine, ArrowLeftFromLine, ArrowRightFromLine, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  config: GridConfig;
  setConfig: React.Dispatch<React.SetStateAction<GridConfig>>;
  onSplit: () => void;
  isProcessing: boolean;
  hasImage: boolean;
  onRemoveColor: (color: string, tolerance: number) => void;
  isRemovingColor: boolean;
  onResetImage: () => void;
  isModified: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  setConfig,
  onSplit,
  isProcessing,
  hasImage,
  onRemoveColor,
  isRemovingColor,
  onResetImage,
  isModified,
}) => {
  const [targetColor, setTargetColor] = React.useState<string>("#ffffff");
  const [tolerance, setTolerance] = React.useState<number>(15);

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Math.min(50, parseInt(e.target.value) || 1));
    setConfig((prev) => ({ ...prev, rows: val }));
  };

  const handleColChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Math.min(50, parseInt(e.target.value) || 1));
    setConfig((prev) => ({ ...prev, cols: val }));
  };

  const handlePaddingChange = (key: keyof GridConfig['padding'], value: string) => {
    const num = Math.max(0, parseInt(value) || 0);
    setConfig(prev => ({
        ...prev,
        padding: { ...prev.padding, [key]: num }
    }));
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-xl border border-white/10 flex flex-col gap-6 h-fit">
      
      {/* Grid Configuration */}
      <div>
        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-primary" /> Grid Config
        </h2>
        <p className="text-secondary text-sm">Rows and Columns.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-secondary uppercase">Rows</label>
          <input
            type="number"
            value={config.rows}
            onChange={handleRowChange}
            min={1}
            max={50}
            disabled={!hasImage}
            className="bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-secondary uppercase">Cols</label>
          <input
            type="number"
            value={config.cols}
            onChange={handleColChange}
            min={1}
            max={50}
            disabled={!hasImage}
            className="bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[{r: 2, c: 2}, {r: 3, c: 3}, {r: 4, c: 5}, {r: 8, c: 5}].map((preset) => (
            <button
                key={`${preset.r}x${preset.c}`}
                onClick={() => setConfig(prev => ({...prev, rows: preset.r, cols: preset.c}))}
                disabled={!hasImage}
                className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 rounded border border-white/5 text-slate-300 transition-colors disabled:opacity-30"
            >
                {preset.r}x{preset.c}
            </button>
        ))}
      </div>

      <hr className="border-white/10" />

      {/* Padding / Crop Adjustment */}
      <div>
        <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          Adjust Crop (Padding px)
        </h2>
        <div className="grid grid-cols-2 gap-3">
             <div className="flex items-center gap-2">
                <ArrowUpFromLine className="w-4 h-4 text-secondary" />
                <input type="number" placeholder="Top" value={config.padding.top} onChange={(e) => handlePaddingChange('top', e.target.value)} className="w-full bg-dark border border-white/10 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-primary" disabled={!hasImage} />
             </div>
             <div className="flex items-center gap-2">
                <ArrowDownFromLine className="w-4 h-4 text-secondary" />
                <input type="number" placeholder="Bottom" value={config.padding.bottom} onChange={(e) => handlePaddingChange('bottom', e.target.value)} className="w-full bg-dark border border-white/10 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-primary" disabled={!hasImage} />
             </div>
             <div className="flex items-center gap-2">
                <ArrowLeftFromLine className="w-4 h-4 text-secondary" />
                <input type="number" placeholder="Left" value={config.padding.left} onChange={(e) => handlePaddingChange('left', e.target.value)} className="w-full bg-dark border border-white/10 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-primary" disabled={!hasImage} />
             </div>
             <div className="flex items-center gap-2">
                <ArrowRightFromLine className="w-4 h-4 text-secondary" />
                <input type="number" placeholder="Right" value={config.padding.right} onChange={(e) => handlePaddingChange('right', e.target.value)} className="w-full bg-dark border border-white/10 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-primary" disabled={!hasImage} />
             </div>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Color Removal Tool */}
      <div>
         <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-indigo-400" /> Color Removal
         </h2>
         <div className="bg-dark/30 rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs text-secondary">Target Color</label>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white/50">{targetColor}</span>
                    <input 
                        type="color" 
                        value={targetColor}
                        onChange={(e) => setTargetColor(e.target.value)}
                        className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                        disabled={!hasImage}
                    />
                </div>
            </div>
            
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-secondary">
                    <label>Tolerance</label>
                    <span>{tolerance}%</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={tolerance}
                    onChange={(e) => setTolerance(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    disabled={!hasImage}
                />
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onRemoveColor(targetColor, tolerance)}
                    disabled={isRemovingColor || !hasImage}
                    className="flex-1 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-200 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isRemovingColor ? (
                    <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                    ) : <Scissors className="w-3 h-3" />}
                    Remove
                </button>
                
                {isModified && (
                    <button
                        onClick={onResetImage}
                        className="flex-none px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-200 rounded-lg text-sm font-medium transition-all flex items-center justify-center disabled:opacity-50"
                        title="Reset to Original"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                )}
            </div>
         </div>
      </div>

      <hr className="border-white/10" />

      {/* Action */}
      <button
        onClick={onSplit}
        disabled={isProcessing || !hasImage}
        className="w-full py-4 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 transform active:scale-[0.98]"
      >
        <Scissors className="w-5 h-5" />
        {isProcessing ? 'Splitting...' : 'Split Image Now'}
      </button>

    </div>
  );
};

export default ControlPanel;