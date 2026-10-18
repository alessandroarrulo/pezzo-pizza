import { g as waLink, i as STATUS_LABEL, m as shopStatus, t as CHANNEL_LABEL } from "./format-C5Rj_BD_.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { c as MessageCircle, d as Clock, f as ChefHat, l as MapPin, o as Pizza, p as Bike, u as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { i as Route$6 } from "./router-CWPUABcm.mjs";
import { a as useSession, n as Shell, t as PROFILES } from "./shell-Df-kaV5i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B1yXiR9P.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const data = Route$6.useLoaderData();
	const navigate = useNavigate();
	const setProfile = useSession((s) => s.setProfile);
	const status = shopStatus();
	const phoneA = data.settings.phones[0] ?? "";
	const phoneB = data.settings.phones[1] ?? "";
	function enter(name, to) {
		const profile = PROFILES.find((p) => p.name === name) ?? PROFILES[0];
		setProfile(profile);
		navigate({ to });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold uppercase tracking-wide text-tomato",
					children: "Maianga · Luanda"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-5xl leading-none text-bordeaux sm:text-6xl",
					children: "Mais sabor em cada fatia"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-lg text-muted",
					children: "O melhor delivery da cidade. Sabor que chega até si — da Rua Marien Ngouabi, mesmo ao lado da Tudor."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => enter("Cliente", "/pedir"),
						className: "inline-flex min-h-12 items-center gap-2 rounded-full bg-tomato px-5 font-semibold text-on-tomato shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pizza, { className: "size-5" }), "Fazer pedido"]
					}), phoneA && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: waLink(phoneA, "Olá Pezzo! Quero fazer um pedido."),
						className: "inline-flex min-h-12 items-center gap-2 rounded-full bg-amber px-5 font-semibold text-on-amber",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-5" }), "WhatsApp"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 rounded-full bg-paper px-3 py-2 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-tomato" }),
							status.label,
							" · ",
							status.clock
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 rounded-full bg-paper px-3 py-2 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-tomato" }), data.settings.hoursLabel]
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/menu/real/casa.jpg",
				alt: "Pizzas da Pezzo, na casa",
				className: "mx-auto aspect-[4/5] w-full max-w-md rounded-3xl object-cover shadow-lift"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Door, {
					title: "Cliente",
					text: "Ementa, cria a tua pizza e acompanha o estafeta.",
					onClick: () => enter("Cliente", "/pedir")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Door, {
					title: "Cozinha",
					text: "Fila, ficha técnica e stock que se abate sozinho.",
					onClick: () => enter("Carla Kapingana", "/cozinha"),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Door, {
					title: "Estafeta",
					text: "Aceitar entregas, GPS e código de 4 dígitos.",
					onClick: () => enter("João Muongo", "/estafeta"),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Door, {
					title: "Gestão",
					text: "O dia, clientes, ponto, cupões e sugestões do Grok.",
					onClick: () => enter("Ana Tavares", "/admin"),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "size-5" })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Agora na fila"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/acompanhar/$token",
					params: { token: "demo-quente" },
					className: "text-sm font-semibold text-tomato",
					children: "Ver a entrega da Marta"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2",
				children: [data.live.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "A cozinha está em pausa. Faz o primeiro pedido."
				}), data.live.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: o.code
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: o.itemSummary
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-tomato",
							children: STATUS_LABEL[o.status]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: CHANNEL_LABEL[o.channel]
						})]
					})]
				}, o.code))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 grid gap-4 rounded-3xl bg-paper p-4 shadow-card sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					label: "Telefones",
					value: [phoneA, phoneB].filter(Boolean).join(" · ")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					label: "Morada",
					value: data.settings.address
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					label: "Redes",
					value: `${data.settings.instagram} · ${data.settings.email}`
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "O preçário"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-muted",
					children: "O mesmo cartaz da casa, já na app. Os preços também se editam na gestão."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/marca/precario.jpg",
					alt: "Preçário Pezzo Pizza",
					className: "mt-4 w-full rounded-3xl shadow-card"
				})
			]
		})
	] });
}
function Door({ title, text, onClick, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "rounded-3xl bg-paper p-4 text-left shadow-card transition-shadow duration-150 hover:shadow-lift",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 font-display text-2xl",
			children: [icon, title]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: text
		})]
	});
}
function Info({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-semibold uppercase tracking-wide text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 text-sm",
		children: value
	})] });
}
//#endregion
export { Home as component };
