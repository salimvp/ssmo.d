import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Grid3x3, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Button from './Button';

const CANVAS_W = 800;
const CANVAS_H = 450;
const GRID_COLS = 9;
const GRID_ROWS = 5;

export default function ImageCropper({ file, imageUrl, onApply, onCancel }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const zoomRef = useRef(1);
  const offsetStateRef = useRef({ x: 0, y: 0 });

  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { offsetStateRef.current = offset; offsetRef.current = offset; }, [offset]);

  // Load image from file or URL
  useEffect(() => {
    const src = file ? URL.createObjectURL(file) : imageUrl;
    if (!src) return;
    const img = new Image();
    // For cross-origin URLs (e.g. Supabase storage), set crossOrigin
    if (imageUrl && imageUrl.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
      const scaleX = CANVAS_W / img.naturalWidth;
      const scaleY = CANVAS_H / img.naturalHeight;
      const fitZoom = Math.max(scaleX, scaleY) * 1.05;
      setZoom(fitZoom);
      zoomRef.current = fitZoom;
      setOffset({ x: 0, y: 0 });
      offsetRef.current = { x: 0, y: 0 };
      offsetStateRef.current = { x: 0, y: 0 };
    };
    img.src = src;
    return () => {
      if (file) URL.revokeObjectURL(src);
    };
  }, [file, imageUrl]);

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

  const getCanvasScale = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 1;
    return canvas.clientWidth / CANVAS_W;
  }, []);

  // Draw loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const z = zoomRef.current;
    const o = offsetStateRef.current;

    const w = img.naturalWidth * z;
    const h = img.naturalHeight * z;
    const dx = (CANVAS_W - w) / 2 + o.x;
    const dy = (CANVAS_H - h) / 2 + o.y;

    ctx.drawImage(img, dx, dy, w, h);

    if (showGrid) {
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.35)';
      ctx.lineWidth = 1;
      const cellW = CANVAS_W / GRID_COLS;
      const cellH = CANVAS_H / GRID_ROWS;
      for (let i = 1; i < GRID_COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(cellW * i, 0);
        ctx.lineTo(cellW * i, CANVAS_H);
        ctx.stroke();
      }
      for (let i = 1; i < GRID_ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, cellH * i);
        ctx.lineTo(CANVAS_W, cellH * i);
        ctx.stroke();
      }
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
  }, [showGrid]);

  useEffect(() => {
    let raf;
    const loop = () => { draw(); raf = requestAnimationFrame(loop); };
    if (imgLoaded) raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [draw, imgLoaded]);

  // ── Pan handlers (scale-aware) ──────────────────────────────────────
  const handleMouseDown = (e) => {
    e.preventDefault();
    const scale = getCanvasScale();
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left) / scale;
    const canvasY = (e.clientY - rect.top) / scale;
    dragStartRef.current = { x: canvasX - offsetRef.current.x, y: canvasY - offsetRef.current.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const scale = getCanvasScale();
    const rect = containerRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left) / scale;
    const canvasY = (e.clientY - rect.top) / scale;
    const nx = canvasX - dragStartRef.current.x;
    const ny = canvasY - dragStartRef.current.y;
    const clamped = clampOffset(nx, ny, zoomRef.current);
    offsetRef.current = clamped;
    offsetStateRef.current = clamped;
    setOffset(clamped);
  };

  const handleMouseUp = () => setIsDragging(false);

  // ── Zoom via wheel ──────────────────────────────────────────────────
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom((prev) => {
      const next = Math.max(0.2, Math.min(5, prev + delta * prev));
      zoomRef.current = next;
      setOffset((o) => {
        const clamped = clampOffset(o.x, o.y, next);
        offsetRef.current = clamped;
        return clamped;
      });
      return next;
    });
  };

  // ── Touch support ───────────────────────────────────────────────────
  const touchRef = useRef({ startDist: 0, startZoom: 1 });

  const getTouchDist = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      touchRef.current.startDist = getTouchDist(e.touches);
      touchRef.current.startZoom = zoomRef.current;
    } else if (e.touches.length === 1) {
      const scale = getCanvasScale();
      setIsDragging(true);
      const rect = containerRef.current.getBoundingClientRect();
      const canvasX = (e.touches[0].clientX - rect.left) / scale;
      const canvasY = (e.touches[0].clientY - rect.top) / scale;
      dragStartRef.current = { x: canvasX - offsetRef.current.x, y: canvasY - offsetRef.current.y };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = getTouchDist(e.touches);
      const scale = dist / touchRef.current.startDist;
      const next = Math.max(0.2, Math.min(5, touchRef.current.startZoom * scale));
      zoomRef.current = next;
      setZoom(next);
      setOffset((o) => {
        const clamped = clampOffset(o.x, o.y, next);
        offsetRef.current = clamped;
        return clamped;
      });
    } else if (e.touches.length === 1 && isDragging) {
      const scale = getCanvasScale();
      const rect = containerRef.current.getBoundingClientRect();
      const canvasX = (e.touches[0].clientX - rect.left) / scale;
      const canvasY = (e.touches[0].clientY - rect.top) / scale;
      const nx = canvasX - dragStartRef.current.x;
      const ny = canvasY - dragStartRef.current.y;
      const clamped = clampOffset(nx, ny, zoomRef.current);
      offsetRef.current = clamped;
      offsetStateRef.current = clamped;
      setOffset(clamped);
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  // ── Reset ───────────────────────────────────────────────────────────
  const handleReset = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const scaleX = CANVAS_W / img.naturalWidth;
    const scaleY = CANVAS_H / img.naturalHeight;
    const fitZoom = Math.max(scaleX, scaleY) * 1.05;
    setZoom(fitZoom);
    zoomRef.current = fitZoom;
    setOffset({ x: 0, y: 0 });
    offsetRef.current = { x: 0, y: 0 };
    offsetStateRef.current = { x: 0, y: 0 };
  };

  // ── Apply crop → export canvas as File ──────────────────────────────
  const handleApply = () => {
    const img = imgRef.current;
    if (!img) return;

    const offscreen = document.createElement('canvas');
    offscreen.width = CANVAS_W;
    offscreen.height = CANVAS_H;
    const ctx = offscreen.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const z = zoomRef.current;
    const o = offsetRef.current;
    const w = img.naturalWidth * z;
    const h = img.naturalHeight * z;
    const dx = (CANVAS_W - w) / 2 + o.x;
    const dy = (CANVAS_H - h) / 2 + o.y;

    ctx.drawImage(img, dx, dy, w, h);

    offscreen.toBlob((blob) => {
      if (!blob) return;
      const ext = (file && file.type === 'image/png') || (imageUrl && imageUrl.endsWith('.png')) ? 'png' : 'jpg';
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
          <h3 className="text-sm font-bold text-white">
            {imageUrl ? 'Reposition Image' : 'Position Image'}
          </h3>
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
          className="relative mx-auto my-4 overflow-hidden rounded-lg border border-dark-border select-none"
          style={{ width: CANVAS_W, height: CANVAS_H, maxWidth: '100%', touchAction: 'none', background: '#ffffff' }}
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
              <div key={i} className={`absolute w-6 h-6 border-accent-light/60 ${pos}`} />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="px-5 pb-5 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setZoom((z) => {
                const next = Math.max(0.2, z - 0.1 * z);
                zoomRef.current = next;
                setOffset((o) => { const c = clampOffset(o.x, o.y, next); offsetRef.current = c; return c; });
                return next;
              })}
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
                zoomRef.current = z;
                setZoom(z);
                setOffset((o) => { const c = clampOffset(o.x, o.y, z); offsetRef.current = c; return c; });
              }}
              className="flex-1 h-1.5 rounded-full appearance-none bg-dark-elevated accent-accent-light cursor-pointer"
            />
            <button
              onClick={() => setZoom((z) => {
                const next = Math.min(5, z + 0.1 * z);
                zoomRef.current = next;
                setOffset((o) => { const c = clampOffset(o.x, o.y, next); offsetRef.current = c; return c; });
                return next;
              })}
              className="p-1.5 rounded bg-dark hover:bg-dark-elevated text-ink-light-muted hover:text-white transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-ink-light-muted w-10 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

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
              <Button type="button" onClick={onCancel} variant="dark" size="sm" icon={false}>
                Cancel
              </Button>
              <Button type="button" onClick={handleApply} variant="darkPrimary" size="sm" icon={false}>
                {imageUrl ? 'Reposition & Save' : 'Apply Crop'}
              </Button>
            </div>
          </div>

          <p className="text-[10px] text-ink-light-muted text-center">
            Click &amp; drag to pan · Scroll wheel or slider to zoom · Grid available via toolbar
          </p>
        </div>
      </div>
    </div>
  );
}
