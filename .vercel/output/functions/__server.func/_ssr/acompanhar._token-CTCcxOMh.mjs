import { d as kz, i as STATUS_LABEL, n as PAYMENT_LABEL, r as STATUS_FLOW, t as CHANNEL_LABEL, u as hora } from "./format-C5Rj_BD_.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { C as getTracking } from "./fns-CItOgTXU.mjs";
import { n as Route$1 } from "./router-CWPUABcm.mjs";
import { t as LiveMap } from "./live-map-BpUCUZIQ.mjs";
import { n as Shell, r as cn } from "./shell-Df-kaV5i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/acompanhar._token-CTCcxOMh.js
var import_jsx_runtime = require_jsx_runtime();
function TrackPage() {
	const initial = Route$1.useLoaderData();
	const { token } = Route$1.useParams();
	const data = useQuery({
		queryKey: ["track", token],
		queryFn: () => getTracking({ data: { token } }),
		initialData: initial,
		refetchInterval: 4e3
	}).data ?? initial;
	const order = data.order;
	const step = STATUS_FLOW.indexOf(order.status === "cancelado" ? "recebido" : order.status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm font-semibold text-tomato",
			children: [
				order.code,
				" · ",
				CHANNEL_LABEL[order.channel]
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: STATUS_LABEL[order.status]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: order.itemSummary
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-4 grid grid-cols-5 gap-1",
			children: STATUS_FLOW.map((status, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: cn("rounded-2xl px-1 py-2 text-center text-[11px] font-semibold leading-tight", i <= step && order.status !== "cancelado" ? "bg-tomato text-on-tomato" : "bg-paper text-muted shadow-card"),
				children: STATUS_LABEL[status]
			}, status))
		}),
		order.status === "cancelado" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 rounded-2xl bg-paper p-3 text-sm shadow-card",
			children: "Este pedido foi cancelado."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-hidden rounded-3xl shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMap, {
				shop: data.shop,
				drop: {
					lat: order.lat,
					lng: order.lng
				},
				courier: order.status === "entrega" ? data.courier : null
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: order.status === "entrega" ? data.courier ? `${data.courier.name || "Estafeta"} a caminho${data.courier.simulated ? " (posição estimada)" : ""}. ~${data.etaMin} min.` : "O estafeta já saiu. A posição aparece assim que o telemóvel falar." : order.status === "entregue" ? "Entregue. Bom proveito." : "Ainda na Pezzo. O mapa mexe quando sair para entrega."
		}),
		order.status !== "entregue" && order.status !== "cancelado" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 rounded-3xl bg-amber p-4 text-on-amber",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold",
				children: "Diz este código ao estafeta"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-5xl tracking-widest tabular-nums",
				children: order.deliveryCode
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 rounded-3xl bg-paper p-4 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: order.customerName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: order.address
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Referência: ",
						order.landmark || "—",
						" · ",
						order.zoneName
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-2xl tabular-nums",
					children: kz(order.totalKz)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						PAYMENT_LABEL[order.payment],
						" · ",
						order.paid ? "pago" : "por cobrar"
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-5 font-display text-2xl",
			children: "Histórico"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-2",
			children: data.events.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex justify-between gap-3 rounded-2xl bg-paper px-3 py-2 text-sm shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					STATUS_LABEL[e.status] ?? e.status,
					" · ",
					e.actor
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-muted",
					children: hora(e.at)
				})]
			}, `${e.at}-${i}`))
		})
	] });
}
//#endregion
export { TrackPage as component };
