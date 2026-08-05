// G:\ahh-city-booking-app\src\components\MapCanvas.js
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Minus, Maximize2, Upload, Compass, Code, 
  Layers, Info, CheckCircle2, ShieldCheck, MapPin, Eye
} from 'lucide-react';
import { MASTER_SITE_PLAN_JSON, getLayoutFeatures } from '@/lib/sitePlanData';

export default function MapCanvas({
  plots,
  bookings,
  appMode,
  selectedPlotId,
  currentProject,
  onSelectPlot,
  onAddPlot,
  imageSrc,
  onUploadImage,
  imageLoaded,
  setImageLoaded,
  formPreview,
  onOpenJsonModal
}) {
  // Zoom & Pan state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1460, height: 980 });

  // Map Background Mode: 'vector' (Procedural JSON Blueprint - DEFAULT) or 'image' (Uploaded Raster)
  const [mapRenderMode, setMapRenderMode] = useState('vector');

  // Drawing state (Mapper Mode)
  const [drawingActive, setDrawingActive] = useState(false);
  const [drawingType, setDrawingType] = useState(null); // 'rect' or 'poly'
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [currentMouse, setCurrentMouse] = useState(null);

  // Tooltip state
  const [tooltip, setTooltip] = useState({ 
    show: false, 
    plotId: '', 
    status: '', 
    client: '', 
    amount: '', 
    type: '',
    dimensions: '',
    area: '',
    x: 0, 
    y: 0 
  });

  const svgRef = useRef(null);
  const viewportRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Get vector layout structural features
  const layoutFeatures = getLayoutFeatures(MASTER_SITE_PLAN_JSON);

  // Reset view to fit the viewport container
  const resetView = () => {
    if (!viewportRef.current) return;
    
    const vWidth = viewportRef.current.clientWidth;
    const vHeight = viewportRef.current.clientHeight;
    const mWidth = dimensions.width;
    const mHeight = dimensions.height;
    
    const scaleX = vWidth / mWidth;
    const scaleY = vHeight / mHeight;
    const fitScale = Math.min(scaleX, scaleY, 1.2) * 0.95;
    
    setScale(fitScale);
    setTranslate({
      x: (vWidth - mWidth * fitScale) / 2,
      y: (vHeight - mHeight * fitScale) / 2
    });
  };

  useEffect(() => {
    const timer = setTimeout(resetView, 100);
    return () => clearTimeout(timer);
  }, [dimensions]);

  // Adjust zoom via scroll wheel
  const handleWheel = (e) => {
    e.preventDefault();

    const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    const newScale = Math.max(0.1, Math.min(5, scale * zoomFactor));
    
    if (viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      
      setTranslate(prev => ({
        x: cursorX - (cursorX - prev.x) * (newScale / scale),
        y: cursorY - (cursorY - prev.y) * (newScale / scale)
      }));
    }
    setScale(newScale);
  };

  // Zoom click handlers
  const zoomIn = () => setScale(s => Math.min(5, s * 1.25));
  const zoomOut = () => setScale(s => Math.max(0.1, s / 1.25));

  // Mouse Drag / Pan handlers
  const handleMouseDown = (e) => {
    if (drawingActive) return;
    if (e.target.closest('.map-controls') || e.target.closest('.map-legend') || e.target.closest('.plot-tooltip')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - translate.x,
      y: e.clientY - translate.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setTranslate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    if (drawingActive && drawingPoints.length > 0) {
      setCurrentMouse(screenToSVGCoords(e));
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Convert screen coordinates into SVG coordinate scale
  const screenToSVGCoords = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPoint = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    return {
      x: Math.round(svgPoint.x),
      y: Math.round(svgPoint.y)
    };
  };

  // File uploader handler for optional raster overlay
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setDimensions({ width: Math.max(1460, img.naturalWidth), height: Math.max(980, img.naturalHeight) });
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;

    if (onUploadImage) onUploadImage(file);
    setMapRenderMode('image');
  };

  // Click handler on SVG canvas
  const handleCanvasClick = (e) => {
    if (!drawingActive) return;
    
    const coords = screenToSVGCoords(e);
    
    if (drawingType === 'rect') {
      if (drawingPoints.length === 0) {
        setDrawingPoints([coords]);
      } else if (drawingPoints.length === 1) {
        const p1 = drawingPoints[0];
        const p2 = coords;
        
        const polygonPoints = [
          { x: p1.x, y: p1.y },
          { x: p2.x, y: p1.y },
          { x: p2.x, y: p2.y },
          { x: p1.x, y: p2.y }
        ];
        
        finalizePlotDrawing(polygonPoints);
      }
    } else if (drawingType === 'poly') {
      setDrawingPoints([...drawingPoints, coords]);
    }
  };

  const handleCanvasDblClick = () => {
    if (!drawingActive || drawingType !== 'poly') return;
    if (drawingPoints.length < 3) {
      alert('A polygon outline must have at least 3 points.');
      return;
    }
    
    finalizePlotDrawing(drawingPoints);
  };

  const finalizePlotDrawing = (points) => {
    const plotId = prompt('Enter Plot Number (e.g. 88, 12, 120-8, SR-1, C-1):');
    if (!plotId) {
      stopDrawing();
      return;
    }

    const trimmedId = plotId.trim().toUpperCase();
    if (plots.some(p => p.id === trimmedId)) {
      alert(`Plot ${trimmedId} is already mapped.`);
      stopDrawing();
      return;
    }

    onAddPlot(trimmedId, drawingType, points);
    stopDrawing();
  };

  const startDrawing = (type) => {
    setDrawingActive(true);
    setDrawingType(type);
    setDrawingPoints([]);
    setCurrentMouse(null);
  };

  const stopDrawing = () => {
    setDrawingActive(false);
    setDrawingType(null);
    setDrawingPoints([]);
    setCurrentMouse(null);
  };

  // Tooltip triggers
  const handlePlotMouseEnter = (e, plot) => {
    if (drawingActive) return;
    
    const booking = bookings.find(b => b.plotId === plot.id || b.plotId === plot.label);
    let status = 'Available';
    let client = '';
    let relativeInfo = '';
    let cnicInfo = '';
    let paymentInfo = '';
    let amount = '';
    
    if (booking) {
      status = booking.status;
      client = booking.clientName;
      if (booking.relativeName) {
        relativeInfo = `${booking.relationType || 'S/O'} ${booking.relativeName}`;
      }
      cnicInfo = booking.cnic || '';
      paymentInfo = booking.paymentMode || 'Cash';
      amount = `Rs. ${parseInt(booking.paidAmount).toLocaleString()}`;
    } else if (formPreview && formPreview.plotId === plot.id) {
      status = `⏳ Preview: ${formPreview.status}`;
    }

    setTooltip({
      show: true,
      plotId: plot.label || plot.id,
      status,
      client,
      relativeInfo,
      cnicInfo,
      paymentInfo,
      amount,
      type: plot.type || 'Residential',
      dimensions: plot.dimensions || 'Standard',
      area: plot.area || '',
      x: 0,
      y: 0
    });
    handlePlotMouseMove(e);
  };

  const handlePlotMouseMove = (e) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    
    setTooltip(prev => ({
      ...prev,
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top + 15
    }));
  };

  const handlePlotMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  const getPolygonCenter = (points) => {
    if (!points || points.length === 0) return { x: 0, y: 0 };
    let xSum = 0, ySum = 0;
    points.forEach(p => {
      xSum += p.x;
      ySum += p.y;
    });
    return {
      x: xSum / points.length,
      y: ySum / points.length
    };
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && drawingActive) {
        stopDrawing();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawingActive]);

  useEffect(() => {
    if (selectedPlotId && plots.length > 0) {
      const plot = plots.find(p => p.id === selectedPlotId || p.label === selectedPlotId);
      if (plot && viewportRef.current) {
        const center = getPolygonCenter(plot.coords);
        const vWidth = viewportRef.current.clientWidth;
        const vHeight = viewportRef.current.clientHeight;
        
        setScale(1.2);
        setTranslate({
          x: vWidth / 2 - center.x * 1.2,
          y: vHeight / 2 - center.y * 1.2
        });
      }
    }
  }, [selectedPlotId]);

  return (
    <div className="flex flex-col h-full min-h-[550px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative shadow-2xl">
      
      {/* Map Header */}
      <div className="flex flex-wrap justify-between items-center px-6 py-3.5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md z-10 gap-3">
        <div className="flex items-center gap-3">
          {currentProject?.logo ? (
            <img
              src={currentProject.logo}
              alt={currentProject.name}
              className="h-9 w-auto max-w-[140px] rounded-lg object-contain bg-white p-1 border border-slate-700 shadow-md shrink-0"
            />
          ) : (
            <span className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400 text-base font-bold">
              🏛️
            </span>
          )}
          <div>
            <div className="flex items-center gap-2 font-bold text-sm text-white font-outfit">
              <span>{currentProject?.name || 'AHH CITY'} Master Site Plan</span>
              <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800/40 px-2 py-0.5 rounded-md uppercase tracking-wider">
                {currentProject?.survey || 'SURVEY NO 297'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block">
              Interactive Architectural Plot Map • Developer: AHH Brothers
            </span>
          </div>
        </div>
      </div>

      {/* Viewport Canvas container */}
      <div 
        ref={viewportRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-grow w-full relative overflow-hidden bg-[#fdfdfd] cursor-grab select-none active:cursor-grabbing"
      >
        {/* Reserved Site Plan Space Banner for New Projects */}
        {currentProject && currentProject.id !== 'ahh-city' && (
          <div className="absolute top-4 left-6 z-20 px-3.5 py-2 bg-slate-900/90 border border-slate-800/90 rounded-xl backdrop-blur-md text-xs text-slate-200 flex items-center gap-2.5 shadow-lg">
            {currentProject.logo && (
              <img
                src={currentProject.logo}
                alt={currentProject.name}
                className="w-7 h-7 rounded-md object-contain bg-white p-0.5 border border-slate-700 shrink-0"
              />
            )}
            <div>
              <div className="font-bold text-blue-300">
                Reserved Site Plan Canvas — {currentProject.name}
              </div>
              <div className="text-[10.5px] text-slate-400">
                Interactive plot area reserved (same size). Machine-readable SVG/JSON layout can be imported anytime.
              </div>
            </div>
          </div>
        )}
        
        {/* Raster Image Upload banner */}
        {mapRenderMode === 'image' && !imageLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-950/90 z-20 backdrop-blur-sm">
            <div 
              onClick={() => document.getElementById('next-map-file').click()}
              className="border-2 border-dashed border-slate-800 hover:border-blue-500 hover:bg-blue-950/10 p-10 rounded-2xl cursor-pointer max-w-lg transition-all"
            >
              <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3 animate-bounce" />
              <h3 className="text-base font-semibold text-white mb-1">Upload Site Plan Raster Overlay</h3>
              <p className="text-xs text-slate-400 mb-4">
                Optional: Upload an external satellite or government site plan image file (.png, .jpg).
              </p>
              <button className="text-xs text-blue-400 font-semibold underline" onClick={(e) => { e.stopPropagation(); setMapRenderMode('vector'); }}>
                Return to Blueprint JSON Mode
              </button>
            </div>
            <input 
              type="file" 
              id="next-map-file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Drawing guides banner */}
        {drawingActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-purple-600 text-white font-semibold text-xs rounded-full shadow-lg z-30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>
              {drawingType === 'rect' 
                ? 'Drawing Rectangle: Click top-left corner, then click bottom-right corner.'
                : 'Drawing Polygon: Click vertices. Double-click to close and set plot ID.'
              }
            </span>
          </div>
        )}

        {/* Actual Zoom & Pan container wrapper */}
        <div 
          ref={mapContainerRef}
          className="absolute transform-gpu transition-transform duration-75"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: '0 0'
          }}
        >
          {/* SVG MASTER ARCHITECTURAL BLUEPRINT CANVAS */}
          <svg 
            ref={svgRef}
            onClick={handleCanvasClick}
            onDoubleClick={handleCanvasDblClick}
            className="w-full h-full absolute inset-0 select-none z-10"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          >
            <defs>
              <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 0, 0, 0.03)" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Clean White Blueprint Canvas Background */}
            <rect width="100%" height="100%" fill="#ffffff" />
            <rect width="100%" height="100%" fill="url(#gridPattern)" />

            {/* Optional Raster Image Underlay */}
            {mapRenderMode === 'image' && imageLoaded && (
              <image 
                href={imageSrc} 
                x="0" 
                y="0" 
                width="100%" 
                height="100%"
                opacity="0.6"
              />
            )}

            {/* VECTOR MAP STRUCTURE MATCHING BLUEPRINT IMAGE EXACTLY */}
            <g className="vector-master-plan">
              
              {/* Outer Boundary Box */}
              <rect 
                x={layoutFeatures.boundary.x} 
                y={layoutFeatures.boundary.y} 
                width={layoutFeatures.boundary.width} 
                height={layoutFeatures.boundary.height} 
                fill="none" 
                stroke="#000000" 
                strokeWidth="2.5" 
              />

              {/* Master Header Titles */}
              <text x={layoutFeatures.headerTitleX || 280} y="58" fontSize="26" fontWeight="900" fill="#000000" fontFamily="sans-serif" textAnchor="middle">
                AHH CITY
              </text>
              <text x={layoutFeatures.headerSurveyX || 650} y="58" fontSize="26" fontWeight="900" fill="#000000" fontFamily="sans-serif" textAnchor="middle">
                SURVEY NO 297
              </text>

              {/* WATERMARKS */}
              <text x="230" y="260" fontSize="30" fontWeight="bold" fill="rgba(0, 0, 0, 0.06)" transform="rotate(-15 230 260)" letterSpacing="4">
                60 SQYARD
              </text>
              <text x="620" y="260" fontSize="30" fontWeight="bold" fill="rgba(0, 0, 0, 0.06)" transform="rotate(-15 620 260)" letterSpacing="4">
                60 SQYARD
              </text>
              <text x="480" y="760" fontSize="32" fontWeight="bold" fill="rgba(0, 0, 0, 0.06)" transform="rotate(-10 480 760)" letterSpacing="6">
                120 SQYARD
              </text>

              {/* ROADS NETWORK */}
              {layoutFeatures.roads.map((road) => (
                <g key={road.id}>
                  <rect 
                    x={road.x} 
                    y={road.y} 
                    width={road.width} 
                    height={road.height} 
                    fill="none" 
                    stroke="none"
                  />
                  <text 
                    x={road.x + road.width / 2} 
                    y={road.y + road.height / 2 + 1} 
                    fontSize="10" 
                    fontWeight="bold" 
                    fill="#1e293b" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    transform={road.type === 'vertical' ? `rotate(-90 ${road.x + road.width / 2} ${road.y + road.height / 2})` : ''}
                  >
                    {road.name}
                  </text>
                </g>
              ))}

              {/* Vertical 30 FT Roads between 60 SQY column-pairs */}
              {layoutFeatures.vertical30FtRoads.map((road, idx) => (
                <g key={`v30-${idx}`}>
                  {/* Left edge line */}
                  <line x1={road.x} y1={road.y} x2={road.x} y2={road.y + road.height} stroke="#000000" strokeWidth="0.5" strokeDasharray="3 2" />
                  {/* Right edge line */}
                  <line x1={road.x + road.width} y1={road.y} x2={road.x + road.width} y2={road.y + road.height} stroke="#000000" strokeWidth="0.5" strokeDasharray="3 2" />
                  {/* Road label */}
                  <text 
                    x={road.x + road.width / 2} 
                    y={road.y + road.height / 2} 
                    fontSize="8" 
                    fontWeight="bold" 
                    fill="#334155" 
                    textAnchor="middle"
                    transform={`rotate(-90 ${road.x + road.width / 2} ${road.y + road.height / 2})`}
                  >
                    {road.label}
                  </text>
                </g>
              ))}

              {/* AMENITIES ZONES */}
              {layoutFeatures.amenities.map((amenity) => (
                <g key={amenity.id}>
                  <rect 
                    x={amenity.x} 
                    y={amenity.y} 
                    width={amenity.width} 
                    height={amenity.height} 
                    fill="#ffffff" 
                    stroke="#000000" 
                    strokeWidth="2"
                  />
                  {amenity.name.split('\n').map((line, i) => (
                    <text 
                      key={i}
                      x={amenity.x + amenity.width / 2} 
                      y={amenity.y + amenity.height / 2 - (amenity.name.includes('\n') ? 8 - i * 18 : 0)} 
                      fontSize="13" 
                      fontWeight="bold" 
                      fill="#000000" 
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              ))}

              {/* ENTRANCE GRAPHIC (BOTTOM RIGHT) */}
              {layoutFeatures.entrancePos && (
                <g transform={`translate(${layoutFeatures.entrancePos.x}, ${layoutFeatures.entrancePos.y})`}>
                  <text x="0" y="20" fontSize="14" fontWeight="900" fill="#000000">
                    ENTRANCE
                  </text>
                  <path d="M 85 15 L 115 15 M 110 10 L 115 15 L 110 20" fill="none" stroke="#000000" strokeWidth="2.5" />
                </g>
              )}

              {/* RIGHT SIDEBAR — LEGEND & BRANDING matching blueprint image */}
              <g transform={`translate(${layoutFeatures.legendBox.x - 40}, 30)`}>
                
                {/* AHH CITY Tree Logo Header */}
                <g transform="translate(30, 0)">
                  <circle cx="80" cy="35" r="28" fill="#15803d" opacity="0.15" />
                  <text x="80" y="32" fontSize="24" textAnchor="middle">🌳</text>
                  <text x="80" y="70" fontSize="18" fontWeight="900" fill="#15803d" textAnchor="middle">
                    AHH CITY
                  </text>
                </g>

                {/* Dimension Legend Table Box */}
                <g transform="translate(0, 100)">
                  <rect x="0" y="0" width={layoutFeatures.legendBox.width} height={layoutFeatures.legendBox.height} fill="#ffffff" stroke="#000000" strokeWidth="2" />
                  <text x={layoutFeatures.legendBox.width / 2} y="28" fontSize="16" fontWeight="bold" fill="#000000" textAnchor="middle">
                    Dimension
                  </text>
                  <line x1="0" y1="40" x2={layoutFeatures.legendBox.width} y2="40" stroke="#000000" strokeWidth="1.5" />

                  {layoutFeatures.legendBox.items.map((item, idx) => (
                    <g key={`legend-${idx}`} transform={`translate(15, ${62 + idx * 42})`}>
                      <text x="0" y="0" fontSize="11" fontWeight="bold" fill="#000000">
                        {item.name}
                      </text>
                      <text x={layoutFeatures.legendBox.width - 30} y="0" fontSize="11" fontWeight="bold" fill="#000000" textAnchor="end">
                        {item.val}
                      </text>
                    </g>
                  ))}
                </g>

                {/* AHH Brothers Developer Logo */}
                <g transform="translate(20, 560)">
                  <circle cx="80" cy="30" r="20" fill="#ca8a04" opacity="0.15" />
                  <text x="80" y="34" fontSize="18" textAnchor="middle">👑</text>
                  <text x="80" y="72" fontSize="22" fontWeight="900" fill="#b45309" textAnchor="middle" style={{ fontStyle: 'italic' }}>
                    AHH Brothers
                  </text>
                  <text x="80" y="90" fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="middle">
                    BUILDERS & DEVELOPERS
                  </text>
                </g>

              </g>

            </g>

            {/* Temp Drawing shapes in Mapper mode */}
            <g>
              {drawingActive && drawingPoints.length > 0 && (
                drawingType === 'rect' && currentMouse ? (
                  <rect 
                    x={Math.min(drawingPoints[0].x, currentMouse.x)}
                    y={Math.min(drawingPoints[0].y, currentMouse.y)}
                    width={Math.abs(drawingPoints[0].x - currentMouse.x)}
                    height={Math.abs(drawingPoints[0].y - currentMouse.y)}
                    fill="rgba(59, 130, 246, 0.15)"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4"
                  />
                ) : (
                  <>
                    <polyline 
                      points={drawingPoints.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="rgba(59, 130, 246, 0.15)"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    {currentMouse && (
                      <line 
                        x1={drawingPoints[drawingPoints.length - 1].x}
                        y1={drawingPoints[drawingPoints.length - 1].y}
                        x2={currentMouse.x}
                        y2={currentMouse.y}
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                        strokeDasharray="4"
                      />
                    )}
                  </>
                )
              )}
            </g>

            {/* INTERACTIVE PLOTS OVERLAY */}
            <g className="mapped-plots-group">
              {plots.map((plot, idx) => {
                const booking = bookings.find(b => b.plotId === plot.id || b.plotId === plot.label);
                const isPreviewPlot = formPreview && formPreview.plotId === plot.id && !booking;

                let plotClass = 'plot-shape';
                let customStyle = {};

                if (isPreviewPlot) {
                  plotClass += formPreview.status === 'Token Received'
                    ? ' plot-preview-token'
                    : ' plot-preview-booked';
                } else if (booking) {
                  if (booking.status === 'Token Received') {
                    plotClass += ' token-received';
                  } else if (booking.status === 'Booking Received') {
                    plotClass += ' fully-booked';
                  }
                }

                if (selectedPlotId === plot.id || selectedPlotId === plot.label) {
                  plotClass += ' active-selected';
                }

                if (appMode === 'mapper' && !booking) {
                  customStyle = { stroke: 'rgba(168, 85, 247, 0.6)', strokeWidth: '1.5px' };
                }

                const center = getPolygonCenter(plot.coords);
                const isSR = plot.id.startsWith('SR');

                return (
                  <g key={`plot-${plot.id}-${idx}`}>
                    {/* Plot Outline Shape */}
                    <polygon 
                      points={plot.rawCoords}
                      className={plotClass}
                      style={customStyle}
                      onMouseEnter={(e) => handlePlotMouseEnter(e, plot)}
                      onMouseMove={handlePlotMouseMove}
                      onMouseLeave={handlePlotMouseLeave}
                      onClick={() => appMode === 'booking' && onSelectPlot(plot.id)}
                    />
                    
                    {/* SR Highrise Building Icon Styling */}
                    {isSR && (
                      <text
                        x={center.x}
                        y={center.y - 12}
                        fontSize="14px"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ pointerEvents: 'none' }}
                      >
                        🏢
                      </text>
                    )}

                    {/* Plot Label */}
                    <text
                      x={center.x}
                      y={isSR ? center.y + 10 : center.y}
                      fontSize={plot.type?.includes('120') ? '13px' : '11px'}
                      fontWeight="bold"
                      fill={booking ? '#ffffff' : plot.id.startsWith('C-') ? '#b45309' : plot.id.startsWith('SR-') ? '#6b21a8' : '#000000'}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ pointerEvents: 'none' }}
                    >
                      {plot.label || plot.id}
                    </text>
                  </g>
                );
              })}
            </g>

          </svg>
        </div>

        {/* Hover info tooltip */}
        {tooltip.show && (
          <div 
            className="absolute z-30 pointer-events-none p-3.5 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl text-xs flex flex-col gap-1.5 min-w-[170px] text-white backdrop-blur-md"
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
              <span className="text-slate-400 font-medium">Plot Number:</span>
              <span className="font-extrabold text-blue-400 text-sm">{tooltip.plotId}</span>
            </div>
            {tooltip.type && (
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Type:</span>
                <span className="font-semibold text-slate-300">{tooltip.type}</span>
              </div>
            )}
            {tooltip.dimensions && (
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Dimensions:</span>
                <span className="font-semibold text-slate-300">{tooltip.dimensions} ({tooltip.area})</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1 border-t border-slate-800/60">
              <span className="text-slate-400">Status:</span>
              <span className={`font-bold ${
                tooltip.status === 'Booking Received' 
                  ? 'text-emerald-400' 
                  : tooltip.status === 'Token Received' 
                    ? 'text-yellow-400' 
                    : 'text-slate-300'
              }`}>
                {tooltip.status}
              </span>
            </div>
            {tooltip.client && (
              <>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Client:</span>
                  <span className="font-medium text-slate-200">{tooltip.client}</span>
                </div>
                {tooltip.relativeInfo && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Relation:</span>
                    <span className="font-medium text-slate-300">{tooltip.relativeInfo}</span>
                  </div>
                )}
                {tooltip.cnicInfo && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">CNIC:</span>
                    <span className="font-mono text-slate-300">{tooltip.cnicInfo}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Payment:</span>
                  <span className="font-medium text-blue-400">{tooltip.paymentInfo}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Paid:</span>
                  <span className="font-bold text-emerald-400">{tooltip.amount}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Zoom controls panel */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 p-1.5 bg-slate-900/90 border border-slate-800/90 rounded-xl backdrop-blur-md z-20 shadow-lg">
          <button 
            onClick={zoomIn}
            className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 rounded-lg transition-colors cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button 
            onClick={zoomOut}
            className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 rounded-lg transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-5 h-5" />
          </button>
          <button 
            onClick={resetView}
            className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 rounded-lg transition-colors cursor-pointer"
            title="Reset View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Colors Legend panel */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2 px-4 py-3 bg-slate-900/90 border border-slate-800/90 rounded-xl backdrop-blur-md z-20 text-xs text-slate-300 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Map Legend</span>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-white border border-slate-400"></div>
            <span>Available Plot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-yellow-500/50 border border-yellow-400"></div>
            <span>Token Received (Yellow)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-emerald-500/50 border border-emerald-400"></div>
            <span>Booking Received (Green)</span>
          </div>
          {formPreview && (
            <div className="flex items-center gap-2 border-t border-slate-700/60 pt-2 mt-0.5">
              <div className={`w-3.5 h-3.5 rounded border-2 border-dashed ${
                formPreview.status === 'Token Received' ? 'border-yellow-400 bg-yellow-500/20' : 'border-emerald-400 bg-emerald-500/20'
              }`}></div>
              <span className="text-yellow-300 font-semibold">Previewing Plot {formPreview.plotId}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
