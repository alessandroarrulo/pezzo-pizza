import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as CircleMarker, i as MapContainer, n as Popup, r as Polyline, t as TileLayer } from "../_libs/react-leaflet.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-map-Batgs9yF.js
var import_jsx_runtime = require_jsx_runtime();
var shopColor = "#6d0f0f";
var dropColor = "#ffb300";
var bikeColor = "#d32f2f";
function TrackMap({ shop, drop, courier }) {
	const center = courier ?? drop ?? shop;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapContainer, {
		center: [center.lat, center.lng],
		zoom: 14,
		scrollWheelZoom: false,
		className: "z-0 h-72 w-full rounded-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, {
				attribution: "© OpenStreetMap © CARTO",
				url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
				center: [shop.lat, shop.lng],
				radius: 9,
				pathOptions: {
					color: shopColor,
					fillColor: shopColor,
					fillOpacity: 1
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, { children: "Pezzo Pizza · Maianga" })
			}),
			drop && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
				center: [drop.lat, drop.lng],
				radius: 8,
				pathOptions: {
					color: shopColor,
					fillColor: dropColor,
					fillOpacity: 1
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, { children: "Entrega" })
			}),
			courier && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
				center: [courier.lat, courier.lng],
				radius: 11,
				pathOptions: {
					color: shopColor,
					fillColor: bikeColor,
					fillOpacity: 1
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, { children: "Estafeta" })
			}),
			courier && drop && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
				positions: [
					[shop.lat, shop.lng],
					[courier.lat, courier.lng],
					[drop.lat, drop.lng]
				],
				pathOptions: {
					color: shopColor,
					weight: 3,
					opacity: .45
				}
			})
		]
	});
}
//#endregion
export { TrackMap as default };
