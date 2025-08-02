// LocationPicker.tsx
import React, { useEffect, useRef } from "react";
import mapboxgl, { Map as MapboxMap, Marker } from "mapbox-gl";

mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN"; // secure this properly!

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationPickerProps {
  location: Location | null;
  onChange: (location: Location) => void;
}

const defaultLocation = { latitude: 40.7128, longitude: -74.006 };

const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onChange,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const marker = useRef<Marker | null>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [
        location?.longitude || defaultLocation.longitude,
        location?.latitude || defaultLocation.latitude,
      ],
      zoom: 12,
    });

    marker.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([
        location?.longitude || defaultLocation.longitude,
        location?.latitude || defaultLocation.latitude,
      ])
      .addTo(map.current);

    marker.current.on("dragend", () => {
      const lngLat = marker.current!.getLngLat();
      onChange({ latitude: lngLat.lat, longitude: lngLat.lng });
    });

    map.current.on("click", (e) => {
      marker.current!.setLngLat(e.lngLat);
      onChange({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
    });

    return () => {
      map.current?.remove();
    };
  }, [location, onChange]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "300px",
        borderRadius: 8,
        overflow: "hidden",
      }}
    />
  );
};

export default LocationPicker;
