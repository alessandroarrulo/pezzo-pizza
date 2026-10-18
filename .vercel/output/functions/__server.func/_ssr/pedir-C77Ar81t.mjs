import { o as __toESM } from "../_runtime.mjs";
import { d as kz, l as errText, m as shopStatus, t as CHANNEL_LABEL } from "./format-C5Rj_BD_.mjs";
import { f as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { E as quoteOrder, T as placeOrder, _ as getMenu } from "./fns-CItOgTXU.mjs";
import { a as Plus, i as Star, o as Pizza, s as Minus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$2 } from "./router-CWPUABcm.mjs";
import { a as useSession, i as useOnline, n as Shell, r as cn } from "./shell-Df-kaV5i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pedir-C77Ar81t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FoodPhoto({ src, name, className }) {
	const [bad, setBad] = (0, import_react.useState)(false);
	if (!src || bad) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("grid place-items-center bg-amber text-bordeaux", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pizza, {
			className: "size-8",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: name
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: name,
		onError: () => setBad(true),
		className: cn("h-full w-full object-cover", className)
	});
}
function PedirPage() {
	const { canal } = Route$2.useSearch();
	const navigate = useNavigate();
	const online = useOnline();
	const menu = useQuery({
		queryKey: ["menu"],
		queryFn: () => getMenu()
	});
	const favorites = useSession((s) => s.favorites);
	const toggleFavorite = useSession((s) => s.toggleFavorite);
	const savedName = useSession((s) => s.customerName);
	const savedPhone = useSession((s) => s.phone);
	const setCustomer = useSession((s) => s.setCustomer);
	const enqueue = useSession((s) => s.enqueue);
	const profile = useSession((s) => s.profile);
	const [cat, setCat] = (0, import_react.useState)("all");
	const [cart, setCart] = (0, import_react.useState)([]);
	const [custom, setCustom] = (0, import_react.useState)(null);
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [payOpen, setPayOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)(savedName);
	const [phone, setPhone] = (0, import_react.useState)(savedPhone);
	const [zoneId, setZoneId] = (0, import_react.useState)(2);
	const [address, setAddress] = (0, import_react.useState)("");
	const [landmark, setLandmark] = (0, import_react.useState)("");
	const [payment, setPayment] = (0, import_react.useState)("dinheiro");
	const [proof, setProof] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [coupon, setCoupon] = (0, import_react.useState)("");
	const [quote, setQuote] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const status = shopStatus();
	const products = menu.data?.products.filter((p) => p.active && (cat === "all" || p.categoryId === cat)) ?? [];
	function add(product, extras = [], lineNotes = "") {
		setCart((prev) => {
			const key = `${product.id}:${extras.map((e) => e.id).join("-")}:${lineNotes}`;
			if (prev.find((l) => l.key === key)) return prev.map((l) => l.key === key ? {
				...l,
				qty: l.qty + 1
			} : l);
			return [...prev, {
				key,
				product,
				qty: 1,
				extras,
				notes: lineNotes
			}];
		});
		setCustom(null);
		setPicked([]);
		toast.success(`${product.name} no carrinho`);
	}
	const count = cart.reduce((s, l) => s + l.qty, 0);
	const rough = cart.reduce((s, l) => s + (l.product.priceKz + l.extras.reduce((e, x) => e + x.extraKz, 0)) * l.qty, 0);
	const payload = (0, import_react.useMemo)(() => {
		if (!menu.data || cart.length === 0) return null;
		return {
			clientRef: "",
			customerName: name,
			phone,
			channel: canal,
			zoneId,
			address,
			landmark,
			payment,
			proof,
			notes,
			coupon,
			actor: profile.role === "cliente" ? name || "Cliente" : profile.name,
			items: cart.map((l) => ({
				productId: l.product.id,
				qty: l.qty,
				notes: l.notes,
				extras: l.extras.map((e) => e.id)
			}))
		};
	}, [
		menu.data,
		cart,
		name,
		phone,
		canal,
		zoneId,
		address,
		landmark,
		payment,
		proof,
		notes,
		coupon,
		profile
	]);
	async function preview() {
		if (!payload) return;
		try {
			setQuote(await quoteOrder({ data: {
				...payload,
				clientRef: "quote"
			} }));
		} catch (error) {
			setQuote(null);
			toast.error(errText(error));
		}
	}
	async function submit() {
		if (!payload) return;
		const body = {
			...payload,
			clientRef: crypto.randomUUID()
		};
		setCustomer(name, phone);
		if (!online) {
			enqueue({
				id: body.clientRef,
				type: "order",
				body,
				at: (/* @__PURE__ */ new Date()).toISOString()
			});
			toast("Pedido guardado neste telemóvel. Sai quando a rede voltar.");
			setCart([]);
			setPayOpen(false);
			return;
		}
		setBusy(true);
		try {
			const res = await placeOrder({ data: body });
			toast.success(`${res.code} recebido`);
			setCart([]);
			await navigate({
				to: "/acompanhar/$token",
				params: { token: res.token }
			});
		} catch (error) {
			toast.error(errText(error));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-tomato",
				children: CHANNEL_LABEL[canal]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "A ementa"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("rounded-full px-3 py-1 text-sm font-semibold", status.open ? "bg-amber text-on-amber" : "bg-bordeaux text-on-tomato"),
				children: status.label
			})]
		}),
		!status.open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 rounded-2xl bg-paper p-3 text-sm shadow-card",
			children: "A cozinha abre terça a domingo, das 10h às 20h. Podes deixar o pedido na mesma — a equipa vê-o assim que entrar."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex gap-2 overflow-x-auto pb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				on: cat === "all",
				onClick: () => setCat("all"),
				children: "Tudo"
			}), menu.data?.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				on: cat === c.id,
				onClick: () => setCat(c.id),
				children: c.name
			}, c.id))]
		}),
		menu.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 text-muted",
			children: "A abrir o forno…"
		}),
		menu.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 text-tomato",
			children: "Não consegui carregar a ementa."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-2",
			children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "overflow-hidden rounded-3xl bg-paper shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodPhoto, {
						src: p.photo,
						name: p.name,
						className: "h-40"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": favorites.includes(p.id) ? "Tirar dos favoritos" : "Favorito",
						onClick: () => toggleFavorite(p.id),
						className: "absolute right-2 top-2 grid size-11 place-items-center rounded-full bg-paper text-tomato",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-5", favorites.includes(p.id) && "fill-amber") })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl leading-none",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: p.description
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "shrink-0 font-display text-xl tabular-nums",
							children: kz(p.priceKz)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => p.custom ? setCustom(p) : add(p),
						className: "mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-tomato font-semibold text-on-tomato",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), p.custom ? "Criar" : "Adicionar"]
					})]
				})]
			}, p.id))
		}),
		custom && menu.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40 grid items-end bg-bordeaux/40 p-3 sm:items-center sm:justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream p-4 shadow-lift",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: "Cria a tua pizza"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Base ",
							kz(custom.priceKz),
							". Cada extra tem o seu preço."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-2 gap-2",
						children: menu.data.toppings.map((t) => {
							const on = picked.includes(t.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPicked((ids) => on ? ids.filter((id) => id !== t.id) : [...ids, t.id]),
								className: cn("min-h-12 rounded-2xl px-3 text-left text-sm shadow-card", on ? "bg-amber text-on-amber" : "bg-paper"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: t.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-xs",
									children: ["+ ", kz(t.extraKz)]
								})]
							}, t.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-2xl tabular-nums",
						children: kz(custom.priceKz + menu.data.toppings.filter((t) => picked.includes(t.id)).reduce((s, t) => s + t.extraKz, 0))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCustom(null),
							className: "min-h-12 flex-1 rounded-2xl bg-paper font-semibold shadow-card",
							children: "Fechar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => add(custom, menu.data.toppings.filter((t) => picked.includes(t.id))),
							className: "min-h-12 flex-1 rounded-2xl bg-tomato font-semibold text-on-tomato",
							children: "Adicionar"
						})]
					})
				]
			})
		}),
		count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-x-0 bottom-16 z-20 mx-auto max-w-6xl px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					setPayOpen(true);
					preview();
				},
				className: "flex min-h-14 w-full items-center justify-between rounded-full bg-bordeaux px-5 font-semibold text-on-tomato shadow-lift",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					count,
					" ",
					count === 1 ? "item" : "itens"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums",
					children: [kz(rough), " · pedir"]
				})]
			})
		}),
		payOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40 overflow-y-auto bg-cream",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-lg px-4 py-5 pb-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-4xl",
						children: "O teu pedido"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: cart.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2 rounded-2xl bg-paper p-3 shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: l.product.name
									}), l.extras.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: l.extras.map((e) => e.name).join(", ")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "grid size-11 place-items-center rounded-full bg-cream",
									onClick: () => setCart((c) => c.flatMap((x) => x.key === l.key ? x.qty > 1 ? [{
										...x,
										qty: x.qty - 1
									}] : [] : [x])),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-6 text-center tabular-nums",
									children: l.qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "grid size-11 place-items-center rounded-full bg-cream",
									onClick: () => setCart((c) => c.map((x) => x.key === l.key ? {
										...x,
										qty: x.qty + 1
									} : x)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
								})
							]
						}, l.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nome",
								value: name,
								onChange: setName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Telefone",
								value: phone,
								onChange: setPhone,
								placeholder: "924 000 000"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1 text-sm font-semibold",
								children: ["Zona", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "min-h-12 rounded-2xl bg-paper px-3 shadow-card",
									value: zoneId,
									onChange: (e) => setZoneId(Number(e.target.value)),
									children: menu.data?.zones.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: z.id,
										children: [
											z.name,
											" · ",
											z.feeKz ? kz(z.feeKz) : "sem taxa",
											" · ~",
											z.etaMin,
											" min"
										]
									}, z.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Morada",
								value: address,
								onChange: setAddress
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Ponto de referência",
								value: landmark,
								onChange: setLandmark,
								placeholder: "Próximo à Tudor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1 text-sm font-semibold",
								children: ["Pagamento", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "min-h-12 rounded-2xl bg-paper px-3 shadow-card",
									value: payment,
									onChange: (e) => setPayment(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "dinheiro",
											children: "Dinheiro na entrega"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "tpa",
											children: "TPA / cartão na entrega"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "multicaixa",
											children: "Multicaixa Express"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "transferencia",
											children: "Transferência bancária"
										})
									]
								})]
							}),
							payment === "transferencia" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Referência do comprovativo",
								value: proof,
								onChange: setProof
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Cupão",
								value: coupon,
								onChange: (v) => setCoupon(v.toUpperCase()),
								placeholder: "PEZZO10"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Notas para a cozinha",
								value: notes,
								onChange: setNotes
							})
						]
					}),
					quote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-3xl bg-paper p-4 shadow-card",
						children: [
							quote.lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									l.qty,
									"× ",
									l.name
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: kz(l.lineKz)
								})]
							}, l.name)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 flex justify-between text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Entrega" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: kz(quote.deliveryKz)
								})]
							}),
							quote.discountKz > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex justify-between text-sm text-tomato",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Desconto ", quote.couponLabel] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums",
									children: ["− ", kz(quote.discountKz)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 flex justify-between font-display text-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: kz(quote.totalKz)
								})]
							}),
							quote.loyaltyNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-tomato",
								children: quote.loyaltyNote
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									"Estimativa ~",
									quote.etaMin,
									" min depois de sair do forno."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPayOpen(false),
							className: "min-h-12 flex-1 rounded-2xl bg-paper font-semibold shadow-card",
							children: "Voltar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void preview(),
							className: "min-h-12 flex-1 rounded-2xl bg-amber font-semibold text-on-amber",
							children: "Atualizar total"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: () => void submit(),
						className: "mt-2 min-h-14 w-full rounded-full bg-tomato font-semibold text-on-tomato disabled:opacity-60",
						children: busy ? "A enviar…" : online ? "Confirmar pedido" : "Guardar offline"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-center text-xs text-muted",
						children: "A cada 10 pizzas, uma sai por nossa conta."
					})
				]
			})
		})
	] });
}
function Chip({ children, on, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold", on ? "bg-bordeaux text-on-tomato" : "bg-paper shadow-card"),
		children
	});
}
function Field({ label, value, onChange, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1 text-sm font-semibold",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			placeholder,
			onChange: (e) => onChange(e.target.value),
			className: "min-h-12 rounded-2xl bg-paper px-3 font-normal shadow-card"
		})]
	});
}
//#endregion
export { PedirPage as component };
