'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L, { LatLngExpression } from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  value?: {
    lat: number;
    lng: number;
  };

  onChange(lat: number, lng: number): void;
}

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);

  return null;
}

function LocationMarker({ value, onChange }: Props) {
  const [position, setPosition] = useState<L.LatLng | null>(
    value ? L.latLng(value.lat, value.lng) : null,
  );

  useEffect(() => {
    if (value) {
      setPosition(L.latLng(value.lat, value.lng));
    }
  }, [value]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  if (!position) return null;

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const latlng = marker.getLatLng();

          setPosition(latlng);
          onChange(latlng.lat, latlng.lng);
        },
      }}
    />
  );
}

export default function LocationPicker({
  value,
  onChange,
}: Props) {
  const center: LatLngExpression = value
    ? [value.lat, value.lng]
    : [10.7769, 106.7009];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Chọn vị trí sân
          </p>

          <p className="text-xs text-gray-500">
            Click hoặc kéo marker để cập nhật tọa độ
          </p>
        </div>

        {value && (
          <div className="rounded-lg bg-emerald-50 px-3 py-1 text-right">
            <p className="text-[11px] text-emerald-700">
              Vĩ độ: {value.lat.toFixed(6)}
            </p>
            <p className="text-[11px] text-emerald-700">
              Kinh độ: {value.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="h-[420px] w-full">
        <MapContainer
          center={center}
          zoom={15}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ResizeMap />

          <LocationMarker
            value={value}
            onChange={onChange}
          />
        </MapContainer>
      </div>
    </div>
  );
}