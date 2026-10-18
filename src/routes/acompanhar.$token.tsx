import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LiveMap } from "@/components/pezzo/live-map";
import { Shell } from "@/components/pezzo/shell";
import { getTracking } from "@/lib/pezzo/fns";
import { CHANNEL_LABEL, hora, kz, PAYMENT_LABEL, STATUS_FLOW, STATUS_LABEL } from "@/lib/pezzo/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/acompanhar/$token")({
  loader: ({ params }) => getTracking({ data: { token: params.token } }),
  component: TrackPage,
});

function TrackPage() {
  const initial = Route.useLoaderData();
  const { token } = Route.useParams();
  const live = useQuery({
    queryKey: ["track", token],
    queryFn: () => getTracking({ data: { token } }),
    initialData: initial,
    refetchInterval: 4000,
  });
  const data = live.data ?? initial;
  const order = data.order;
  const step = STATUS_FLOW.indexOf(order.status === "cancelado" ? "recebido" : order.status);

  return (
    <Shell>
      <p className="text-sm font-semibold text-tomato">{order.code} · {CHANNEL_LABEL[order.channel]}</p>
      <h1 className="font-display text-4xl">{STATUS_LABEL[order.status]}</h1>
      <p className="text-muted">{order.itemSummary}</p>

      <ol className="mt-4 grid grid-cols-5 gap-1">
        {STATUS_FLOW.map((status, i) => (
          <li key={status} className={cn("rounded-2xl px-1 py-2 text-center text-[11px] font-semibold leading-tight", i <= step && order.status !== "cancelado" ? "bg-tomato text-on-tomato" : "bg-paper text-muted shadow-card")}>
            {STATUS_LABEL[status]}
          </li>
        ))}
      </ol>

      {order.status === "cancelado" && <p className="mt-3 rounded-2xl bg-paper p-3 text-sm shadow-card">Este pedido foi cancelado.</p>}

      <div className="mt-4 overflow-hidden rounded-3xl shadow-card">
        <LiveMap
          shop={data.shop}
          drop={{ lat: order.lat, lng: order.lng }}
          courier={order.status === "entrega" ? data.courier : null}
        />
      </div>
      <p className="mt-2 text-sm text-muted">
        {order.status === "entrega"
          ? data.courier
            ? `${data.courier.name || "Estafeta"} a caminho${data.courier.simulated ? " (posição estimada)" : ""}. ~${data.etaMin} min.`
            : "O estafeta já saiu. A posição aparece assim que o telemóvel falar."
          : order.status === "entregue"
            ? "Entregue. Bom proveito."
            : "Ainda na Pezzo. O mapa mexe quando sair para entrega."}
      </p>

      {order.status !== "entregue" && order.status !== "cancelado" && (
        <section className="mt-4 rounded-3xl bg-amber p-4 text-on-amber">
          <p className="text-sm font-semibold">Diz este código ao estafeta</p>
          <p className="font-display text-5xl tracking-widest tabular-nums">{order.deliveryCode}</p>
        </section>
      )}

      <section className="mt-4 rounded-3xl bg-paper p-4 shadow-card">
        <p className="font-semibold">{order.customerName}</p>
        <p className="text-sm">{order.address}</p>
        <p className="text-sm text-muted">Referência: {order.landmark || "—"} · {order.zoneName}</p>
        <p className="mt-2 font-display text-2xl tabular-nums">{kz(order.totalKz)}</p>
        <p className="text-sm text-muted">{PAYMENT_LABEL[order.payment]} · {order.paid ? "pago" : "por cobrar"}</p>
      </section>

      <h2 className="mt-5 font-display text-2xl">Histórico</h2>
      <ul className="mt-2 space-y-2">
        {data.events.map((e, i) => (
          <li key={`${e.at}-${i}`} className="flex justify-between gap-3 rounded-2xl bg-paper px-3 py-2 text-sm shadow-card">
            <span>{STATUS_LABEL[e.status as keyof typeof STATUS_LABEL] ?? e.status} · {e.actor}</span>
            <span className="tabular-nums text-muted">{hora(e.at)}</span>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
