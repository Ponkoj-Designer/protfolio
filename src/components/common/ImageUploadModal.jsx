import React, { useState, useRef, useEffect } from 'react';

export const ImageUploadModal = ({
  isOpen,
  onClose,
  onSave,
  title = "Upload & Crop Image",
  currentImage = "",
  aspectRatio = "4:5" // Default aspect ratio: '4:5', '16:9', '1:1', or 'free'
}) => {
  const [selectedImage, setSelectedImage] = useState(currentImage);
  const [urlInput, setUrlInput] = useState('');
  const [activeSourceTab, setActiveSourceTab] = useState('file');
  const [dragActive, setDragActive] = useState(false);

  // Resize & Crop States
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [targetAspect, setTargetAspect] = useState(aspectRatio);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  useEffect(() => {
    setSelectedImage(currentImage);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setTargetAspect(aspectRatio);
  }, [currentImage, isOpen, aspectRatio]);

  if (!isOpen) return null;

  const handleFileChange = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setZoom(1);
      setPanX(0);
      setPanY(0);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setSelectedImage(urlInput.trim());
      setZoom(1);
      setPanX(0);
      setPanY(0);
    }
  };

  // Mouse Drag to Pan Image
  const handleMouseDown = (e) => {
    if (!selectedImage) return;
    setIsDraggingImage(true);
    setDragStartPos({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e) => {
    if (!isDraggingImage) return;
    setPanX(e.clientX - dragStartPos.x);
    setPanY(e.clientY - dragStartPos.y);
  };

  const handleMouseUp = () => {
    setIsDraggingImage(false);
  };

  const handleResetEditor = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  // HTML5 Canvas Export for Clean Cropped Image
  const handleCropAndSave = () => {
    if (!selectedImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Determine dimensions based on aspect ratio
      let width = 800;
      let height = 1000; // Default 4:5

      if (targetAspect === '16:9') {
        width = 1200;
        height = 675;
      } else if (targetAspect === '1:1') {
        width = 800;
        height = 800;
      } else if (targetAspect === '4:5') {
        width = 800;
        height = 1000;
      } else {
        width = img.width;
        height = img.height;
      }

      canvas.width = width;
      canvas.height = height;

      // Fill canvas background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw transformed image
      ctx.save();
      ctx.translate(width / 2 + panX * (width / 400), height / 2 + panY * (height / 400));
      ctx.scale(zoom, zoom);

      // Calculate aspect ratio cover
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      let renderW, renderH;

      if (imgAspect > canvasAspect) {
        renderH = height;
        renderW = height * imgAspect;
      } else {
        renderW = width;
        renderH = width / imgAspect;
      }

      ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onSave(croppedDataUrl);
      onClose();
    };

    img.onerror = () => {
      // Fallback if CORS prevents canvas export
      onSave(selectedImage);
      onClose();
    };

    img.src = selectedImage;
  };

  const getAspectClass = () => {
    if (targetAspect === '16:9') return 'aspect-[16/9]';
    if (targetAspect === '1:1') return 'aspect-[1/1]';
    if (targetAspect === '4:5') return 'aspect-[4/5]';
    return 'aspect-[4/3]';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface dark:bg-neutral-900 max-w-xl w-full rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl border border-outline-variant dark:border-white/20 animate-fadeIn max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-variant dark:border-white/15 pb-4">
          <h3 className="font-headline-sm text-xl font-bold text-on-surface dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary dark:text-emerald-400">crop</span>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant dark:text-stone-300 hover:text-primary dark:hover:text-white p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Source Tabs */}
        <div className="flex border-b border-surface-variant dark:border-white/15 text-xs font-label-caps font-bold uppercase">
          <button
            onClick={() => setActiveSourceTab('file')}
            className={`pb-2.5 px-4 border-b-2 transition-colors ${
              activeSourceTab === 'file'
                ? 'border-primary dark:border-white text-primary dark:text-white'
                : 'border-transparent text-on-surface-variant dark:text-stone-400'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveSourceTab('url')}
            className={`pb-2.5 px-4 border-b-2 transition-colors ${
              activeSourceTab === 'url'
                ? 'border-primary dark:border-white text-primary dark:text-white'
                : 'border-transparent text-on-surface-variant dark:text-stone-400'
            }`}
          >
            Paste Image URL
          </button>
        </div>

        {/* Tab 1: Drag & Drop File */}
        {activeSourceTab === 'file' && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-secondary dark:border-emerald-400 bg-secondary-container/20 dark:bg-emerald-950/40'
                : 'border-outline-variant dark:border-white/20 hover:border-primary dark:hover:border-white'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              id="editor-file-input"
              onChange={handleInputChange}
              className="hidden"
            />
            <label htmlFor="editor-file-input" className="cursor-pointer space-y-2 block">
              <span className="w-10 h-10 rounded-full bg-surface-container dark:bg-neutral-800 text-primary dark:text-white flex items-center justify-center mx-auto border dark:border-white/10">
                <span className="material-symbols-outlined text-xl">cloud_upload</span>
              </span>
              <div>
                <p className="text-xs font-bold text-on-surface dark:text-white">
                  Click to select or drag & drop a new photo
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Tab 2: URL Input */}
        {activeSourceTab === 'url' && (
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 p-2.5 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-xs text-on-surface dark:text-white placeholder:text-stone-400 focus:outline-none"
            />
            <button
              onClick={handleApplyUrl}
              type="button"
              className="px-4 py-2.5 bg-surface-container dark:bg-neutral-700 text-on-surface dark:text-white rounded font-label-caps text-xs uppercase font-bold"
            >
              Apply
            </button>
          </div>
        )}

        {/* Interactive Crop & Resize Canvas Frame */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-label-caps font-bold uppercase text-on-surface dark:text-stone-200">
              Interactive Crop Editor (Drag image to reposition)
            </span>
            <button
              type="button"
              onClick={handleResetEditor}
              className="text-xs text-secondary dark:text-emerald-400 hover:underline font-label-caps uppercase"
            >
              Reset Zoom & Position
            </button>
          </div>

          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`w-full ${getAspectClass()} rounded-xl overflow-hidden bg-black border-2 border-primary/40 dark:border-emerald-500/50 relative select-none cursor-move flex items-center justify-center shadow-inner`}
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Crop preview"
                draggable={false}
                style={{
                  transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                  transition: isDraggingImage ? 'none' : 'transform 0.1s ease-out'
                }}
                className="max-w-full max-h-full object-contain origin-center"
              />
            ) : (
              <div className="text-center p-6 text-stone-400 space-y-2">
                <span className="material-symbols-outlined text-4xl">crop_original</span>
                <p className="text-xs">Select or upload an image to crop.</p>
              </div>
            )}

            {/* Grid overlay for editorial alignment */}
            <div className="absolute inset-0 border border-white/30 pointer-events-none grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/20"></div>
              <div className="border-r border-b border-white/20"></div>
              <div className="border-b border-white/20"></div>
              <div className="border-r border-b border-white/20"></div>
              <div className="border-r border-b border-white/20"></div>
              <div className="border-b border-white/20"></div>
              <div className="border-r border-white/20"></div>
              <div className="border-r border-white/20"></div>
              <div></div>
            </div>
          </div>
        </div>

        {/* Resize Controls (Zoom Slider & Aspect Presets) */}
        {selectedImage && (
          <div className="space-y-4 bg-surface-container-low dark:bg-neutral-800/80 p-4 rounded-xl border border-outline-variant dark:border-white/15 text-xs">
            {/* Zoom Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-label-caps font-bold uppercase text-on-surface dark:text-stone-200">
                <span>Zoom / Scale Size</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
                  className="w-7 h-7 rounded bg-surface-container dark:bg-neutral-700 text-on-surface dark:text-white font-bold flex items-center justify-center text-sm"
                >
                  -
                </button>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-primary dark:accent-emerald-400 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                  className="w-7 h-7 rounded bg-surface-container dark:bg-neutral-700 text-on-surface dark:text-white font-bold flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Aspect Ratio Presets */}
            <div className="space-y-1 pt-2 border-t border-surface-variant/40 dark:border-white/10">
              <span className="block font-label-caps font-bold uppercase text-on-surface dark:text-stone-200">
                Crop Ratio Preset
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '4:5 (Hero/About)', value: '4:5' },
                  { label: '16:9 (Project)', value: '16:9' },
                  { label: '1:1 (Square Avatar)', value: '1:1' }
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setTargetAspect(preset.value)}
                    className={`px-3 py-1.5 rounded text-[11px] font-label-caps uppercase transition-all ${
                      targetAspect === preset.value
                        ? 'bg-primary text-on-primary dark:bg-white dark:text-black font-bold'
                        : 'bg-surface-container dark:bg-neutral-700 text-on-surface-variant dark:text-stone-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-surface-variant dark:border-white/15">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-outline-variant dark:border-white/20 text-on-surface dark:text-white rounded font-label-caps text-xs uppercase"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropAndSave}
            disabled={!selectedImage}
            className="px-6 py-2.5 bg-primary text-on-primary dark:bg-white dark:text-black font-bold rounded font-label-caps text-xs uppercase disabled:opacity-50 flex items-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined text-sm">crop</span>
            Crop & Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};
