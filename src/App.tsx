import React from 'react';
import { Sparkles, X, Loader2, Undo2, Redo2, Pencil, Check, Keyboard, Wand2 } from 'lucide-react';
import { useVideoEditor } from '@/hooks/useVideoEditor';
import { Dropzone } from '@/components/Dropzone';
import { VideoStage } from '@/components/VideoStage';
import { RotationControls } from '@/components/RotationControls';
import { Timeline } from '@/components/Timeline';
import { ExportBar } from '@/components/ExportBar';
import { VideoWallPicker } from '@/components/VideoWallPicker';
import { formatBytes, formatTimePrecise } from '@/lib/format';

function App() {
  const editor = useVideoEditor();
  const {
    videoRef,
    imageRef,
    status,
    error,
    objectUrl,
    meta,
    rotation,
    flip,
    trim,
    currentTime,
    isPlaying,
    exportFormat,
    exportProgress,
    exportUrl,
    exportName,
    volume,
    isMuted,
    playbackSpeed,
    canUndo,
    canRedo,
    loadFile,
    reset,
    rotate,
    resetRotation,
    toggleFlipHorizontal,
    toggleFlipVertical,
    setTrim,
    commitTrim,
    setExportFormat,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackSpeed,
    undo,
    redo,
    exportCurrent,
    cancelExport,
    clearExport,
    renameFile,
    wallLayout,
    setWallLayout,
    thumbnails,
    isRemovingBackground,
    bgRemovalProgress,
    removeBackground,
    videoQuality,
    videoResolution,
    setVideoQuality,
    setVideoResolution,
  } = editor;

  const isImage = meta?.type === 'image';

  // Inline filename editing state
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [draftName, setDraftName] = React.useState('');
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  const startEditingName = () => {
    if (!meta) return;
    setDraftName(meta.name);
    setIsEditingName(true);
    // Focus after render
    setTimeout(() => nameInputRef.current?.select(), 0);
  };

  const commitEditingName = () => {
    renameFile(draftName);
    setIsEditingName(false);
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
  };

  const showEditor = status === 'ready' || status === 'exporting' || status === 'exported';

  // Global Keyboard Shortcuts
  React.useEffect(() => {
    if (!showEditor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'r' || e.key === 'R') {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          rotate(90);
        }
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'z' || e.key === 'Z') {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          if (e.shiftKey) {
            if (canRedo) redo();
          } else {
            if (canUndo) undo();
          }
        }
      } else if (e.key === 'y' || e.key === 'Y') {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          if (canRedo) redo();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seek(currentTime - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seek(currentTime + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEditor, togglePlay, rotate, toggleMute, canUndo, canRedo, undo, redo, seek, currentTime]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-900/90 border border-slate-800 p-1 shadow-sm">
              <img src={`${import.meta.env.BASE_URL}Logo Mi Gusto 2025.png`} alt="ScreenFlow Logo" className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-bold tracking-tight text-white sm:text-base">
                ScreenFlow
              </h1>
              <p className="hidden text-xs text-slate-400 sm:block">
                {isImage ? 'Editor de imagen para pantallas de la marca' : 'Editor de video para pantallas de la marca'}
              </p>
            </div>
          </div>
          {showEditor && (
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-300 transition hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Deshacer (Ctrl+Z)"
              >
                <Undo2 size={15} />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-300 transition hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Rehacer (Ctrl+Y)"
              >
                <Redo2 size={15} />
              </button>
              <span className="mx-1 h-5 w-px bg-slate-800" />
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
              >
                <X size={14} />
                {isImage ? 'Nueva imagen' : 'Nuevo video'}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {status === 'idle' && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400">
                <Sparkles size={13} />
                100% en tu navegador · sin subir nada a un servidor
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Rotaté, cortá y descargá tu contenido
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                Subí un video o imagen, corregí la orientación, recortá el tramo que quieras conservar y
                exportálo en alta calidad.
              </p>
            </div>
            <Dropzone onFile={loadFile} />
          </div>
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
            <Loader2 size={32} className="animate-spin text-sky-500" />
            <p className="text-sm font-medium">Cargando archivo…</p>
          </div>
        )}

        {status === 'error' && !showEditor && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 rounded-lg border border-rose-800 bg-rose-950/40 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
            <Dropzone onFile={loadFile} />
          </div>
        )}

        {showEditor && meta && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Preview + timeline */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <VideoStage
                videoRef={videoRef}
                imageRef={imageRef}
                objectUrl={objectUrl}
                rotation={rotation}
                flip={flip}
                isPlaying={isPlaying}
                mediaType={meta?.type}
                wallLayout={wallLayout}
                onTogglePlay={togglePlay}
              />
              {!isImage && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-5">
                <Timeline
                  duration={meta.duration}
                  trim={trim}
                  currentTime={currentTime}
                  isPlaying={isPlaying}
                  onTrimChange={setTrim}
                  onTrimCommit={commitTrim}
                  onSeek={seek}
                  onTogglePlay={togglePlay}
                  volume={volume}
                  isMuted={isMuted}
                  onVolumeChange={setVolume}
                  onToggleMute={toggleMute}
                  thumbnails={thumbnails}
                />
              </div>
              )}

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-5">
                <h3 className="mb-3 text-sm font-semibold text-slate-200">Detalles</h3>
                <dl className="space-y-2 text-sm">
                  <div className="group flex justify-between gap-2">
                    <dt className="shrink-0 text-slate-400">Archivo</dt>
                    <dd className="flex min-w-0 items-center gap-1.5 font-medium text-slate-200">
                      {isEditingName ? (
                        <>
                          <input
                            ref={nameInputRef}
                            autoFocus
                            type="text"
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') commitEditingName();
                              if (e.key === 'Escape') cancelEditingName();
                            }}
                            className="w-full min-w-0 truncate rounded-md border border-sky-500 bg-slate-800 px-2 py-0.5 text-sm text-slate-100 outline-none ring-1 ring-sky-500/60 focus:ring-sky-400"
                          />
                          <button
                            onClick={commitEditingName}
                            title="Confirmar nombre"
                            className="shrink-0 rounded p-0.5 text-sky-400 transition hover:bg-sky-500/20"
                          >
                            <Check size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="truncate" title={meta.name}>{meta.name}</span>
                          <button
                            onClick={startEditingName}
                            title="Renombrar archivo"
                            className="shrink-0 rounded p-0.5 text-slate-400 transition hover:bg-slate-700 hover:text-slate-200"
                          >
                            <Pencil size={12} />
                          </button>
                        </>
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Tipo de archivo</dt>
                    <dd className="font-medium text-slate-200 capitalize">
                      {isImage ? 'Imagen' : 'Video'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Resolución</dt>
                    <dd className="font-medium text-slate-200">
                      {meta.width}×{meta.height}
                    </dd>
                  </div>
                  {!isImage && (
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Duración</dt>
                    <dd className="font-medium text-slate-200">
                      {formatTimePrecise(meta.duration)}
                    </dd>
                  </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Tamaño</dt>
                    <dd className="font-medium text-slate-200">{formatBytes(meta.size)}</dd>
                  </div>
                </dl>
              </div>

              {/* Bottom Row: Keyboard Shortcuts + AI Background Removal */}
              <div className={`grid gap-5 items-stretch ${isImage ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Keyboard Shortcuts Hint Card */}
                <div className="flex flex-col justify-start gap-2.5 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2 font-semibold text-slate-300 text-xs">
                    <Keyboard size={16} className="text-sky-400" />
                    <span>Atajos de teclado</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1">
                    {!isImage && (
                      <span><kbd className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-200">Espacio</kbd> Play/Pausa</span>
                    )}
                    <span><kbd className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-200">R</kbd> Rotar 90°</span>
                    {!isImage && (
                      <span><kbd className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-200">M</kbd> Mute</span>
                    )}
                    <span><kbd className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-200">Ctrl+Z</kbd> Deshacer</span>
                    {!isImage && (
                      <span><kbd className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-200">← / →</kbd> Seek 1s</span>
                    )}
                  </div>
                </div>

                {/* AI Background Removal - only for images */}
                {isImage && (
                  <div className="rounded-2xl border border-sky-900/50 bg-slate-900 p-4 shadow-sm relative overflow-hidden flex flex-col justify-between gap-3">
                    <div>
                      <div className="mb-1.5">
                        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                          <Sparkles size={16} className="text-sky-400" />
                          Remoción de Fondo con IA
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Eliminá el fondo de tu imagen automáticamente conservando la silueta principal en formato PNG transparente.
                      </p>
                    </div>
                    <button
                      onClick={removeBackground}
                      disabled={isRemovingBackground}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all active:scale-[0.98] ${
                        isRemovingBackground
                          ? 'border-sky-500/40 bg-sky-500/20 text-sky-300 cursor-not-allowed'
                          : 'border-sky-500/40 bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-sky-500/15 text-sky-200 hover:border-sky-400 hover:bg-sky-500/25 hover:text-white shadow-sm'
                      }`}
                    >
                      {isRemovingBackground ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-sky-400" />
                          <span>
                            {bgRemovalProgress > 0
                              ? `Procesando IA (${Math.round(bgRemovalProgress * 100)}%)…`
                              : 'Analizando imagen con IA…'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Wand2 size={16} className="text-sky-400" />
                          <span>Quitar fondo a la imagen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-5">
                <RotationControls
                  rotation={rotation}
                  flip={flip}
                  originalWidth={meta.width}
                  originalHeight={meta.height}
                  onRotate={rotate}
                  onFlipHorizontal={toggleFlipHorizontal}
                  onFlipVertical={toggleFlipVertical}
                  onReset={resetRotation}
                />
              </div>


              {/* Speed control - only for video */}
              {!isImage && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-5">
                <h3 className="mb-3 text-sm font-semibold text-slate-200">Velocidad de Reproducción</h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0.25, 0.5, 1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`rounded-lg py-1.5 text-xs font-semibold transition active:scale-95 ${
                        playbackSpeed === speed
                          ? 'bg-sky-500 text-white'
                          : 'border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
              )}

              <VideoWallPicker
                value={wallLayout}
                mediaType={meta?.type}
                onChange={setWallLayout}
              />

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-5">
                <ExportBar
                  status={status}
                  progress={exportProgress}
                  exportFormat={exportFormat}
                  exportUrl={exportUrl}
                  exportName={exportName}
                  error={error}
                  mediaType={meta?.type}
                  videoQuality={videoQuality}
                  videoResolution={videoResolution}
                  onFormatChange={setExportFormat}
                  onQualityChange={setVideoQuality}
                  onResolutionChange={setVideoResolution}
                  onExport={exportCurrent}
                  onCancel={cancelExport}
                  onDismiss={clearExport}
                />

              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 pt-2 text-center text-xs text-slate-600 sm:px-6">
        ScreenFlow — el contenido se procesa localmente en tu navegador.
      </footer>
    </div>
  );
}

export default App;
