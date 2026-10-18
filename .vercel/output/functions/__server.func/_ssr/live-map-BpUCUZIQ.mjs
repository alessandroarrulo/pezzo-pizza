import { o as __toESM } from "../_runtime.mjs";
import { f as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-map-BpUCUZIQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TrackMap = (0, import_react.lazy)(() => import("./track-map-Batgs9yF.mjs"));
function LiveMap(props) {
	const [on, setOn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setOn(true), []);
	if (!on) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-72 rounded-3xl bg-paper shadow-card" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-72 rounded-3xl bg-paper shadow-card" }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackMap, { ...props })
	});
}
//#endregion
export { LiveMap as t };
