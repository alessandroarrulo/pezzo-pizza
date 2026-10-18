import { o as __toESM } from "../_runtime.mjs";
import { d as kz, f as meters, i as STATUS_LABEL, l as errText, u as hora } from "./format-C5Rj_BD_.mjs";
import { f as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as confirmDelivery, d as getCourier, s as doPunch, t as acceptDelivery, w as pingCourier } from "./fns-CItOgTXU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as LiveMap } from "./live-map-BpUCUZIQ.mjs";
import { a as useSession, i as useOnline, n as Shell } from "./shell-Df-kaV5i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/estafeta-BTRWNxpq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SHOP = {
	lat: -8.8264,
	lng: 13.2342
};
function EstafetaPage() {
	const qc = useQueryClient();
	const profile = useSession((s) => s.profile);
	const setProfile = useSession((s) => s.setProfile);
	const online = useOnline();
	const enqueue = useSession((s) => s.enqueue);
	const board = useQuery({
		queryKey: ["courier"],
		queryFn: () => getCourier(),
		refetchInterval: 5e3
	});
	const staffId = profile.staffId ?? 4;
	const mine = (board.data?.orders ?? []).filter((o) => o.status === "entrega" && o.courierId === staffId);
	const ready = (board.data?.orders ?? []).filter((o) => o.status === "pronto");
	const [active, setActive] = (0, import_react.useState)(null);
	const [pos, setPos] = (0, import_react.useState)(SHOP);
	const [code, setCode] = (0, import_react.useState)("");
	const [paid, setPaid] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const current = mine[0] ?? active;
	(0, import_react.useEffect)(() => {
		if (!current || current.status !== "entrega") return;
		const dest = {
			lat: current.lat,
			lng: current.lng
		};
		const timer = window.setInterval(() => {
			setPos((p) => ({
				lat: p.lat + (dest.lat - p.lat) * .2,
				lng: p.lng + (dest.lng - p.lng) * .2
			}));
		}, 5e3);
		return () => window.clearInterval(timer);
	}, [current]);
	(0, import_react.useEffect)(() => {
		if (!current || !online) return;
		pingCourier({ data: {
			orderId: current.id,
			staffId,
			lat: pos.lat,
			lng: pos.lng,
			simulated: true
		} });
	}, [
		pos,
		current,
		staffId,
		online
	]);
	async function take(order) {
		setBusy(true);
		try {
			await acceptDelivery({ data: {
				orderId: order.id,
				staffId,
				actor: profile.name
			} });
			setPos(SHOP);
			setActive({
				...order,
				status: "entrega",
				courierId: staffId
			});
			toast.success("Entrega aceite. O cliente já vê o mapa.");
			qc.invalidateQueries({ queryKey: ["courier"] });
		} catch (error) {
			toast.error(errText(error));
		} finally {
			setBusy(false);
		}
	}
	async function deliver() {
		if (!current) return;
		const body = {
			orderId: current.id,
			code: code.trim(),
			actor: profile.name,
			paid,
			note: ""
		};
		if (!online) {
			enqueue({
				id: crypto.randomUUID(),
				type: "deliver",
				body,
				at: (/* @__PURE__ */ new Date()).toISOString()
			});
			toast("Entrega guardada. Sincroniza quando voltares a ter rede.");
			return;
		}
		setBusy(true);
		try {
			await confirmDelivery({ data: body });
			toast.success("Entrega fechada.");
			setCode("");
			setActive(null);
			qc.invalidateQueries({ queryKey: ["courier"] });
		} catch (error) {
			toast.error(errText(error));
		} finally {
			setBusy(false);
		}
	}
	async function clock(kind, lat, lng) {
		const dist = meters(lat, lng, SHOP.lat, SHOP.lng);
		if (dist > 100) {
			toast.error(`Estás a ${Math.round(dist)} m da Pezzo. O ponto só regista dentro de 100 m.`);
			return;
		}
		const body = {
			staffId,
			kind,
			lat,
			lng,
			offline: !online,
			at: online ? null : (/* @__PURE__ */ new Date()).toISOString(),
			actor: profile.name
		};
		if (!online) {
			enqueue({
				id: crypto.randomUUID(),
				type: "punch",
				body,
				at: (/* @__PURE__ */ new Date()).toISOString()
			});
			toast("Ponto guardado neste telemóvel. Sincroniza quando voltares a ter rede.");
			return;
		}
		try {
			await doPunch({ data: body });
			toast.success(kind === "entrada" ? "Entrada registada na loja" : "Saída registada");
		} catch (error) {
			toast.error(errText(error));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-tomato",
				children: "Estafeta"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-4xl",
				children: [profile.staffId === 5 ? "Sílvia" : "João", " na rua"]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setProfile(profile.staffId === 5 ? {
					role: "estafeta",
					staffId: 4,
					name: "João Muongo",
					title: "Estafeta"
				} : {
					role: "estafeta",
					staffId: 5,
					name: "Sílvia Domingos",
					title: "Estafeta"
				}),
				className: "min-h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow-card",
				children: "Trocar estafeta"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-hidden rounded-3xl shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMap, {
				shop: board.data?.shop ?? SHOP,
				drop: current ? {
					lat: current.lat,
					lng: current.lng
				} : null,
				courier: current ? pos : null
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs text-muted",
			children: "O ponto vermelho és tu. O amarelo é a entrega. Sem GPS no browser, o percurso é simulado até à morada."
		}),
		current && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 rounded-3xl bg-paper p-4 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						current.code,
						" · ",
						STATUS_LABEL[current.status]
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: current.customerName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: current.address }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-semibold",
					children: ["Referência: ", current.landmark]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						current.itemSummary,
						" · ",
						kz(current.totalKz),
						" · ",
						current.payment
					]
				}),
				current.allergy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm font-semibold text-tomato",
					children: ["Alergia: ", current.allergy]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 grid gap-1 text-sm font-semibold",
					children: ["Código de 4 dígitos", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: code,
						inputMode: "numeric",
						maxLength: 4,
						onChange: (e) => setCode(e.target.value),
						className: "min-h-14 rounded-2xl bg-cream px-3 text-center font-display text-3xl tracking-widest",
						placeholder: "••••"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex min-h-12 items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: paid,
						onChange: (e) => setPaid(e.target.checked),
						className: "size-5"
					}), "Pagamento recebido"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => void deliver(),
					className: "mt-3 min-h-14 w-full rounded-2xl bg-tomato font-semibold text-on-tomato",
					children: "Confirmar entrega"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted",
					children: "A entrega demo da Marta usa o código 4821."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-6 font-display text-2xl",
			children: "Prontos para sair"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 grid gap-2",
			children: [ready.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: "rounded-3xl bg-paper p-4 shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl",
							children: o.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [
								o.customerName,
								" · ",
								o.zoneName
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								o.landmark,
								" · ",
								hora(o.createdAt)
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: () => void take(o),
						className: "min-h-12 rounded-2xl bg-amber px-4 font-semibold text-on-amber",
						children: "Aceitar"
					})]
				})
			}, o.id)), ready.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Nada à espera no balcão."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-6 font-display text-2xl",
			children: "Ponto"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 grid grid-cols-2 gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void clock("entrada", SHOP.lat, SHOP.lng),
					className: "min-h-16 rounded-3xl bg-amber font-display text-2xl text-on-amber",
					children: "Entrar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void clock("saida", SHOP.lat, SHOP.lng),
					className: "min-h-16 rounded-3xl bg-bordeaux font-display text-2xl text-on-tomato",
					children: "Sair"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void clock("entrada", -8.9, 13.3),
					className: "col-span-2 min-h-12 rounded-2xl bg-paper text-sm font-semibold shadow-card",
					children: "Testar fora da loja (deve falhar)"
				})
			]
		})
	] });
}
//#endregion
export { EstafetaPage as component };
