"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import type { MapStore } from "@/lib/types/map-store";
import { useTheme } from "@/providers/theme-provider";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MAP_THEMES = {
  dark: {
    bg:            "#050a14",
    gridColor:     "rgba(0,212,255,0.03)",
    countryFill:   "#0d1929",
    countryStroke: "#1e4976",
    countryHover:  "#122035",
    labelPrimary:  "#e0f0ff",
    labelAccent:   "#00d4ff",
    legendBg:      "rgba(5,10,20,0.7)",
    legendBorder:  "rgba(0,212,255,0.15)",
    legendLabel:   "#8ab4d4",
    liveColor:     "#00d4ff",
    fadeColor:     "#050a14",
  },
  light: {
    bg:            "#e8f2fb",
    gridColor:     "rgba(0,100,200,0.05)",
    countryFill:   "#c4ddf0",
    countryStroke: "#5b9bd5",
    countryHover:  "#b0cfe8",
    labelPrimary:  "#0d2a4a",
    labelAccent:   "#1a6eb5",
    legendBg:      "rgba(220,238,255,0.85)",
    legendBorder:  "rgba(0,100,200,0.2)",
    legendLabel:   "#1a4a7a",
    liveColor:     "#1a6eb5",
    fadeColor:     "#e8f2fb",
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

interface CyberMapProps {
  stores: MapStore[];
  isLoading?: boolean;
}

export function CyberMap({ stores, isLoading }: CyberMapProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const t = MAP_THEMES[theme];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 480,
        background: t.bg,
        backgroundImage:
          `linear-gradient(${t.gridColor} 1px, transparent 1px), ` +
          `linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    >
      {/* 상단 왼쪽: 제목 오버레이 */}
      <div className="absolute top-4 left-5 z-10 leading-tight">
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
      <div className="absolute top-4 right-5 z-10 text-right leading-tight">
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

      {/* SVG 세계지도 */}
      <ComposableMap
        projection="geoEquirectangular"
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup zoom={1.2} center={[10, 10]}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: t.countryFill,
                      stroke: t.countryStroke,
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: t.countryHover,
                      stroke: t.countryStroke,
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {!isLoading &&
            stores.map((store) => {
              const color = getMarkerColor(store);
              return (
                <Marker
                  key={store.id}
                  coordinates={[store.longitude, store.latitude]}
                >
                  {/* 펄스 링 */}
                  <circle
                    r={8}
                    fill={color}
                    fillOpacity={0.18}
                    className="cyber-pulse"
                  />
                  {/* 코어 점 */}
                  <circle r={4} fill={color} opacity={0.9} />
                  {/* 내부 하이라이트 */}
                  <circle r={1.5} fill="#ffffff" opacity={0.7} />
                  {/* 히트 영역 */}
                  <circle
                    r={12}
                    fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) =>
                      setTooltip({ store, x: e.clientX, y: e.clientY })
                    }
                    onMouseMove={(e) =>
                      setTooltip({ store, x: e.clientX, y: e.clientY })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => {
                      setTooltip(null);
                      router.push(`/stores/${store.id}`);
                    }}
                  />
                </Marker>
              );
            })}
        </ZoomableGroup>
      </ComposableMap>

      {/* 호버 툴팁 */}
      {tooltip && <CyberTooltip tooltip={tooltip} />}

      {/* 하단 레전드 */}
      <div
        className="absolute bottom-3 left-4 z-10 flex items-center gap-4 rounded px-3 py-1.5"
        style={{
          background: t.legendBg,
          border: `1px solid ${t.legendBorder}`,
        }}
      >
        <LegendItem color="#00ff88" label="정상" labelColor={t.legendLabel} />
        <LegendItem color="#ff3366" label="에러" labelColor={t.legendLabel} />
        <LegendItem color="#ffaa00" label="전원 OFF" labelColor={t.legendLabel} />
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
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        }}
      />

      {/* 상하단 그라디언트 페이드 */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-12"
        style={{
          background: `linear-gradient(to bottom, ${t.fadeColor} 0%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
        style={{
          background: `linear-gradient(to top, ${t.fadeColor} 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}
