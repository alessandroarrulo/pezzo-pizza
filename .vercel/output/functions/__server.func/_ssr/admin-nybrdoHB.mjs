import { o as __toESM } from "../_runtime.mjs";
import { d as kz, g as waLink, i as STATUS_LABEL, l as errText, n as PAYMENT_LABEL, s as diaCurto, t as CHANNEL_LABEL, u as hora } from "./format-C5Rj_BD_.mjs";
import { f as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { A as saveProduct, D as saveCoupon, M as saveSettings, O as saveCustomer, S as getSuggestions, b as getPunches, f as getCustomers, j as saveRecipe, k as saveIngredientCost, l as getAdminSettings, m as getFichas, n as adjustStock, o as decideSuggestion, p as getDashboard, r as askGrok, u as getAudit, x as getStock, y as getOrders } from "./fns-CItOgTXU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useSession, n as Shell, r as cn } from "./shell-Df-kaV5i.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-nybrdoHB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	["hoje", "Hoje"],
	["pedidos", "Pedidos"],
	["ementa", "Ementa"],
	["fichas", "Fichas"],
	["margens", "Margens"],
	["stock", "Stock"],
	["ponto", "Ponto"],
	["clientes", "Clientes"],
	["ia", "IA"],
	["loja", "Loja"]
];
function AdminPage() {
	const [tab, setTab] = (0, import_react.useState)("hoje");
	const actor = useSession((s) => s.profile.name);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm font-semibold text-tomato",
			children: ["Gestão · ", actor]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Pezzo, hoje"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex gap-2 overflow-x-auto pb-1",
			children: TABS.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab(id),
				className: cn("min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold", tab === id ? "bg-bordeaux text-on-tomato" : "bg-paper shadow-card"),
				children: label
			}, id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [
				tab === "hoje" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoje, {}),
				tab === "pedidos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pedidos, {}),
				tab === "ementa" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ementa, { actor }),
				tab === "fichas" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fichas, { actor }),
				tab === "margens" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Margens, { actor }),
				tab === "stock" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stock, { actor }),
				tab === "ponto" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ponto, {}),
				tab === "clientes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clientes, { actor }),
				tab === "ia" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ia, { actor }),
				tab === "loja" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loja, { actor })
			]
		})
	] });
}
function Hoje() {
	const q = useQuery({
		queryKey: ["dash"],
		queryFn: () => getDashboard()
	});
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	const d = q.data;
	if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "A somar o dia…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Vendas entregues",
						value: kz(d.salesKz)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Pedidos de hoje",
						value: String(d.orders)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Ticket médio",
						value: kz(d.ticketKz)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Em aberto",
						value: String(d.open)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-paper p-4 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Últimos 7 dias"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-52",
						children: mounted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: d.byDay,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										tick: {
											fill: "#8d5b4c",
											fontSize: 12
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => kz(Number(v)) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "total",
										fill: "#d32f2f",
										radius: 8
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-paper p-4 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Por canal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-2 space-y-2",
							children: [d.byChannel.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: CHANNEL_LABEL[c.channel] ?? c.channel }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums",
									children: [
										c.n,
										" · ",
										kz(c.total)
									]
								})]
							}, c.channel)), d.byChannel.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted",
								children: "Ainda sem pedidos hoje."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-muted",
							children: [
								"Preparação média ",
								d.prepAvgMin ?? "—",
								" min · entrega ",
								d.tripAvgMin ?? "—",
								" min"
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-paper p-4 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Mais pedidos (14 dias)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-1",
					children: d.top.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-muted",
							children: [
								t.qty,
								" · ",
								kz(t.total)
							]
						})]
					}, t.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-paper p-4 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Quem está na loja"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1 text-sm",
						children: [d.present.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							p.name,
							" · ",
							p.role,
							" · desde ",
							hora(p.since),
							p.kind === "pausa" ? " (pausa)" : ""
						] }, p.name)), d.present.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted",
							children: "Ninguém picou o ponto nas últimas horas."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-paper p-4 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Stock no limite"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1 text-sm",
						children: [d.lowStock.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-tomato",
							children: [
								i.name,
								": ",
								i.stock,
								" ",
								i.unit,
								" (mín. ",
								i.min,
								")"
							]
						}, i.name)), d.lowStock.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted",
							children: "Tudo acima do mínimo."
						})]
					})]
				})]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-paper p-4 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold uppercase tracking-wide text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-3xl tabular-nums",
			children: value
		})]
	});
}
function Pedidos() {
	const q = useQuery({
		queryKey: ["orders"],
		queryFn: () => getOrders()
	});
	function csv() {
		downloadCsv("pezzo-pedidos.csv", [[
			"codigo",
			"estado",
			"canal",
			"cliente",
			"total",
			"hora"
		], ...(q.data ?? []).map((o) => [
			o.code,
			o.status,
			o.channel,
			o.customerName,
			String(o.totalKz),
			o.createdAt
		])]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: csv,
		className: "min-h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow-card",
		children: "Exportar Excel (CSV)"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 grid gap-2",
		children: (q.data ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-2xl bg-paper px-4 py-3 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-semibold",
						children: [
							o.code,
							" · ",
							o.customerName
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "tabular-nums",
						children: kz(o.totalKz)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						STATUS_LABEL[o.status],
						" · ",
						CHANNEL_LABEL[o.channel],
						" · ",
						PAYMENT_LABEL[o.payment],
						" · ",
						hora(o.createdAt)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: o.itemSummary
				})
			]
		}, o.id))
	})] });
}
function Ementa({ actor }) {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["fichas"],
		queryFn: () => getFichas()
	});
	const [name, setName] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("2500");
	const [categoryId, setCategoryId] = (0, import_react.useState)(2);
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "A carregar a ementa…"
	});
	const cats = [...new Map(q.data.products.map((p) => [p.categoryId, p.category])).entries()];
	async function save(id, patch) {
		try {
			await saveProduct({ data: {
				id,
				actor,
				...patch
			} });
			toast.success("Ementa atualizada");
			qc.invalidateQueries({ queryKey: ["fichas"] });
			qc.invalidateQueries({ queryKey: ["menu"] });
		} catch (error) {
			toast.error(errText(error));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-2 rounded-3xl bg-paper p-4 shadow-card sm:grid-cols-4",
			onSubmit: (e) => {
				e.preventDefault();
				saveProduct({ data: {
					id: null,
					actor,
					name,
					description: "",
					priceKz: Number(price),
					active: true,
					categoryId
				} }).then(() => {
					setName("");
					toast.success("Produto criado");
					qc.invalidateQueries({ queryKey: ["fichas"] });
				}).catch((error) => toast.error(errText(error)));
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Novo produto",
					className: "min-h-12 rounded-2xl bg-cream px-3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: price,
					onChange: (e) => setPrice(e.target.value),
					inputMode: "numeric",
					className: "min-h-12 rounded-2xl bg-cream px-3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: categoryId,
					onChange: (e) => setCategoryId(Number(e.target.value)),
					className: "min-h-12 rounded-2xl bg-cream px-3",
					children: cats.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: id,
						children: label
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "min-h-12 rounded-2xl bg-tomato font-semibold text-on-tomato",
					children: "Criar"
				})
			]
		}), q.data.products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductRow, {
			product: p,
			onSave: save
		}, p.id))]
	});
}
function ProductRow({ product, onSave }) {
	const [price, setPrice] = (0, import_react.useState)(String(product.priceKz));
	const [active, setActive] = (0, import_react.useState)(product.active);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2 rounded-2xl bg-paper p-3 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-40 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: product.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: product.category
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: price,
				onChange: (e) => setPrice(e.target.value),
				className: "h-11 w-28 rounded-xl bg-cream px-2 tabular-nums"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setActive(!active),
				className: cn("min-h-11 rounded-full px-3 text-sm font-semibold", active ? "bg-amber text-on-amber" : "bg-line"),
				children: active ? "Ativo" : "Oculto"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void onSave(product.id, {
					name: product.name,
					description: product.description,
					priceKz: Number(price),
					active,
					categoryId: product.categoryId
				}),
				className: "min-h-11 rounded-full bg-bordeaux px-3 text-sm font-semibold text-on-tomato",
				children: "Guardar"
			})
		]
	});
}
function Fichas({ actor }) {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["fichas"],
		queryFn: () => getFichas()
	});
	const [productId, setProductId] = (0, import_react.useState)(null);
	const data = q.data;
	const id = productId ?? data?.products[0]?.id ?? null;
	const [lines, setLines] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => setLines(null), [id]);
	if (!data || id == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "A carregar fichas…"
	});
	const current = lines ?? data.lines.filter((l) => l.productId === id).map((l) => ({
		ingredientId: l.ingredientId,
		qty: l.qty
	}));
	const product = data.products.find((p) => p.id === id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "As fichas já vêm preenchidas como rascunho para a cozinha trabalhar. Ajusta as quantidades reais — ou limpa e recomeça."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value: id,
				onChange: (e) => setProductId(Number(e.target.value)),
				className: "min-h-12 rounded-2xl bg-paper px-3 shadow-card",
				children: data.products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: p.id,
					children: [
						p.category,
						" · ",
						p.name
					]
				}, p.id))
			}),
			current.map((line, index) => {
				const ing = data.ingredients.find((i) => i.id === line.ingredientId);
				const lineKz = ing ? Math.round(line.qty * ing.costCents / 100) : 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-2xl bg-paper p-3 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1",
							children: ing?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: line.qty,
							onChange: (e) => setLines(current.map((l, i) => i === index ? {
								...l,
								qty: Number(e.target.value)
							} : l)),
							className: "h-11 w-24 rounded-xl bg-cream px-2 text-center tabular-nums"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-16 text-sm text-muted",
							children: ing?.unit
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-20 text-right text-sm tabular-nums",
							children: kz(lineKz)
						})
					]
				}, `${line.ingredientId}-${index}`);
			}),
			current.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Ficha vazia. Junta ingredientes."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "min-h-12 flex-1 rounded-2xl bg-paper px-3 shadow-card",
						defaultValue: "",
						onChange: (e) => {
							const ingredientId = Number(e.target.value);
							if (!ingredientId) return;
							setLines([...current, {
								ingredientId,
								qty: 1
							}]);
							e.currentTarget.value = "";
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Juntar ingrediente…"
						}), data.ingredients.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: i.id,
							children: i.name
						}, i.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setLines([]),
						className: "min-h-12 rounded-2xl bg-paper px-4 font-semibold shadow-card",
						children: "Limpar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							saveRecipe({ data: {
								productId: id,
								actor,
								lines: current
							} }).then(() => {
								toast.success(`Ficha de ${product?.name ?? "produto"} guardada`);
								qc.invalidateQueries({ queryKey: ["fichas"] });
							}).catch((error) => toast.error(errText(error)));
						},
						className: "min-h-12 rounded-2xl bg-tomato px-4 font-semibold text-on-tomato",
						children: "Guardar ficha"
					})
				]
			})
		]
	});
}
function Margens({ actor }) {
	const qc = useQueryClient();
	const stock = useQuery({
		queryKey: ["stock"],
		queryFn: () => getStock()
	});
	const fichas = useQuery({
		queryKey: ["fichas"],
		queryFn: () => getFichas()
	});
	const [prices, setPrices] = (0, import_react.useState)({});
	if (!stock.data || !fichas.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "A calcular as margens…"
	});
	const rows = [...stock.data.foodCost].sort((a, b) => b.marginKz - a.marginKz);
	const pizzas = rows.filter((r) => r.categorySlug === "pizzas" || r.categorySlug === "pocket");
	const avg = pizzas.length ? Math.round(pizzas.reduce((s, r) => s + r.foodCostPct, 0) / pizzas.length * 10) / 10 : 0;
	const best = rows.filter((r) => r.categorySlug !== "bebidas").reduce((top, r) => !top || r.marginKz > top.marginKz ? r : top, null);
	const priceOf = (id, cents, unit) => {
		if (prices[id] != null) return prices[id];
		const shown = unit === "g" || unit === "ml" ? cents * 1e3 / 100 : cents / 100;
		return String(Math.round(shown));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Preços de Luanda, Outubro 2026. O food cost ideal numa pizzaria fica entre 25% e 35% — até 40% ainda é aceitável com delivery."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Food cost das pizzas",
						value: `${avg}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Maior margem",
						value: best ? kz(best.marginKz) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Produto a empurrar",
						value: best?.name ?? "—"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-3xl bg-paper shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Produto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Venda"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Custo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Food cost"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Margem"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Prioridade"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: r.category
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 tabular-nums",
								children: kz(r.priceKz)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 tabular-nums",
								children: kz(r.costKz)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("inline-flex min-h-8 items-center rounded-full px-2 tabular-nums text-xs font-semibold", r.foodCostPct === 0 ? "bg-line" : r.foodCostPct <= 40 ? "bg-amber text-on-amber" : r.foodCostPct <= 50 ? "bg-cream" : "bg-tomato text-on-tomato"),
									children: r.costKz ? `${r.foodCostPct}%` : "—"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 tabular-nums font-semibold",
								children: kz(r.marginKz)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: r.priority
							})
						]
					}, r.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-paper p-4 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Preços de compra"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Kz por kg (ou por litro, ou por unidade no pão e nas bebidas). Uma compra no separador Stock também actualiza este preço."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: fichas.data.ingredients.map((i) => {
							const unitLabel = i.unit === "g" ? "Kz/kg" : i.unit === "ml" ? "Kz/l" : "Kz/un";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-40 flex-1",
										children: i.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										inputMode: "numeric",
										value: priceOf(i.id, i.costCents, i.unit),
										onChange: (e) => setPrices((p) => ({
											...p,
											[i.id]: e.target.value
										})),
										className: "h-11 w-28 rounded-xl bg-cream px-2 text-right tabular-nums",
										"aria-label": `Preço de ${i.name}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-16 text-xs text-muted",
										children: unitLabel
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11 rounded-full bg-bordeaux px-3 text-sm font-semibold text-on-tomato",
										onClick: () => {
											const pricePerKgKz = Number(priceOf(i.id, i.costCents, i.unit));
											saveIngredientCost({ data: {
												ingredientId: i.id,
												pricePerKgKz,
												actor
											} }).then(() => {
												toast.success(`${i.name} actualizado`);
												qc.invalidateQueries({ queryKey: ["fichas"] });
												qc.invalidateQueries({ queryKey: ["stock"] });
											}).catch((error) => toast.error(errText(error)));
										},
										children: "Guardar"
									})
								]
							}, i.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-paper p-4 text-sm shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Porções a controlar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 list-disc space-y-1 pl-5 text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Queijo numa pizza de 8 fatias: 180–220 g. Máximo 250 g. Uma barra de 2,5 kg dá 12 a 13 pizzas a 200 g." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Magoga: 100–150 g de frango (coxa) por sandes. A ficha está em 130 g." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Pezzo Burger: 80–120 g de peito. A ficha está em 110 g." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Mozzarella de referência em Luanda: 15.000–20.000 Kz/kg. Peito: 5.000–8.000. Coxa: 2.500–4.000." })
					]
				})]
			})
		]
	});
}
function Stock({ actor }) {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["stock"],
		queryFn: () => getStock()
	});
	const [ingredientId, setIngredientId] = (0, import_react.useState)(0);
	const [kind, setKind] = (0, import_react.useState)("entrada");
	const [qty, setQty] = (0, import_react.useState)("1");
	const [reason, setReason] = (0, import_react.useState)("");
	const [cost, setCost] = (0, import_react.useState)("0");
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "A contar o stock…"
	});
	const chosen = ingredientId || q.data.ingredients[0]?.id || 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-2 rounded-3xl bg-paper p-4 shadow-card",
				onSubmit: (e) => {
					e.preventDefault();
					adjustStock({ data: {
						ingredientId: chosen,
						kind,
						qty: Number(qty),
						reason,
						actor,
						costKz: Number(cost)
					} }).then(() => {
						toast.success("Stock atualizado");
						setReason("");
						qc.invalidateQueries({ queryKey: ["stock"] });
						qc.invalidateQueries({ queryKey: ["dash"] });
					}).catch((error) => toast.error(errText(error)));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: chosen,
								onChange: (e) => setIngredientId(Number(e.target.value)),
								className: "min-h-12 rounded-2xl bg-cream px-3",
								children: q.data.ingredients.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: i.id,
									children: i.name
								}, i.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: kind,
								onChange: (e) => setKind(e.target.value),
								className: "min-h-12 rounded-2xl bg-cream px-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "entrada",
										children: "Entrada (compra)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "quebra",
										children: "Quebra / desperdício"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "interno",
										children: "Consumo interno"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "contagem",
										children: "Contagem física"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: qty,
								onChange: (e) => setQty(e.target.value),
								inputMode: "numeric",
								className: "min-h-12 rounded-2xl bg-cream px-3",
								placeholder: "Quantidade"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: cost,
								onChange: (e) => setCost(e.target.value),
								inputMode: "numeric",
								className: "min-h-12 rounded-2xl bg-cream px-3",
								placeholder: "Custo total da compra (Kz) — actualiza o preço"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: reason,
						onChange: (e) => setReason(e.target.value),
						placeholder: "Motivo ou fornecedor",
						className: "min-h-12 rounded-2xl bg-cream px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "min-h-12 rounded-2xl bg-tomato font-semibold text-on-tomato",
						children: "Registar movimento"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: q.data.ingredients.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-2xl bg-paper p-3 shadow-card", i.stock <= i.min && "ring-2 ring-tomato"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: i.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "tabular-nums",
						children: [
							i.stock,
							" ",
							i.unit,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [
									"mín. ",
									i.min,
									" · ",
									i.unit === "unidade" ? `${kz(Math.round(i.costCents / 100))}/un` : `${kz(Math.round(i.costCents * 1e3 / 100))}/${i.unit === "ml" ? "l" : "kg"}`
								]
							})
						]
					})]
				}, i.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Movimentos"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 text-sm",
				children: q.data.moves.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-paper px-3 py-2 shadow-card",
					children: [
						diaCurto(m.at),
						" ",
						hora(m.at),
						" · ",
						m.name,
						" ",
						m.qty > 0 ? "+" : "",
						m.qty,
						" ",
						m.unit,
						" · ",
						m.kind,
						" · ",
						m.reason
					]
				}, m.id))
			})
		]
	});
}
function Ponto() {
	const q = useQuery({
		queryKey: ["punches"],
		queryFn: () => getPunches()
	});
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "A ler o ponto…"
	});
	const byStaff = /* @__PURE__ */ new Map();
	const sorted = [...q.data.punches].sort((a, b) => a.at.localeCompare(b.at));
	const open = /* @__PURE__ */ new Map();
	for (const p of sorted) {
		if (p.kind === "entrada" || p.kind === "regresso") open.set(p.staffId, p.at);
		if ((p.kind === "saida" || p.kind === "pausa") && open.has(p.staffId)) {
			const start = open.get(p.staffId);
			const ms = new Date(p.at).getTime() - new Date(start).getTime();
			const bag = byStaff.get(p.staffId) ?? {
				name: p.name,
				ms: 0
			};
			bag.ms += Math.max(0, ms);
			byStaff.set(p.staffId, bag);
			if (p.kind === "saida") open.delete(p.staffId);
		}
	}
	for (const [staffId, start] of open) {
		const person = q.data.staff.find((s) => s.id === staffId);
		const bag = byStaff.get(staffId) ?? {
			name: person?.name ?? "",
			ms: 0
		};
		bag.ms += Math.max(0, Date.now() - new Date(start).getTime());
		byStaff.set(staffId, bag);
	}
	function csv() {
		downloadCsv("pezzo-ponto.csv", [[
			"nome",
			"tipo",
			"hora",
			"offline"
		], ...q.data.punches.map((p) => [
			p.name,
			p.kind,
			p.at,
			p.offline ? "sim" : "nao"
		])]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: csv,
				className: "min-h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow-card",
				children: "Exportar CSV"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => window.print(),
				className: "min-h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow-card",
				children: "Imprimir / PDF"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 grid gap-2 sm:grid-cols-2",
			children: q.data.staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-paper p-3 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: s.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						s.role,
						" · ",
						Math.round((byStaff.get(s.id)?.ms ?? 0) / 36e5),
						" h nos registos recentes"
					]
				})]
			}, s.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-1 text-sm",
			children: q.data.punches.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex justify-between rounded-xl bg-paper px-3 py-2 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					p.name,
					" · ",
					p.kind,
					p.offline ? " · offline" : ""
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums text-muted",
					children: [
						diaCurto(p.at),
						" ",
						hora(p.at)
					]
				})]
			}, p.id))
		})
	] });
}
function Clientes({ actor }) {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["customers"],
		queryFn: () => getCustomers()
	});
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "A abrir as fichas…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Segmentos: novo, frequente, VIP, em risco (14 dias) e inativo (30). A 10.ª pizza é oferta."
		}), q.data.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-3xl bg-paper p-4 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: c.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							c.phone,
							" · ",
							c.channel
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl tabular-nums",
						children: kz(c.spent)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-1",
					children: [c.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-amber px-2 py-1 text-xs font-semibold text-on-amber",
						children: t
					}, t)), c.birthdaySoon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-tomato px-2 py-1 text-xs font-semibold text-on-tomato",
						children: "aniversário"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm",
					children: [
						c.orders,
						" pedidos · ticket ",
						kz(c.ticket),
						" · ",
						c.pizzas,
						" pizzas · ",
						c.points,
						" pontos"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						c.address,
						" · ",
						c.landmark
					]
				}),
				c.allergies && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-semibold text-tomato",
					children: ["Alergia: ", c.allergies]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-2 grid gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						const fd = new FormData(e.currentTarget);
						saveCustomer({ data: {
							id: c.id,
							actor,
							notes: String(fd.get("notes") ?? ""),
							allergies: String(fd.get("allergies") ?? ""),
							optIn: fd.get("opt") === "on"
						} }).then(() => {
							toast.success("Ficha guardada");
							qc.invalidateQueries({ queryKey: ["customers"] });
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "allergies",
							defaultValue: c.allergies,
							placeholder: "Alergias",
							className: "min-h-11 rounded-xl bg-cream px-3 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "notes",
							defaultValue: c.notes,
							placeholder: "Notas",
							className: "min-h-11 rounded-xl bg-cream px-3 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								name: "opt",
								defaultChecked: c.optIn,
								className: "size-4"
							}), "Aceita promoções"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "min-h-11 rounded-xl bg-bordeaux text-sm font-semibold text-on-tomato",
							children: "Guardar ficha"
						})
					]
				})
			]
		}, c.id))]
	});
}
function Ia({ actor }) {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["ideas"],
		queryFn: () => getSuggestions()
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "A ler sugestões…"
	});
	const phone = "+244924499486";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Nada sai sozinho. O Grok propõe, tu aprovas, e só depois abres o WhatsApp."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: busy,
				onClick: () => {
					setBusy(true);
					askGrok({ data: { actor } }).then((res) => {
						toast.success(res.title);
						qc.invalidateQueries({ queryKey: ["ideas"] });
					}).catch((error) => toast.error(errText(error))).finally(() => setBusy(false));
				},
				className: "min-h-12 rounded-2xl bg-tomato font-semibold text-on-tomato",
				children: busy ? "O Grok está a pensar…" : "Pedir uma sugestão ao Grok"
			}),
			q.data.suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-3xl bg-paper p-4 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted",
						children: [
							s.source === "grok" ? "Grok" : "Equipa",
							" · ",
							s.status
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: s.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: s.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: ["Para: ", s.audience]
					}),
					s.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 rounded-2xl bg-cream p-3 text-sm",
						children: s.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							s.status === "pendente" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void decideSuggestion({ data: {
									id: s.id,
									status: "aprovada",
									actor
								} }).then(() => qc.invalidateQueries({ queryKey: ["ideas"] })),
								className: "min-h-11 rounded-full bg-amber px-3 text-sm font-semibold text-on-amber",
								children: "Aprovar"
							}),
							s.status !== "dispensada" && s.status !== "enviada" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void decideSuggestion({ data: {
									id: s.id,
									status: "dispensada",
									actor
								} }).then(() => qc.invalidateQueries({ queryKey: ["ideas"] })),
								className: "min-h-11 rounded-full bg-paper px-3 text-sm font-semibold shadow-card",
								children: "Dispensar"
							}),
							s.message && s.status === "aprovada" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: waLink(phone, s.message),
								className: "inline-flex min-h-11 items-center rounded-full bg-tomato px-3 text-sm font-semibold text-on-tomato",
								children: "Abrir WhatsApp"
							}),
							s.status === "aprovada" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void decideSuggestion({ data: {
									id: s.id,
									status: "enviada",
									actor
								} }).then(() => qc.invalidateQueries({ queryKey: ["ideas"] })),
								className: "min-h-11 rounded-full bg-bordeaux px-3 text-sm font-semibold text-on-tomato",
								children: "Marcar como enviada"
							})
						]
					})
				]
			}, s.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Cupões"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 text-sm",
				children: q.data.coupons.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-paper px-3 py-2 shadow-card",
					children: [
						c.code,
						" · ",
						c.label,
						" · ",
						c.used,
						"/",
						c.maxUses
					]
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-2 sm:grid-cols-2",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					saveCoupon({ data: {
						actor,
						code: String(fd.get("code") ?? ""),
						label: String(fd.get("label") ?? ""),
						kind: String(fd.get("kind") ?? "percent"),
						value: Number(fd.get("value") ?? 0),
						maxUses: Number(fd.get("max") ?? 20)
					} }).then(() => {
						toast.success("Cupão guardado");
						qc.invalidateQueries({ queryKey: ["ideas"] });
					}).catch((error) => toast.error(errText(error)));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "code",
						placeholder: "CÓDIGO",
						className: "min-h-12 rounded-2xl bg-paper px-3 shadow-card"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "label",
						placeholder: "Nome da campanha",
						className: "min-h-12 rounded-2xl bg-paper px-3 shadow-card"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						name: "kind",
						className: "min-h-12 rounded-2xl bg-paper px-3 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "percent",
								children: "Percentagem"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "fixo",
								children: "Valor fixo (Kz)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "entrega",
								children: "Entrega grátis"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "value",
						defaultValue: "10",
						className: "min-h-12 rounded-2xl bg-paper px-3 shadow-card"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "min-h-12 rounded-2xl bg-tomato font-semibold text-on-tomato sm:col-span-2",
						children: "Criar cupão"
					})
				]
			})
		]
	});
}
function Loja({ actor }) {
	const q = useQuery({
		queryKey: ["settings"],
		queryFn: () => getAdminSettings()
	});
	const audit = useQuery({
		queryKey: ["audit"],
		queryFn: () => getAudit()
	});
	const qc = useQueryClient();
	const [phones, setPhones] = (0, import_react.useState)("");
	const [fence, setFence] = (0, import_react.useState)("100");
	const [apiKey, setApiKey] = (0, import_react.useState)("");
	const [zones, setZones] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!q.data) return;
		setPhones(q.data.settings.phones.join(" | "));
		setFence(String(q.data.settings.geofenceM));
		setApiKey(q.data.settings.apiKey);
		setZones(q.data.zones);
	}, [q.data]);
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "A abrir a loja…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-2 rounded-3xl bg-paper p-4 shadow-card",
				onSubmit: (e) => {
					e.preventDefault();
					saveSettings({ data: {
						actor,
						phones,
						geofenceM: Number(fence),
						apiKey,
						zones: zones.map((z) => ({
							id: z.id,
							feeKz: z.feeKz,
							etaMin: z.etaMin
						}))
					} }).then(() => {
						toast.success("Definições guardadas");
						qc.invalidateQueries({ queryKey: ["settings"] });
						qc.invalidateQueries({ queryKey: ["menu"] });
					}).catch((error) => toast.error(errText(error)));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-semibold",
						children: "Telefones (separa com |)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: phones,
						onChange: (e) => setPhones(e.target.value),
						className: "min-h-12 rounded-2xl bg-cream px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-semibold",
						children: "Geofence do ponto (metros)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: fence,
						onChange: (e) => setFence(e.target.value),
						className: "min-h-12 rounded-2xl bg-cream px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-semibold",
						children: "Chave da API dos agentes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: apiKey,
						onChange: (e) => setApiKey(e.target.value),
						className: "min-h-12 rounded-2xl bg-cream px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Zonas de entrega"
					}),
					zones.map((z, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "col-span-3 text-sm font-semibold sm:col-span-1 sm:self-center",
								children: z.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: z.feeKz,
								onChange: (e) => setZones(zones.map((x, idx) => idx === i ? {
									...x,
									feeKz: Number(e.target.value)
								} : x)),
								className: "min-h-11 rounded-xl bg-cream px-2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: z.etaMin,
								onChange: (e) => setZones(zones.map((x, idx) => idx === i ? {
									...x,
									etaMin: Number(e.target.value)
								} : x)),
								className: "min-h-11 rounded-xl bg-cream px-2"
							})
						]
					}, z.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "min-h-12 rounded-2xl bg-tomato font-semibold text-on-tomato",
						children: "Guardar loja"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-paper p-4 text-sm shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "API para agentes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2",
						children: [
							"Cabeçalho ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: "x-pezzo-key"
							}),
							". Rotas: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: "/api/v1/resumo"
							}),
							", pedidos, stock, clientes, eventos. Criar encomenda: POST ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: "/api/v1/encomendas"
							}),
							" com cliente, zonaId, morada, referencia, itens."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "O WhatsApp Business Cloud API e o Instagram Messaging pedem credenciais da Meta — os pedidos desses canais já entram na mesma fila (balcão, telefone ou agente). O mapa usa OpenStreetMap, sem chave. O ponto recusa picagens fora do raio."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "Offline: cozinha, estafeta e pedido guardam a fila neste telemóvel e sincronizam quando a rede volta. No stock, os movimentos somam — não se pisa o saldo."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Auditoria"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1 text-sm",
				children: (audit.data ?? []).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-paper px-3 py-2 shadow-card",
					children: [
						hora(a.at),
						" · ",
						a.actor,
						" · ",
						a.action,
						" · ",
						a.detail
					]
				}, `${a.at}-${i}`))
			})] })
		]
	});
}
function downloadCsv(name, rows) {
	const csv = rows.map((r) => r.map((c) => `"${c.replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
	const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = name;
	a.click();
	URL.revokeObjectURL(a.href);
}
//#endregion
export { AdminPage as component };
