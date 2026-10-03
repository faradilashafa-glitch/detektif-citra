import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Move,
  AlertCircle,
  Compass,
  MapPin
} from 'lucide-react';

interface ImageViewerProps {
  imageSrc: string | null;
  regionName: string;
  groupNumber: string;
  className?: string;
}

export function ImageViewer({
  imageSrc,
  regionName,
  groupNumber,
  className = ''
}: ImageViewerProps) {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom handlers
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Drag / Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1 && position.x === 0 && position.y === 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-700/60 flex flex-col ${
        isFullscreen ? 'h-screen w-screen rounded-none' : 'min-h-[480px] sm:min-h-[560px]'
      } ${className}`}
    >
      {/* Top Overlay Badge */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/70 text-white text-xs font-medium pointer-events-auto">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-blue-300">Kelompok {groupNumber}:</span>
          <span className="truncate max-w-[240px] sm:max-w-md">{regionName}</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/70 text-xs text-slate-300 pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="font-mono text-[11px] font-semibold text-amber-300">U ↑ (Utara)</span>
          <span className="text-slate-500">|</span>
          <span className="text-[11px] text-slate-400 font-mono">Zoom: {Math.round(scale * 100)}%</span>
        </div>
      </div>

      {/* Main View Area */}
      <div
        className={`flex-1 relative flex items-center justify-center overflow-hidden cursor-${
          scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        } select-none`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {imageSrc ? (
          <div
            className="transition-transform duration-75 origin-center will-change-transform flex items-center justify-center w-full h-full p-4"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
            }}
          >
            <img
              src={imageSrc}
              alt={`Citra Satelit ${regionName}`}
              className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl pointer-events-none"
              draggable={false}
            />
          </div>
        ) : (
          <div className="max-w-md mx-auto p-8 text-center bg-slate-800/80 rounded-2xl border border-slate-700 m-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Citra Wilayah Belum Tersedia
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Citra wilayah kelompok Anda belum tersedia. Silakan hubungi guru.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-700/80 text-xs text-slate-400">
              Guru/operator dapat mengunggah citra resolusi tinggi untuk Kelompok {groupNumber} melalui{' '}
              <span className="text-blue-400 font-semibold">Dashboard Operator → Menu Kelola Citra</span>.
            </div>
          </div>
        )}
      </div>

      {/* Floating Toolbar Controls */}
      {imageSrc && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80 shadow-2xl">
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
            title="Perbesar (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 0.75}
            className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
            title="Perkecil (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-700 mx-1" />
          <button
            type="button"
            onClick={handleResetZoom}
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
            title="Reset Zoom ke 100%"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh (Fullscreen)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Bottom helper tip */}
      {imageSrc && scale > 1 && (
        <div className="absolute bottom-3 left-4 hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/70 px-2.5 py-1 rounded-md backdrop-blur-xs pointer-events-none">
          <Move className="w-3 h-3 text-blue-400" /> Geser kursor untuk menggeser gambar citra
        </div>
      )}
    </div>
  );
}
