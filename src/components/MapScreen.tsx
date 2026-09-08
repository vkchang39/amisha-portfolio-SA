"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppReady } from "@/context/AppReadyContext";
import { useGameUi } from "@/context/GameUiContext";
import { MAP_LOCATIONS } from "@/lib/mapLocations";
import { withBasePath } from "@/lib/basePath";
import { useGameAudio } from "@/hooks/useGameAudio";

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;

export function MapScreen() {
  const { isAppReady } = useAppReady();
  const { mapOpen, closeMap, navigateToSection, activeSection } = useGameUi();
  const { play } = useGameAudio();
  const dialogRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(
    null
  );
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);

  const clampPan = useCallback((nextPan: { x: number; y: number }, nextZoom: number) => {
    const maxOffset = 120 * (nextZoom - 1);
    return {
      x: Math.max(-maxOffset, Math.min(maxOffset, nextPan.x)),
      y: Math.max(-maxOffset, Math.min(maxOffset, nextPan.y)),
    };
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.12 : 0.12;
      setZoom((z) => {
        const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta));
        setPan((p) => clampPan(p, next));
        return next;
      });
    },
    [clampPan]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      viewportRef.current?.setPointerCapture(e.pointerId);
      dragRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    },
    [pan]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      setPan(
        clampPan(
          { x: dragRef.current.panX + dx, y: dragRef.current.panY + dy },
          zoom
        )
      );
    },
    [clampPan, zoom]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragRef.current = null;
    viewportRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const [a, b] = [e.touches[0], e.touches[1]];
        const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        pinchRef.current = { distance, zoom };
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        dragRef.current = {
          x: t.clientX,
          y: t.clientY,
          panX: pan.x,
          panY: pan.y,
        };
      }
    },
    [pan, zoom]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current) {
        const [a, b] = [e.touches[0], e.touches[1]];
        const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        const scale = distance / pinchRef.current.distance;
        const next = Math.max(
          MIN_ZOOM,
          Math.min(MAX_ZOOM, pinchRef.current.zoom * scale)
        );
        setZoom(next);
        setPan((p) => clampPan(p, next));
      } else if (e.touches.length === 1 && dragRef.current) {
        const t = e.touches[0];
        const dx = t.clientX - dragRef.current.x;
        const dy = t.clientY - dragRef.current.y;
        setPan(
          clampPan(
            { x: dragRef.current.panX + dx, y: dragRef.current.panY + dy },
            zoom
          )
        );
      }
    },
    [clampPan, zoom]
  );

  const onTouchEnd = useCallback(() => {
    dragRef.current = null;
    pinchRef.current = null;
  }, []);

  useEffect(() => {
    if (!mapOpen) {
      previousFocus.current?.focus();
      return;
    }

    const frame = requestAnimationFrame(() => {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    });
    previousFocus.current = document.activeElement as HTMLElement;
    dialogRef.current?.focus();

    return () => cancelAnimationFrame(frame);
  }, [mapOpen]);

  useEffect(() => {
    if (!isAppReady || !mapOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMap();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAppReady, mapOpen, closeMap]);

  if (!isAppReady || !mapOpen) return null;

  return (
    <div
      className="map-screen-backdrop"
      role="presentation"
      onClick={closeMap}
    >
      <div
        ref={dialogRef}
        className="map-screen"
        role="dialog"
        aria-modal="true"
        aria-label="San Andreas map"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="map-screen-header">
          <p className="gta-title text-sand text-2xl md:text-3xl">Map</p>
          <button
            type="button"
            className="map-screen-close"
            onClick={closeMap}
            aria-label="Close map"
          >
            ✕
          </button>
        </div>

        <div className="map-screen-controls">
          <button
            type="button"
            className="map-screen-control-btn"
            aria-label="Zoom in"
            onClick={() =>
              setZoom((z) => Math.min(MAX_ZOOM, z + 0.25))
            }
          >
            +
          </button>
          <button
            type="button"
            className="map-screen-control-btn"
            aria-label="Zoom out"
            onClick={() =>
              setZoom((z) => Math.max(MIN_ZOOM, z - 0.25))
            }
          >
            −
          </button>
          <button
            type="button"
            className="map-screen-control-btn map-screen-control-reset"
            onClick={resetView}
          >
            Reset
          </button>
        </div>

        <div className="map-screen-body">
          <div
            ref={viewportRef}
            className="map-screen-viewport"
            onWheel={handleWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              ref={layerRef}
              className="map-screen-canvas"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              }}
            >
              <Image
                src={withBasePath("/images/map-sa.svg")}
                alt=""
                fill
                className="object-contain opacity-90"
                aria-hidden
                draggable={false}
              />
              {MAP_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  className={`map-blip map-blip-${loc.type} ${
                    activeSection === loc.sectionId ? "map-blip-active" : ""
                  }`}
                  style={{
                    left: `${loc.x}%`,
                    top: `${loc.y}%`,
                    transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                  }}
                  aria-label={`Go to ${loc.label}`}
                  onClick={() => {
                    play("menuSelect");
                    navigateToSection(loc.sectionId);
                  }}
                >
                  <span className="map-blip-icon" aria-hidden />
                  <span className="map-blip-label">{loc.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="map-screen-legend meta-subtle text-xs mt-4 tracking-[0.1em]">
          Yellow = missions · Green = save · Blue = skills · Drag to pan · Scroll to zoom
        </p>
      </div>
    </div>
  );
}
