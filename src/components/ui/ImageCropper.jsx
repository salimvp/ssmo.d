import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Grid3x3, ZoomIn, ZoomOut, RotateCcw, Check } from 'lucide-react';
import Button from './Button';

const CANVAS_W = 800;
const CANVAS_H = 450;
const GRID_COLS = 9;
const GRID_ROWS = 5;

export default function ImageCropper({ file, onApply, onCancel }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const [constrainDrag, setConstrainDrag] = useState(false);

  // Load image from file
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
      // Auto-fit: scale so the image fills the canvas at minimum
      const scaleX = CANVAS_W / img.naturalWidth;
      const scaleY = CANVAS_H / img.naturalHeight;
      const fitZoom = Math.max(scaleX, scaleY) * 1.05;
      setZoom(fitZoom);
      setOffset({ x: 0, y: 0 });
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Draw loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Draw image
    const w = img.naturalWidth * zoom;
    const h = img.naturalHeight * zoom;
    const dx = (CANVAS_W - w) / 2 + offset.x;
    const dy = (CANVAS_H - h) / 2 + offset.y;

    ctx.drawImage(img, dx, dy, w, h);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.35)';
      ctx.lineWidth = 1;
      const cellW = CANVAS_W / GRID_COLS;
      const cellH = CANVAS_H / GRID_ROWS;

      for (let i = 1; i < GRID_COLS; i++) {
        const x = cellW * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_H);
        ctx.stroke();
      }
      for (let i = 1; i < GRID_ROWS; i++) {
        const y = cellH * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_W, y);
        ctx.stroke();
      }

      // Center crosshair
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(CANVAS_W / 2, 0);
      ctx.lineTo(CANVAS_W / 2, CANVAS_H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_H / 2);
      ctx.lineTo(CANVAS_W, CANVAS_H / 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [zoom, offset, showGrid]);

  useEffect(() => {
    draw();
  }, [draw, imgLoaded]);

  // Clamp offset so the image doesn't leave the canvas entirely
  const clampOffset = useCallback((nx, ny, z) => {
    const img = imgRef.current;
    if (!img) return { x: nx, y: ny };
    const w = img.naturalWidth * z;
    const h = img.naturalHeight * z;
    const maxX = Math.max(0, (w - CANVAS_W) / 2);
    const maxY = Math.max(0, (h - CANVAS_H) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, nx)),
      y: Math.max(-maxY, Math.min(maxY, ny)),
    };
  }, []);

  // Pan handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const nx = e.clientX - dragStart.x;
    const ny = e.clientY - dragStart.y;
    setOffset(clampOffset(nx, ny, zoom));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom via wheel
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom((prev) => {
      const next = Math.max(0.2, Math.min(5, prev + delta * prev));
      setOffset((o) => clampOffset(o.x, o.y, next));
      return next;
    });
  };

  // Touch support
  const touchRef = useRef({ startDist: 0, startZoom: 1, lastX: 0, lastY: 0 });

  const getTouchDist = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      touchRef.current.startDist = getTouchDist(e.touches);
      touchRef.current.startZoom = zoom;
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = getTouchDist(e.touches);
      const scale = dist / touchRef.current.startDist;
      const next = Math.max(0.2, Math.min(5, touchRef.current.startZoom * scale));
      setZoom((prev) => {
        setOffset((o) => clampOffset(o.x, o.y, next));
        return next;
      });
    } else if (e.touches.length === 1 && isDragging) {
      const nx = e.touches[0].clientX - dragStart.x;
      const ny = e.touches[0].clientY - dragStart.y;
      setOffset(clampOffset(nx, ny, zoom));
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Reset
  const handleReset = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const scaleX = CANVAS_W / img.naturalWidth;
    const scaleY = CANVAS_H / img.naturalHeight;
    const fitZoom = Math.max(scaleX, scaleY) * 1.05;
    setZoom(fitZoom);
    setOffset({ x: 0, y: 0 });
  };

  // Apply crop → export canvas as File
  const handleApply = () => {
    const img = imgRef.current;
    if (!img) return;

    const offscreen = document.createElement('canvas');
    offscreen.width = CANVAS_W;
    offscreen.height = CANVAS_H;
    const ctx = offscreen.getContext('2d');

    const w = img.naturalWidth * zoom;
    const h = img.naturalHeight * zoom;
    const dx = (CANVAS_W - w) / 2 + offset.x;
    const dy = (CANVAS_H - h) / 2 + offset.y;

    ctx.drawImage(img, dx, dy, w, h);

    offscreen.toBlob((blob) => {
      if (!blob) return;
      const ext = file.type === 'image/png' ? 'png' : 'jpg';
      const cropped = new File([blob], `cropped_${Date.now()}.${ext}`, {
        type: blob.type || 'image/jpeg',
      });
      onApply(cropped);
    }, 'image/jpeg', 0.92);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-dark-surface border border-dark-border rounded-xl w-full max-w-3xl shadow-dark-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-dark-border">
          <h3 className="text-sm font-bold text-white">Position Image</h3>
          <button
            onClick={onCancel}
            className="p-1 rounded hover:bg-dark-elevated text-ink-light-muted hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas workspace */}
        <div
          ref={containerRef}
          className="relative mx-auto my-4 overflow-hidden rounded-lg bg-dark border border-dark-border select-none"
          style={{ width: CANVAS_W, height: CANVAS_H, maxWidth: '100%', touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="block w-full h-full"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          />

          {/* Corner crop guides */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              'top-0 left-0 border-t-2 border-l-2',
              'top-0 right-0 border-t-2 border-r-2',
              'bottom-0 left-0 border-b-2 border-l-2',
              'bottom-0 right-0 border-b-2 border-r-2',
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute w-6 h-6 border-accent-light/60 ${pos}`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="px-5 pb-5 space-y-4">
          {/* Zoom slider */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setZoom((z) => Math.max(0.2, z - 0.1 * z))}
              className="p-1.5 rounded bg-dark hover:bg-dark-elevated text-ink-light-muted hover:text-white transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min={20}
              max={500}
              value={Math.round(zoom * 100)}
              onChange={(e) => {
                const z = Number(e.target.value) / 100;
                setZoom(z);
                setOffset((o) => clampOffset(o.x, o.y, z));
              }}
              className="flex-1 h-1.5 rounded-full appearance-none bg-dark-elevated accent-accent-light cursor-pointer"
            />
            <button
              onClick={() => setZoom((z) => Math.min(5, z + 0.1 * z))}
              className="p-1.5 rounded bg-dark hover:bg-dark-elevated text-ink-light-muted hover:text-white transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-ink-light-muted w-10 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGrid((g) => !g)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
                  showGrid
                    ? 'bg-accent/20 text-accent-light border border-accent/30'
                    : 'bg-dark hover:bg-dark-elevated text-ink-light-muted border border-dark-border'
                }`}
                title="Toggle alignment grid"
              >
                <Grid3x3 className="w-3.5 h-3.5" />
                Grid
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-md text-[11px] font-semibold flex items-center gap-1.5 bg-dark hover:bg-dark-elevated text-ink-light-muted border border-dark-border transition-colors"
                title="Reset position"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={onCancel}
                variant="dark"
                size="sm"
                icon={false}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleApply}
                variant="darkPrimary"
                size="sm"
                icon={false}
              >
                Apply Crop
              </Button>
            </div>
          </div>

          {/* Instruction hint */}
          <p className="text-[10px] text-ink-light-muted text-center">
            Click &amp; drag to pan · Scroll wheel or slider to zoom · Grid helps with alignment
          </p>
        </div>
      </div>
    </div>
  );
}
