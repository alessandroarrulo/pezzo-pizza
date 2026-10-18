import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shell } from "@/components/pezzo/shell";
import { cancelOrder, finishPrep, getKitchen, getOrder, startPrep } from "@/lib/pezzo/fns";
import { beep, CHANNEL_LABEL, elapsed, errText, hora, kz, STATUS_LABEL, urgency } from "@/lib/pezzo/format";
import { useSession } from "@/lib/pezzo/session";
import type { CheckLine, OrderCard } from "@/lib/pezzo/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cozinha")({
  component: CozinhaPage,
});

function CozinhaPage() {
  const qc = useQueryClient();
  const profile = useSession((s) => s.profile);
  const sound = useSession((s) => s.sound);
  const setSound = useSession((s) => s.setSound);
  const dark = useSession((s) => s.kdsDark);
  const setDark = useSession((s) => s.setKdsDark);
  const board = useQuery({ queryKey: ["kitchen"], queryFn: () => getKitchen(), refetchInterval: 4000 });
  const [openId, setOpenId] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [, setSeen] = useState<number[]>([]);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const fresh = (board.data?.orders ?? []).filter((o) => o.status === "recebido").map((o) => o.id);
    setSeen((prev) => {
      if (prev.length && fresh.some((id) => !prev.includes(id)) && sound) beep();
      if (prev.length === fresh.length && prev.every((id, i) => id === fresh[i])) return prev;
      return fresh;
    });
  }, [board.data, sound]);

  const cols: { key: OrderCard["status"]; title: string }[] = [
    { key: "recebido", title: "Recebido" },
    { key: "preparacao", title: "Em preparação" },
    { key: "pronto", title: "Pronto" },
  ];

  return (
    <Shell kds>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-amber-deep">Cozinha · {profile.name}</p>
          <h1 className="font-display text-4xl">Fila de pedidos</h1>
          <p className="text-sm text-muted">{board.data?.cleanWeek ?? 0} preparos certos esta semana</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setSound(!sound)} className="min-h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow-card">
            Som {sound ? "ligado" : "desligado"}
          </button>
          <button type="button" onClick={() => setDark(!dark)} className="min-h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow-card">
            {dark ? "Modo claro" : "Modo escuro"}
          </button>
          <Link to="/pedir" search={{ canal: "telefone" }} className="inline-flex min-h-11 items-center rounded-full bg-tomato px-4 text-sm font-semibold text-on-tomato">
            Novo pedido
          </Link>
        </div>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {cols.map((col) => (
          <section key={col.key}>
            <h2 className="font-display text-2xl">{col.title}</h2>
            <div className="mt-2 grid gap-2">
              {(board.data?.orders ?? []).filter((o) => o.status === col.key).map((o) => (
                <button key={o.id} type="button" onClick={() => setOpenId(o.id)} className="rounded-3xl bg-paper p-4 text-left shadow-card">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl">{o.code}</span>
                    <span className={cn("font-semibold tabular-nums", urgency(o.createdAt, now) === "late" ? "text-tomato" : urgency(o.createdAt, now) === "warn" ? "text-amber-deep" : "text-muted")}>
                      {elapsed(o.createdAt, now)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{o.itemSummary}</p>
                  <p className="mt-1 text-xs text-muted">{CHANNEL_LABEL[o.channel]} · {o.customerName} · {hora(o.createdAt)}</p>
                  {o.allergy && <p className="mt-2 rounded-xl bg-tomato px-2 py-1 text-sm font-semibold text-on-tomato">Alergia: {o.allergy}</p>}
                </button>
              ))}
              {(board.data?.orders ?? []).every((o) => o.status !== col.key) && (
                <p className="rounded-2xl border border-dashed border-line p-4 text-sm text-muted">Vazio</p>
              )}
            </div>
          </section>
        ))}
      </div>
      {openId != null && (
        <Ticket
          id={openId}
          actor={profile.name}
          onClose={() => {
            setOpenId(null);
            void qc.invalidateQueries({ queryKey: ["kitchen"] });
          }}
        />
      )}
    </Shell>
  );
}

