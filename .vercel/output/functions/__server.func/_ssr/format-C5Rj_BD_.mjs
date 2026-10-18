//#region node_modules/.nitro/vite/services/ssr/assets/format-C5Rj_BD_.js
function kz(value) {
	const rounded = Math.round(value);
	return `${rounded < 0 ? "-" : ""}${Math.abs(rounded).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Kz`;
}
function normPhone(raw) {
	const d = raw.replace(/[^\d+]/g, "");
	if (d.startsWith("+")) return d;
	if (d.startsWith("00244")) return `+${d.slice(2)}`;
	if (d.startsWith("244")) return `+${d}`;
	if (d.length >= 9 && d.startsWith("9")) return `+244${d}`;
	return d;
}
function luandaParts(date = /* @__PURE__ */ new Date()) {
	const fmt = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Africa/Luanda",
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	});
	return Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
}
function shopStatus(date = /* @__PURE__ */ new Date()) {
	const p = luandaParts(date);
	const hour = Number(p.hour);
	const monday = p.weekday === "Mon";
	const open = !monday && hour >= 10 && hour < 20;
	return {
		open,
		monday,
		label: open ? "Aberto agora" : monday ? "Fechado à segunda" : "Fechado",
		clock: `${p.hour}:${p.minute}`
	};
}
function hora(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return new Intl.DateTimeFormat("pt-PT", {
		timeZone: "Africa/Luanda",
		hour: "2-digit",
		minute: "2-digit"
	}).format(d);
}
function diaCurto(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return new Intl.DateTimeFormat("pt-PT", {
		timeZone: "Africa/Luanda",
		day: "2-digit",
		month: "short"
	}).format(d);
}
function diaChave(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Africa/Luanda",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(d);
}
function elapsed(iso, now) {
	const s = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1e3));
	const m = Math.floor(s / 60);
	const h = Math.floor(m / 60);
	if (h > 0) return `${h}h ${String(m % 60).padStart(2, "0")}m`;
	return `${m}:${String(s % 60).padStart(2, "0")}`;
}
function urgency(iso, now) {
	const m = (now - new Date(iso).getTime()) / 6e4;
	if (m >= 25) return "late";
	if (m >= 15) return "warn";
	return "ok";
}
function meters(aLat, aLng, bLat, bLng) {
	const R = 6371e3;
	const dLat = (bLat - aLat) * Math.PI / 180;
	const dLng = (bLng - aLng) * Math.PI / 180;
	const s = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * Math.PI / 180) * Math.cos(bLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
var STATUS_LABEL = {
	recebido: "Recebido",
	preparacao: "Em preparação",
	pronto: "Pronto",
	entrega: "Saiu para entrega",
	entregue: "Entregue",
	cancelado: "Cancelado"
};
var STATUS_FLOW = [
	"recebido",
	"preparacao",
	"pronto",
	"entrega",
	"entregue"
];
var CHANNEL_LABEL = {
	app: "App",
	whatsapp: "WhatsApp",
	instagram: "Instagram",
	telefone: "Telefone",
	balcao: "Balcão"
};
var PAYMENT_LABEL = {
	dinheiro: "Dinheiro na entrega",
	tpa: "TPA / cartão na entrega",
	multicaixa: "Multicaixa Express",
	transferencia: "Transferência bancária"
};
function waLink(phone, text) {
	return `https://wa.me/${normPhone(phone).replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
function errText(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string") return error;
	return "Não foi possível concluir. Tenta outra vez.";
}
function beep() {
	const Ctx = window.AudioContext || window.webkitAudioContext;
	if (!Ctx) return;
	const ctx = new Ctx();
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "sine";
	osc.frequency.value = 880;
	gain.gain.value = .04;
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start();
	osc.frequency.setValueAtTime(660, ctx.currentTime + .12);
	osc.stop(ctx.currentTime + .28);
	window.setTimeout(() => void ctx.close(), 500);
}
//#endregion
export { beep as a, elapsed as c, kz as d, meters as f, waLink as g, urgency as h, STATUS_LABEL as i, errText as l, shopStatus as m, PAYMENT_LABEL as n, diaChave as o, normPhone as p, STATUS_FLOW as r, diaCurto as s, CHANNEL_LABEL as t, hora as u };
