import { lazy, Suspense, useEffect, useState } from "react";

const TrackMap = lazy(() => import("./track-map"));

export function LiveMap(props: {
  shop: { lat: number; lng: number };
  drop?: { lat: number; lng: number } | null;
  courier?: { lat: number; lng: number } | null;
}) {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  if (!on) return <div className="h-72 rounded-3xl bg-paper shadow-card" />;
  return (
    <Suspense fallback={<div className="h-72 rounded-3xl bg-paper shadow-card" />}>
      <TrackMap {...props} />
    </Suspense>
  );
}
