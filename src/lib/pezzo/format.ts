import type { Channel, Payment, Status } from "./types";

export function kz(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const body = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}${body} Kz`;
}

export function normPhone(raw: string): string {
  const d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  if (d.startsWith("00244")) return `+${d.slice(2)}`;
  if (d.startsWith("244")) return `+${d}`;
  if (d.length >= 9 && d.startsWith("9")) return `+244${d}`;
  return d;
}

export function luandaParts(date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Luanda",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  return Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
}

export function shopStatus(date = new Date()) {
  const p = luandaParts(date);
  const hour = Number(p.hour);
  const monday = p.weekday === "Mon";
  const open = !monday && hour >= 10 && hour < 20;
  const label = open ? "Aberto agora" : monday ? "Fechado à segunda" : "Fechado";
  return { open, monday, label, clock: `${p.hour}:${p.minute}` };
}

export function hora(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Africa/Luanda",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function diaCurto(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Africa/Luanda",
    day: "2-digit",
    month: "short",
  }).format(d);
}

export function diaChave(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Luanda",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function elapsed(iso: string, now: number): string {
  const s = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000));
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${String(m % 60).padStart(2, "0")}m`;
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export function urgency(iso: string, now: number): "ok" | "warn" | "late" {
  const m = (now - new Date(iso).getTime()) / 60000;
  if (m >= 25) return "late";
  if (m >= 15) return "warn";
  return "ok";
}

export function daysSince(iso: string | null): number {
  if (!iso) return 999;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 999;
  return Math.floor((Date.now() - t) / 86400000);
}

export function meters(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export const STATUS_LABEL: Record<Status, string> = {
  recebido: "Recebido",
  preparacao: "Em preparação",
  pronto: "Pronto",
  entrega: "Saiu para entrega",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export const STATUS_FLOW: Status[] = ["recebido", "preparacao", "pronto", "entrega", "entregue"];

export const CHANNEL_LABEL: Record<Channel, string> = {
  app: "App",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  telefone: "Telefone",
  balcao: "Balcão",
};

export const PAYMENT_LABEL: Record<Payment, string> = {
  dinheiro: "Dinheiro na entrega",
  tpa: "TPA / cartão na entrega",
  multicaixa: "Multicaixa Express",
  transferencia: "Transferência bancária",
};

export function waLink(phone: string, text: string): string {
  const digits = normPhone(phone).replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function errText(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;
  return "Não foi possível concluir. Tenta outra vez.";
}

export function beep() {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 880;
  gain.gain.value = 0.04;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.frequency.setValueAtTime(660, ctx.currentTime + 0.12);
  osc.stop(ctx.currentTime + 0.28);
  window.setTimeout(() => void ctx.close(), 500);
}
