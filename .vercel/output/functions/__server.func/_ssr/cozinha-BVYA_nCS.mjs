import { o as __toESM } from "../_runtime.mjs";
import { a as beep, c as elapsed, d as kz, h as urgency, i as STATUS_LABEL, l as errText, t as CHANNEL_LABEL, u as hora } from "./format-C5Rj_BD_.mjs";
import { f as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { N as startPrep, c as finishPrep, g as getKitchen, i as cancelOrder, v as getOrder } from "./fns-CItOgTXU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useSession, n as Shell, r as cn } from "./shell-Df-kaV5i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cozinha-BVYA_nCS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CozinhaPage() {
	const qc = useQueryClient();
	const profile = useSession((s) => s.profile);
	const sound = useSession((s) => s.sound);
	const setSound = useSession((s) => s.setSound);
	const dark = useSession((s) => s.kdsDark);
	const setDark = useSession((s) => s.setKdsDark);
	const board = useQuery({
		queryKey: ["kitchen"],
		queryFn: () => getKitchen(),
		refetchInterval: 4e3
	});
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const [, setSeen] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => {
		const fresh = (board.data?.orders ?? []).filter((o) => o.status === "recebido").map((o) => o.id);
		setSeen((prev) => {
			if (prev.length && fresh.some((id) => !prev.includes(id)) && sound) beep();
			if (prev.length === fresh.length && prev.every((id, i) => id === fresh[i])) return prev;
			return fresh;
		});
	}, [board.data, sound]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		kds: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-amber-deep",
						children: ["Cozinha · ", profile.name]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl",
						children: "Fila de pedidos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [board.data?.cleanWeek ?? 0, " preparos certos esta semana"]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSound(!sound),
							className: "min-h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow-card",
							children: ["Som ", sound ? "ligado" : "desligado"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDark(!dark),
							className: "min-h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow-card",
							children: dark ? "Modo claro" : "Modo escuro"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pedir",
							search: { canal: "telefone" },
							className: "inline-flex min-h-11 items-center rounded-full bg-tomato px-4 text-sm font-semibold text-on-tomato",
							children: "Novo pedido"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3 lg:grid-cols-3",
				children: [
					{
						key: "recebido",
						title: "Recebido"
					},
					{
						key: "preparacao",
						title: "Em preparação"
					},
					{
						key: "pronto",
						title: "Pronto"
					}
				].map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: col.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid gap-2",
					children: [(board.data?.orders ?? []).filter((o) => o.status === col.key).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpenId(o.id),
						className: "rounded-3xl bg-paper p-4 text-left shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-2xl",
									children: o.code
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("font-semibold tabular-nums", urgency(o.createdAt, now) === "late" ? "text-tomato" : urgency(o.createdAt, now) === "warn" ? "text-amber-deep" : "text-muted"),
									children: elapsed(o.createdAt, now)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: o.itemSummary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									CHANNEL_LABEL[o.channel],
									" · ",
									o.customerName,
									" · ",
									hora(o.createdAt)
								]
							}),
							o.allergy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 rounded-xl bg-tomato px-2 py-1 text-sm font-semibold text-on-tomato",
								children: ["Alergia: ", o.allergy]
							})
						]
					}, o.id)), (board.data?.orders ?? []).every((o) => o.status !== col.key) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-2xl border border-dashed border-line p-4 text-sm text-muted",
						children: "Vazio"
					})]
				})] }, col.key))
			}),
			openId != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, {
				id: openId,
				actor: profile.name,
				onClose: () => {
					setOpenId(null);
					qc.invalidateQueries({ queryKey: ["kitchen"] });
				}
			})
		]
	});
}
function Ticket({ id, actor, onClose }) {
	const detail = useQuery({
		queryKey: ["order", id],
		queryFn: () => getOrder({ data: { id } })
	});
	const [lines, setLines] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const order = detail.data?.order;
	const checks = lines ?? detail.data?.checks ?? [];
	async function run(task, ok) {
		setBusy(true);
		try {
			await task();
			toast.success(ok);
			onClose();
		} catch (error) {
			toast.error(errText(error));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 overflow-y-auto bg-cream p-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg pb-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-4xl",
						children: order?.code ?? "Pedido"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "min-h-11 rounded-full bg-paper px-4 font-semibold shadow-card",
						children: "Fechar"
					})]
				}),
				order && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						STATUS_LABEL[order.status],
						" · ",
						order.customerName,
						" · ",
						kz(order.totalKz)
					]
				}),
				order?.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 rounded-2xl bg-amber px-3 py-2 text-sm text-on-amber",
					children: ["Nota: ", order.notes]
				}),
				order?.allergy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 rounded-2xl bg-tomato px-3 py-2 text-sm font-semibold text-on-tomato",
					children: ["Alergia: ", order.allergy]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-4 font-display text-2xl",
					children: "Ficha técnica"
				}),
				checks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Ficha por preencher. Dá para marcar pronto, mas o stock não é abatido."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid gap-2",
					children: checks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-paper p-3 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									c.itemName,
									" · ficha ",
									c.expectedQty,
									" ",
									c.unit
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								inputMode: "numeric",
								value: c.actualQty,
								onChange: (e) => {
									const actualQty = Number(e.target.value);
									setLines(checks.map((line) => line.id === c.id ? {
										...line,
										actualQty
									} : line));
								},
								className: "h-12 w-24 rounded-xl bg-cream px-2 text-center text-lg tabular-nums"
							})]
						}), c.actualQty !== c.expectedQty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: c.reason,
							placeholder: "Motivo (ex.: pedido sem cebola)",
							onChange: (e) => setLines(checks.map((line) => line.id === c.id ? {
								...line,
								reason: e.target.value
							} : line)),
							className: "mt-2 min-h-11 w-full rounded-xl bg-cream px-3 text-sm"
						})]
					}, c.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2",
					children: [
						order?.status === "recebido" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy,
							onClick: () => void run(() => startPrep({ data: {
								id,
								actor
							} }), "A preparar"),
							className: "min-h-14 rounded-2xl bg-amber font-semibold text-on-amber",
							children: "Começar preparação"
						}),
						order && order.status !== "pronto" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy,
							onClick: () => void run(() => finishPrep({ data: {
								orderId: id,
								actor,
								lines: checks.map((c) => ({
									id: c.id,
									actualQty: c.actualQty,
									reason: c.reason
								}))
							} }), "Pronto. Stock abatido."),
							className: "min-h-14 rounded-2xl bg-tomato font-semibold text-on-tomato",
							children: "Confirmar ficha e marcar pronto"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy,
							onClick: () => {
								const reason = window.prompt("Motivo do cancelamento?") ?? "";
								if (reason.trim().length < 3) return;
								run(() => cancelOrder({ data: {
									id,
									actor,
									reason
								} }), "Pedido cancelado");
							},
							className: "min-h-12 rounded-2xl bg-paper font-semibold shadow-card",
							children: "Cancelar pedido"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { CozinhaPage as component };
