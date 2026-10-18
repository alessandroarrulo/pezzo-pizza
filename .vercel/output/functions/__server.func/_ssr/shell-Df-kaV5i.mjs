import { o as __toESM } from "../_runtime.mjs";
import { l as errText, u as hora } from "./format-C5Rj_BD_.mjs";
import { f as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { T as placeOrder, a as confirmDelivery, s as doPunch } from "./fns-CItOgTXU.mjs";
import { f as ChefHat, n as WifiOff, o as Pizza, p as Bike, t as Wifi, u as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-Df-kaV5i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PROFILES = [
	{
		role: "cliente",
		staffId: null,
		name: "Cliente",
		title: "Fazer um pedido"
	},
	{
		role: "cozinha",
		staffId: 3,
		name: "Carla Kapingana",
		title: "Cozinha"
	},
	{
		role: "estafeta",
		staffId: 4,
		name: "João Muongo",
		title: "Estafeta"
	},
	{
		role: "admin",
		staffId: 1,
		name: "Ana Tavares",
		title: "Administração"
	},
	{
		role: "admin",
		staffId: 2,
		name: "Miguel Sousa",
		title: "Gerente"
	}
];
var useSession = create()(persist((set) => ({
	profile: PROFILES[0],
	simulatedOffline: false,
	sound: true,
	kdsDark: false,
	queue: [],
	lastSync: null,
	favorites: [],
	phone: "",
	customerName: "",
	setProfile: (profile) => set({ profile }),
	setOffline: (simulatedOffline) => set({ simulatedOffline }),
	setSound: (sound) => set({ sound }),
	setKdsDark: (kdsDark) => set({ kdsDark }),
	setCustomer: (customerName, phone) => set({
		customerName,
		phone
	}),
	toggleFavorite: (id) => set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id] })),
	enqueue: (job) => set((s) => ({ queue: [...s.queue, job] })),
	dequeue: (id) => set((s) => ({ queue: s.queue.filter((j) => j.id !== id) })),
	markSync: (lastSync) => set({ lastSync })
}), {
	name: "pezzo-session",
	skipHydration: true
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Shell({ children, kds = false }) {
	const profile = useSession((s) => s.profile);
	const queue = useSession((s) => s.queue);
	const offline = useSession((s) => s.simulatedOffline);
	const lastSync = useSession((s) => s.lastSync);
	const setProfile = useSession((s) => s.setProfile);
	const setOffline = useSession((s) => s.setOffline);
	const dark = useSession((s) => s.kdsDark);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [navOnline, setNavOnline] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		useSession.persist.rehydrate();
		const on = () => setNavOnline(true);
		const off = () => setNavOnline(false);
		setNavOnline(navigator.onLine);
		window.addEventListener("online", on);
		window.addEventListener("offline", off);
		return () => {
			window.removeEventListener("online", on);
			window.removeEventListener("offline", off);
		};
	}, []);
	const online = navOnline && !offline;
	async function flush() {
		const jobs = [...useSession.getState().queue];
		if (!jobs.length) {
			useSession.getState().markSync((/* @__PURE__ */ new Date()).toISOString());
			toast.success("Nada por enviar.");
			return;
		}
		for (const job of jobs) try {
			if (job.type === "order") await placeOrder({ data: job.body });
			if (job.type === "punch") await doPunch({ data: job.body });
			if (job.type === "deliver") await confirmDelivery({ data: job.body });
			useSession.getState().dequeue(job.id);
		} catch (error) {
			toast.error(errText(error));
			return;
		}
		useSession.getState().markSync((/* @__PURE__ */ new Date()).toISOString());
		toast.success("Sincronizado.");
	}
	(0, import_react.useEffect)(() => {
		if (!online) return;
		if (!useSession.getState().queue.length) return;
		flush();
	}, [online]);
	const syncLabel = !online ? queue.length ? `Offline · ${queue.length} por enviar` : "Offline" : queue.length ? `A sincronizar · ${queue.length}` : lastSync ? `Sincronizado às ${hora(lastSync)}` : "Online";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn(kds && dark && "kds"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex min-h-11 items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/marca/logo.jpg",
								alt: "Pezzo Pizza",
								className: "size-11 rounded-2xl object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xl leading-none",
								children: "Pezzo"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void flush(),
							className: "ml-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-3 text-sm shadow-card",
							children: [online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "size-4 text-tomato" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "max-w-40 truncate",
								children: syncLabel
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setOpen((v) => !v),
							className: "inline-flex min-h-11 items-center rounded-full bg-bordeaux px-3 text-sm font-semibold text-on-tomato",
							children: profile.name.split(" ")[0]
						})
					]
				}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-1 px-4 pb-3 sm:grid-cols-2",
					children: [PROFILES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setProfile(p);
							setOpen(false);
						},
						className: cn("flex min-h-12 items-center justify-between rounded-2xl bg-paper px-3 text-left shadow-card", profile.name === p.name && "ring-2 ring-tomato"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: p.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: p.name
						})]
					}, p.name)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setOffline(!offline),
						className: "min-h-12 rounded-2xl bg-amber px-3 text-left font-semibold text-on-amber",
						children: offline ? "Voltar a estar online" : "Simular rede fraca (offline)"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl px-4 py-5 pb-28",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
							to: "/pedir",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pizza, { className: "size-5" }),
							label: "Pedir"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
							to: "/cozinha",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "size-5" }),
							label: "Cozinha"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
							to: "/estafeta",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "size-5" }),
							label: "Estafeta"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
							to: "/admin",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "size-5" }),
							label: "Gestão"
						})
					]
				})
			})
		]
	});
}
function Tab({ to, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-muted data-[status=active]:text-tomato",
		activeProps: { "data-status": "active" },
		children: [icon, label]
	});
}
function useOnline() {
	const simulated = useSession((s) => s.simulatedOffline);
	const [nav, setNav] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const sync = () => setNav(navigator.onLine);
		sync();
		window.addEventListener("online", sync);
		window.addEventListener("offline", sync);
		return () => {
			window.removeEventListener("online", sync);
			window.removeEventListener("offline", sync);
		};
	}, []);
	return nav && !simulated;
}
//#endregion
export { useSession as a, useOnline as i, Shell as n, cn as r, PROFILES as t };
