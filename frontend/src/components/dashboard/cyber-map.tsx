"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Map, { Marker as MapMarker } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MapStore } from "@/lib/types/map-store";
import { useTheme } from "@/providers/theme-provider";
import { COUNTRIES, COUNTRY_VIEWS, WORLD_VIEW } from "@/lib/utils/constants";

const MAP_THEMES = {
  dark: {
    bg:           "#050a14",
    gridColor:    "rgba(0,212,255,0.03)",
    labelPrimary: "#e0f0ff",
    labelAccent:  "#00d4ff",
    legendBg:     "rgba(5,10,20,0.7)",
    legendBorder: "rgba(0,212,255,0.15)",
    legendLabel:  "#8ab4d4",
    liveColor:    "#00d4ff",
    fadeColor:    "#050a14",
    mapStyle:     "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  },
  light: {
    bg:           "#e8f2fb",
    gridColor:    "rgba(0,100,200,0.05)",
    labelPrimary: "#0d2a4a",
    labelAccent:  "#1a6eb5",
    legendBg:     "rgba(220,238,255,0.85)",
    legendBorder: "rgba(0,100,200,0.2)",
    legendLabel:  "#1a4a7a",
    liveColor:    "#1a6eb5",
    fadeColor:    "#e8f2fb",
    mapStyle:     "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  },
} as const;

function getMarkerColor(store: MapStore): string {
  if (store.hasError) return "#ff3366";
  if (store.hasPowerOff) return "#ffaa00";
  return "#00ff88";
}

function getStatusLabel(store: MapStore): string {
  if (store.hasError) return "에러";
  if (store.hasPowerOff) return "전원 OFF";
  return "정상";
}

type TooltipState = {
  store: MapStore;
  x: number;
  y: number;
} | null;

function CyberTooltip({ tooltip }: { tooltip: NonNullable<TooltipState> }) {
  const color = getMarkerColor(tooltip.store);
  return (
    <div
      className="pointer-events-none fixed z-50 select-none"
      style={{ left: tooltip.x + 12, top: tooltip.y - 12 }}
    >
      <div
        className="rounded border px-3 py-2 text-xs font-mono shadow-lg"
        style={{
          background: "rgba(5, 10, 20, 0.95)",
          borderColor: color,
          boxShadow: `0 0 12px ${color}40`,
          color: "#e0f0ff",
          minWidth: 160,
        }}
      >
        <p className="font-bold truncate max-w-[200px]" style={{ color }}>
          {tooltip.store.store_name}
        </p>
        {tooltip.store.address && (
          <p className="mt-0.5 opacity-60 truncate max-w-[200px]">
            {tooltip.store.address}
          </p>
        )}
        <p className="mt-1" style={{ color }}>
          ● {getStatusLabel(tooltip.store)}
        </p>
        <p className="mt-1 opacity-40 text-[10px]">클릭하여 매장 상세 이동</p>
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  labelColor,
}: {
  color: string;
  label: string;
  labelColor: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block rounded-full"
        style={{
          width: 8,
          height: 8,
          background: color,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
      <span className="text-[11px] font-mono" style={{ color: labelColor }}>
        {label}
      </span>
    </div>
  );
}

function CyberCountrySelect({
  value,
  onChange,
  t,
}: {
  value: string;
  onChange: (code: string) => void;
  t: typeof MAP_THEMES[keyof typeof MAP_THEMES];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const current = value ? COUNTRIES.find((c) => c.code === value) : null;

  const itemStyle = (isSelected: boolean): React.CSSProperties => ({
    width: "100%",
    textAlign: "left",
    background: isSelected ? `${t.labelAccent}1a` : "transparent",
    border: "none",
    color: isSelected ? t.labelAccent : t.legendLabel,
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: "0.06em",
    padding: "5px 10px",
    cursor: "pointer",
    display: "block",
    whiteSpace: "nowrap",
  });

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 160 }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          background: t.legendBg,
          border: `1px solid ${t.legendBorder}`,
          borderRadius: 4,
          color: t.labelAccent,
          fontFamily: "monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
          padding: "5px 8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          boxShadow: open ? `0 0 8px ${t.labelAccent}30` : "none",
          transition: "box-shadow 0.15s",
        }}
      >
        <span>{current ? `${current.code} ${current.name}` : "세계지도"}</span>
        <span style={{ opacity: 0.6, fontSize: 9 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          className="cyber-scrollbar"
          style={{
            position: "absolute",
            left: 0,
            bottom: "calc(100% + 4px)",
            background: t.legendBg,
            backdropFilter: "blur(8px)",
            border: `1px solid ${t.legendBorder}`,
            borderRadius: 4,
            zIndex: 50,
            maxHeight: 220,
            overflowY: "auto",
            minWidth: "100%",
            boxShadow: `0 -4px 20px ${t.labelAccent}20, 0 0 12px ${t.labelAccent}15`,
          }}
        >
          <button style={itemStyle(!value)} onClick={() => { onChange(""); setOpen(false); }}>
            세계지도
          </button>
          <div style={{ height: 1, background: t.legendBorder, margin: "2px 0" }} />
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              style={itemStyle(value === c.code)}
              onClick={() => { onChange(c.code); setOpen(false); }}
            >
              {c.code} {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface CyberMapProps {
  stores: MapStore[];
  isLoading?: boolean;
}

export function CyberMap({ stores, isLoading }: CyberMapProps) {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const { theme } = useTheme();
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [viewState, setViewState] = useState({
    longitude: WORLD_VIEW.longitude,
    latitude: WORLD_VIEW.latitude,
    zoom: WORLD_VIEW.zoom,
  });

  const t = MAP_THEMES[theme];

  function handleCountryChange(code: string) {
    setSelectedCountry(code);
    if (!mapRef.current) return;
    const view = code ? COUNTRY_VIEWS[code] : WORLD_VIEW;
    mapRef.current.flyTo({
      center: [view.longitude, view.latitude],
      zoom: view.zoom,
      duration: 2000,
      curve: 1.5,
      essential: true,
    });
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 600,
        backgroundColor: t.bg,
        backgroundImage:
          `linear-gradient(${t.gridColor} 1px, transparent 1px), ` +
          `linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    >
      {/* 상단 왼쪽: 제목 오버레이 */}
      <div className="absolute top-10 left-10 z-10 leading-tight">
        <p
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: t.labelAccent, opacity: 0.6 }}
        >
          Global
        </p>
        <p
          className="font-mono text-lg font-bold tracking-[0.25em] uppercase"
          style={{ color: t.labelPrimary }}
        >
          Monitoring
        </p>
      </div>

      {/* 상단 오른쪽: 매장 수 카운터 */}
      <div className="absolute top-10 right-10 z-10 text-right leading-tight">
        <p
          className="font-mono text-[10px] tracking-widest uppercase"
          style={{ color: t.labelAccent, opacity: 0.6 }}
        >
          Active Stores
        </p>
        <p
          className="font-mono text-2xl font-bold tabular-nums"
          style={{ color: t.labelPrimary }}
        >
          {isLoading ? "--" : stores.length}
        </p>
      </div>

      {/* MapLibre GL 지도 */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={t.mapStyle}
        style={{ width: "100%", height: "100%" }}
        minZoom={1}
        maxZoom={22}
        attributionControl={false}
      >
        {!isLoading &&
          stores.map((store) => {
            const color = getMarkerColor(store);
            return (
              <MapMarker
                key={store.id}
                longitude={store.longitude}
                latitude={store.latitude}
                anchor="center"
                onClick={() => router.push(`/stores/${store.id}`)}
              >
                <div
                  className="relative"
                  style={{ width: 20, height: 20, cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    setTooltip({ store, x: e.clientX, y: e.clientY })
                  }
                  onMouseMove={(e) =>
                    setTooltip({ store, x: e.clientX, y: e.clientY })
                  }
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* 펄스 링 (HTML) */}
                  <div
                    className="cyber-pulse-html absolute rounded-full"
                    style={{
                      width: 20,
                      height: 20,
                      left: "50%",
                      top: "50%",
                      background: color,
                      opacity: 0.2,
                    }}
                  />
                  {/* 코어 점 */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 10,
                      height: 10,
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      background: color,
                      boxShadow: `0 0 8px ${color}`,
                    }}
                  />
                  {/* 내부 하이라이트 */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 4,
                      height: 4,
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "#fff",
                      opacity: 0.7,
                    }}
                  />
                </div>
              </MapMarker>
            );
          })}
      </Map>

      {/* 호버 툴팁 */}
      {tooltip && <CyberTooltip tooltip={tooltip} />}

      {/* 하단 왼쪽: 국가 콤보박스 + 레전드 */}
      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-3">
        <CyberCountrySelect
          value={selectedCountry}
          onChange={handleCountryChange}
          t={t}
        />
        <div
          className="flex items-center gap-4 rounded px-3 py-1.5"
          style={{
            background: t.legendBg,
            border: `1px solid ${t.legendBorder}`,
          }}
        >
          <LegendItem color="#00ff88" label="정상" labelColor={t.legendLabel} />
          <LegendItem color="#ff3366" label="에러" labelColor={t.legendLabel} />
          <LegendItem color="#ffaa00" label="전원 OFF" labelColor={t.legendLabel} />
        </div>
      </div>

      {/* 하단 우측: LIVE 라벨 */}
      <div
        className="absolute bottom-3 right-4 z-10 font-mono text-[10px] tracking-widest"
        style={{ color: t.liveColor, opacity: 0.35 }}
      >
        LIVE
      </div>

      {/* 스캔라인 오버레이 */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        }}
      />

      {/* 상하단 그라디언트 페이드 */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12"
        style={{
          background: `linear-gradient(to bottom, ${t.fadeColor} 0%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12"
        style={{
          background: `linear-gradient(to top, ${t.fadeColor} 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}