function Ticket({ id, actor, onClose }: { id: number; actor: string; onClose: () => void }) {
  const detail = useQuery({ queryKey: ["order", id], queryFn: () => getOrder({ data: { id } }) });
  const [lines, setLines] = useState<CheckLine[] | null>(null);
  const [busy, setBusy] = useState(false);
  const order = detail.data?.order;
  const checks = lines ?? detail.data?.checks ?? [];

  async function run(task: () => Promise<unknown>, ok: string) {
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

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-cream p-3">
      <div className="mx-auto max-w-lg pb-24">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-4xl">{order?.code ?? "Pedido"}</h2>
          <button type="button" onClick={onClose} className="min-h-11 rounded-full bg-paper px-4 font-semibold shadow-card">Fechar</button>
        </div>
        {order && (
          <p className="mt-1 text-sm text-muted">
            {STATUS_LABEL[order.status]} · {order.customerName} · {kz(order.totalKz)}
          </p>
        )}
        {order?.notes && <p className="mt-2 rounded-2xl bg-amber px-3 py-2 text-sm text-on-amber">Nota: {order.notes}</p>}
        {order?.allergy && <p className="mt-2 rounded-2xl bg-tomato px-3 py-2 text-sm font-semibold text-on-tomato">Alergia: {order.allergy}</p>}
        <h3 className="mt-4 font-display text-2xl">Ficha técnica</h3>
        {checks.length === 0 && <p className="mt-2 text-sm text-muted">Ficha por preencher. Dá para marcar pronto, mas o stock não é abatido.</p>}
        <div className="mt-2 grid gap-2">
          {checks.map((c) => (
            <div key={c.id} className="rounded-2xl bg-paper p-3 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted">{c.itemName} · ficha {c.expectedQty} {c.unit}</p>
                </div>
                <input
                  type="number"
                  inputMode="numeric"
                  value={c.actualQty}
                  onChange={(e) => {
                    const actualQty = Number(e.target.value);
                    setLines(checks.map((line) => (line.id === c.id ? { ...line, actualQty } : line)));
                  }}
                  className="h-12 w-24 rounded-xl bg-cream px-2 text-center text-lg tabular-nums"
                />
              </div>
              {c.actualQty !== c.expectedQty && (
                <input
                  value={c.reason}
                  placeholder="Motivo (ex.: pedido sem cebola)"
                  onChange={(e) => setLines(checks.map((line) => (line.id === c.id ? { ...line, reason: e.target.value } : line)))}
                  className="mt-2 min-h-11 w-full rounded-xl bg-cream px-3 text-sm"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-2">
          {order?.status === "recebido" && (
            <button type="button" disabled={busy} onClick={() => void run(() => startPrep({ data: { id, actor } }), "A preparar")} className="min-h-14 rounded-2xl bg-amber font-semibold text-on-amber">
              Começar preparação
            </button>
          )}
          {order && order.status !== "pronto" && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void run(
                  () => finishPrep({ data: { orderId: id, actor, lines: checks.map((c) => ({ id: c.id, actualQty: c.actualQty, reason: c.reason })) } }),
                  "Pronto. Stock abatido.",
                )
              }
              className="min-h-14 rounded-2xl bg-tomato font-semibold text-on-tomato"
            >
              Confirmar ficha e marcar pronto
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              const reason = window.prompt("Motivo do cancelamento?") ?? "";
              if (reason.trim().length < 3) return;
              void run(() => cancelOrder({ data: { id, actor, reason } }), "Pedido cancelado");
            }}
            className="min-h-12 rounded-2xl bg-paper font-semibold shadow-card"
          >
            Cancelar pedido
          </button>
        </div>
      </div>
    </div>
  );
}
