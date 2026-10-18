import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const shopColor = "#6d0f0f";
const dropColor = "#ffb300";
const bikeColor = "#d32f2f";

export default function TrackMap({
  shop,
  drop,
  courier,
}: {
  shop: { lat: number; lng: number };
  drop?: { lat: number; lng: number } | null;
  courier?: { lat: number; lng: number } | null;
}) {
  const center = courier ?? drop ?? shop;
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      scrollWheelZoom={false}
      className="z-0 h-72 w-full rounded-3xl"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <CircleMarker
        center={[shop.lat, shop.lng]}
        radius={9}
        pathOptions={{ color: shopColor, fillColor: shopColor, fillOpacity: 1 }}
      >
        <Popup>Pezzo Pizza · Maianga</Popup>
      </CircleMarker>
      {drop && (
        <CircleMarker
          center={[drop.lat, drop.lng]}
          radius={8}
          pathOptions={{ color: shopColor, fillColor: dropColor, fillOpacity: 1 }}
        >
          <Popup>Entrega</Popup>
        </CircleMarker>
      )}
      {courier && (
        <CircleMarker
          center={[courier.lat, courier.lng]}
          radius={11}
          pathOptions={{ color: shopColor, fillColor: bikeColor, fillOpacity: 1 }}
        >
          <Popup>Estafeta</Popup>
        </CircleMarker>
      )}
      {courier && drop && (
        <Polyline
          positions={[
            [shop.lat, shop.lng],
            [courier.lat, courier.lng],
            [drop.lat, drop.lng],
          ]}
          pathOptions={{ color: shopColor, weight: 3, opacity: 0.45 }}
        />
      )}
    </MapContainer>
  );
}
