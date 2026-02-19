"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Store } from "@/lib/types/store";

// Next.js/webpack에서 Leaflet 기본 마커 아이콘 깨짐 방지
function fixLeafletIcon() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

interface StoreMapProps {
  stores: Store[];
}

export function StoreMap({ stores }: StoreMapProps) {
  const router = useRouter();

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const validStores = stores.filter(
    (s): s is Store & { latitude: number; longitude: number } =>
      s.latitude != null && s.longitude != null
  );

  // 지도 중심 계산 (유효한 매장들의 중심)
  const center: [number, number] =
    validStores.length > 0
      ? [
          validStores.reduce((s, st) => s + st.latitude, 0) / validStores.length,
          validStores.reduce((s, st) => s + st.longitude, 0) / validStores.length,
        ]
      : [37.5665, 126.978]; // 서울 기본값

  if (validStores.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        위치 정보가 있는 매장이 없습니다.
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={validStores.length === 1 ? 13 : 5}
      style={{ height: "100%", width: "100%", borderRadius: "0.375rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validStores.map((store) => (
        <Marker key={store.id} position={[store.latitude, store.longitude]}>
          <Popup>
            <div className="text-sm">
              <p className="font-medium">{store.store_name}</p>
              {store.address && <p className="text-muted-foreground text-xs mt-0.5">{store.address}</p>}
              <button
                className="mt-2 text-xs text-blue-600 hover:underline"
                onClick={() => router.push(`/stores/${store.id}`)}
              >
                매장 상세 →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
