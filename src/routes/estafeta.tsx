import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LiveMap } from "@/components/pezzo/live-map";
import { Shell, useOnline } from "@/components/pezzo/shell";
import { acceptDelivery, confirmDelivery, getCourier, pingCourier } from "@/lib/pezzo/fns";
import { doPunch } from "@/lib/pezzo/fns";
import { errText, hora, kz, meters, STATUS_LABEL } from "@/lib/pezzo/format";
import { useSession } from "@/lib/pezzo/session";
import type { OrderCard } from "@/lib/pezzo/types";

export const Route = createFileRoute("/estafeta")({
  component: EstafetaPage,
});

const SHOP = { lat: -8.8264, lng: 13.2342 };

function EstafetaPage() {
  const qc = useQueryClient();
  const profile = useSession((s) => s.profile);
  const setProfile = useSession((s) => s.setProfile);
  const online = useOnline();
  const enqueue = useSession((s) => s.enqueue);
  const board = useQuery({ queryKey: ["courier"], queryFn: () => getCourier(), refetchInterval: 5000 });
  const staffId = profile.staffId ?? 4;
  const mine = (board.data?.orders ?? []).filter((o) => o.status === "entrega" && o.courierId === staffId);
  const ready = (board.data?.orders ?? []).filter((o) => o.status === "pronto");
  const [active, setActive] = useState<OrderCard | null>(null);
  const [pos, setPos] = useState(SHOP);
  const [code, setCode] = useState("");
  const [paid, setPaid] = useState(true);
  const [busy, setBusy] = useState(false);
  const current = mine[0] ?? active;

  useEffect(() => {
    if (!current || current.status !== "entrega") return;
    const dest = { lat: current.lat, lng: current.lng };
    const timer = window.setInterval(() => {
      setPos((p) => ({
        lat: p.lat + (dest.lat - p.lat) * 0.2,
        lng: p.lng + (dest.lng - p.lng) * 0.2,
      }));
    }, 5000);
    return () => window.clearInterval(timer);
  }, [current]);

  useEffect(() => {
    if (!current || !online) return;
    void pingCourier({
      data: { orderId: current.id, staffId, lat: pos.lat, lng: pos.lng, simulated: true },
    });
  }, [pos, current, staffId, online]);

  async function take(order: OrderCard) {
    setBusy(true);
    try {
      await acceptDelivery({ data: { orderId: order.id, staffId, actor: profile.name } });
      setPos(SHOP);
      setActive({ ...order, status: "entrega", courierId: staffId });
      toast.success("Entrega aceite. O cliente já vê o mapa.");
      void qc.invalidateQueries({ queryKey: ["courier"] });
    } catch (error) {
      toast.error(errText(error));
    } finally {
      setBusy(false);
    }
  }

  async function deliver() {
    if (!current) return;
    const body = { orderId: current.id, code: code.trim(), actor: profile.name, paid, note: "" };
    if (!online) {
      enqueue({ id: crypto.randomUUID(), type: "deliver", body, at: new Date().toISOString() });
      toast("Entrega guardada. Sincroniza quando voltares a ter rede.");
      return;
    }
    setBusy(true);
    try {
      await confirmDelivery({ data: body });
      toast.success("Entrega fechada.");
      setCode("");
      setActive(null);
      void qc.invalidateQueries({ queryKey: ["courier"] });
    } catch (error) {
      toast.error(errText(error));
    } finally {
      setBusy(false);
    }
  }

  async function clock(kind: "entrada" | "saida", lat: number, lng: number) {
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
      at: online ? null : new Date().toISOString(),
      actor: profile.name,
    };
    if (!online) {
      enqueue({ id: crypto.randomUUID(), type: "punch", body, at: new Date().toISOString() });
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

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-tomato">Estafeta</p>
          <h1 className="font-display text-4xl">{profile.staffId === 5 ? "Sílvia" : "João"} na rua</h1>
        </div>
        <button
          type="button"
          onClick={() =>
            setProfile(
              profile.staffId === 5
                ? { role: "estafeta", staffId: 4, name: "João Muongo", title: "Estafeta" }
                : { role: "estafeta", staffId: 5, name: "Sílvia Domingos", title: "Estafeta" },
            )
          }
          className="min-h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow-card"
        >
          Trocar estafeta
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl shadow-card">
        <LiveMap shop={board.data?.shop ?? SHOP} drop={current ? { lat: current.lat, lng: current.lng } : null} courier={current ? pos : null} />
      </div>
      <p className="mt-2 text-xs text-muted">O ponto vermelho és tu. O amarelo é a entrega. Sem GPS no browser, o percurso é simulado até à morada.</p>

      {current && (
        <section className="mt-4 rounded-3xl bg-paper p-4 shadow-card">
          <p className="text-sm text-muted">{current.code} · {STATUS_LABEL[current.status]}</p>
          <h2 className="font-display text-3xl">{current.customerName}</h2>
          <p>{current.address}</p>
          <p className="font-semibold">Referência: {current.landmark}</p>
          <p className="mt-1 text-sm text-muted">{current.itemSummary} · {kz(current.totalKz)} · {current.payment}</p>
          {current.allergy && <p className="mt-2 text-sm font-semibold text-tomato">Alergia: {current.allergy}</p>}
          <label className="mt-3 grid gap-1 text-sm font-semibold">
            Código de 4 dígitos
            <input value={code} inputMode="numeric" maxLength={4} onChange={(e) => setCode(e.target.value)} className="min-h-14 rounded-2xl bg-cream px-3 text-center font-display text-3xl tracking-widest" placeholder="••••" />
          </label>
          <label className="mt-3 flex min-h-12 items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="size-5" />
            Pagamento recebido
          </label>
          <button type="button" disabled={busy} onClick={() => void deliver()} className="mt-3 min-h-14 w-full rounded-2xl bg-tomato font-semibold text-on-tomato">
            Confirmar entrega
          </button>
          <p className="mt-2 text-xs text-muted">A entrega demo da Marta usa o código 4821.</p>
        </section>
      )}

      <h2 className="mt-6 font-display text-2xl">Prontos para sair</h2>
      <div className="mt-2 grid gap-2">
        {ready.map((o) => (
          <article key={o.id} className="rounded-3xl bg-paper p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-2xl">{o.code}</p>
                <p className="text-sm">{o.customerName} · {o.zoneName}</p>
                <p className="text-sm text-muted">{o.landmark} · {hora(o.createdAt)}</p>
              </div>
              <button type="button" disabled={busy} onClick={() => void take(o)} className="min-h-12 rounded-2xl bg-amber px-4 font-semibold text-on-amber">
                Aceitar
              </button>
            </div>
          </article>
        ))}
        {ready.length === 0 && <p className="text-sm text-muted">Nada à espera no balcão.</p>}
      </div>

      <h2 className="mt-6 font-display text-2xl">Ponto</h2>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => void clock("entrada", SHOP.lat, SHOP.lng)} className="min-h-16 rounded-3xl bg-amber font-display text-2xl text-on-amber">
          Entrar
        </button>
        <button type="button" onClick={() => void clock("saida", SHOP.lat, SHOP.lng)} className="min-h-16 rounded-3xl bg-bordeaux font-display text-2xl text-on-tomato">
          Sair
        </button>
        <button type="button" onClick={() => void clock("entrada", -8.9, 13.3)} className="col-span-2 min-h-12 rounded-2xl bg-paper text-sm font-semibold shadow-card">
          Testar fora da loja (deve falhar)
        </button>
      </div>
    </Shell>
  );
}
