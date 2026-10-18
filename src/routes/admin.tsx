import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Shell } from "@/components/pezzo/shell";
import {
  adjustStock,
  askGrok,
  decideSuggestion,
  getAdminSettings,
  getAudit,
  getCustomers,
  getDashboard,
  getFichas,
  getOrders,
  getPunches,
  getStock,
  getSuggestions,
  saveCoupon,
  saveCustomer,
  saveIngredientCost,
  saveProduct,
  saveRecipe,
  saveSettings,
} from "@/lib/pezzo/fns";
import { CHANNEL_LABEL, diaCurto, errText, hora, kz, PAYMENT_LABEL, STATUS_LABEL, waLink } from "@/lib/pezzo/format";
import { useSession } from "@/lib/pezzo/session";
import { cn } from "@/lib/utils";

const TABS = [
  ["hoje", "Hoje"],
  ["pedidos", "Pedidos"],
  ["ementa", "Ementa"],
  ["fichas", "Fichas"],
  ["margens", "Margens"],
  ["stock", "Stock"],
  ["ponto", "Ponto"],
  ["clientes", "Clientes"],
  ["ia", "IA"],
  ["loja", "Loja"],
] as const;

type Tab = (typeof TABS)[number][0];

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [tab, setTab] = useState<Tab>("hoje");
  const actor = useSession((s) => s.profile.name);
  return (
    <Shell>
      <p className="text-sm font-semibold text-tomato">Gestão · {actor}</p>
      <h1 className="font-display text-4xl">Pezzo, hoje</h1>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn("min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold", tab === id ? "bg-bordeaux text-on-tomato" : "bg-paper shadow-card")}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tab === "hoje" && <Hoje />}
        {tab === "pedidos" && <Pedidos />}
        {tab === "ementa" && <Ementa actor={actor} />}
        {tab === "fichas" && <Fichas actor={actor} />}
        {tab === "margens" && <Margens actor={actor} />}
        {tab === "stock" && <Stock actor={actor} />}
        {tab === "ponto" && <Ponto />}
        {tab === "clientes" && <Clientes actor={actor} />}
        {tab === "ia" && <Ia actor={actor} />}
        {tab === "loja" && <Loja actor={actor} />}
      </div>
    </Shell>
  );
}

function Hoje() {
  const q = useQuery({ queryKey: ["dash"], queryFn: () => getDashboard() });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const d = q.data;
  if (!d) return <p className="text-muted">A somar o dia…</p>;
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Vendas entregues" value={kz(d.salesKz)} />
        <Stat label="Pedidos de hoje" value={String(d.orders)} />
        <Stat label="Ticket médio" value={kz(d.ticketKz)} />
        <Stat label="Em aberto" value={String(d.open)} />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <section className="rounded-3xl bg-paper p-4 shadow-card">
          <h2 className="font-display text-2xl">Últimos 7 dias</h2>
          <div className="mt-3 h-52">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.byDay}>
                  <XAxis dataKey="day" tick={{ fill: "#8d5b4c", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(v) => kz(Number(v))} />
                  <Bar dataKey="total" fill="#d32f2f" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
        <section className="rounded-3xl bg-paper p-4 shadow-card">
          <h2 className="font-display text-2xl">Por canal</h2>
          <ul className="mt-2 space-y-2">
            {d.byChannel.map((c) => (
              <li key={c.channel} className="flex justify-between text-sm">
                <span>{CHANNEL_LABEL[c.channel as keyof typeof CHANNEL_LABEL] ?? c.channel}</span>
                <span className="tabular-nums">{c.n} · {kz(c.total)}</span>
              </li>
            ))}
            {d.byChannel.length === 0 && <li className="text-sm text-muted">Ainda sem pedidos hoje.</li>}
          </ul>
          <p className="mt-3 text-sm text-muted">
            Preparação média {d.prepAvgMin ?? "—"} min · entrega {d.tripAvgMin ?? "—"} min
          </p>
        </section>
      </div>
      <section className="rounded-3xl bg-paper p-4 shadow-card">
        <h2 className="font-display text-2xl">Mais pedidos (14 dias)</h2>
        <ul className="mt-2 space-y-1">
          {d.top.map((t) => (
            <li key={t.name} className="flex justify-between text-sm">
              <span>{t.name}</span>
              <span className="tabular-nums text-muted">{t.qty} · {kz(t.total)}</span>
            </li>
          ))}
        </ul>
      </section>
      <div className="grid gap-3 lg:grid-cols-2">
        <section className="rounded-3xl bg-paper p-4 shadow-card">
          <h2 className="font-display text-2xl">Quem está na loja</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {d.present.map((p) => (
              <li key={p.name}>{p.name} · {p.role} · desde {hora(p.since)}{p.kind === "pausa" ? " (pausa)" : ""}</li>
            ))}
            {d.present.length === 0 && <li className="text-muted">Ninguém picou o ponto nas últimas horas.</li>}
          </ul>
        </section>
        <section className="rounded-3xl bg-paper p-4 shadow-card">
          <h2 className="font-display text-2xl">Stock no limite</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {d.lowStock.map((i) => (
              <li key={i.name} className="text-tomato">{i.name}: {i.stock} {i.unit} (mín. {i.min})</li>
            ))}
            {d.lowStock.length === 0 && <li className="text-muted">Tudo acima do mínimo.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-paper p-4 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl tabular-nums">{value}</p>
    </div>
  );
}

function Pedidos() {
  const q = useQuery({ queryKey: ["orders"], queryFn: () => getOrders() });
  function csv() {
    const rows = [
      ["codigo", "estado", "canal", "cliente", "total", "hora"],
      ...(q.data ?? []).map((o) => [o.code, o.status, o.channel, o.customerName, String(o.totalKz), o.createdAt]),
    ];
    downloadCsv("pezzo-pedidos.csv", rows);
  }
  return (
    <div>
      <button type="button" onClick={csv} className="min-h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow-card">Exportar Excel (CSV)</button>
      <div className="mt-3 grid gap-2">
        {(q.data ?? []).map((o) => (
          <article key={o.id} className="rounded-2xl bg-paper px-4 py-3 shadow-card">
            <div className="flex justify-between gap-3">
              <p className="font-semibold">{o.code} · {o.customerName}</p>
              <p className="tabular-nums">{kz(o.totalKz)}</p>
            </div>
            <p className="text-sm text-muted">{STATUS_LABEL[o.status]} · {CHANNEL_LABEL[o.channel]} · {PAYMENT_LABEL[o.payment]} · {hora(o.createdAt)}</p>
            <p className="text-sm">{o.itemSummary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Ementa({ actor }: { actor: string }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["fichas"], queryFn: () => getFichas() });
  const [name, setName] = useState("");
  const [price, setPrice] = useState("2500");
  const [categoryId, setCategoryId] = useState(2);
  if (!q.data) return <p className="text-muted">A carregar a ementa…</p>;
  const cats = [...new Map(q.data.products.map((p) => [p.categoryId, p.category])).entries()];
  async function save(id: number, patch: { name: string; description: string; priceKz: number; active: boolean; categoryId: number }) {
    try {
      await saveProduct({ data: { id, actor, ...patch } });
      toast.success("Ementa atualizada");
      void qc.invalidateQueries({ queryKey: ["fichas"] });
      void qc.invalidateQueries({ queryKey: ["menu"] });
    } catch (error) {
      toast.error(errText(error));
    }
  }
  return (
    <div className="grid gap-3">
      <form
        className="grid gap-2 rounded-3xl bg-paper p-4 shadow-card sm:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          void saveProduct({
            data: { id: null, actor, name, description: "", priceKz: Number(price), active: true, categoryId },
          }).then(() => {
            setName("");
            toast.success("Produto criado");
            void qc.invalidateQueries({ queryKey: ["fichas"] });
          }).catch((error) => toast.error(errText(error)));
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Novo produto" className="min-h-12 rounded-2xl bg-cream px-3" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" className="min-h-12 rounded-2xl bg-cream px-3" />
        <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="min-h-12 rounded-2xl bg-cream px-3">
          {cats.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
        <button className="min-h-12 rounded-2xl bg-tomato font-semibold text-on-tomato">Criar</button>
      </form>
      {q.data.products.map((p) => (
        <ProductRow key={p.id} product={p} onSave={save} />
      ))}
    </div>
  );
}

function ProductRow({
  product,
  onSave,
}: {
  product: { id: number; name: string; description: string; priceKz: number; active: boolean; categoryId: number; category: string };
  onSave: (id: number, patch: { name: string; description: string; priceKz: number; active: boolean; categoryId: number }) => Promise<void>;
}) {
  const [price, setPrice] = useState(String(product.priceKz));
  const [active, setActive] = useState(product.active);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-paper p-3 shadow-card">
      <div className="min-w-40 flex-1">
        <p className="font-semibold">{product.name}</p>
        <p className="text-xs text-muted">{product.category}</p>
      </div>
      <input value={price} onChange={(e) => setPrice(e.target.value)} className="h-11 w-28 rounded-xl bg-cream px-2 tabular-nums" />
      <button type="button" onClick={() => setActive(!active)} className={cn("min-h-11 rounded-full px-3 text-sm font-semibold", active ? "bg-amber text-on-amber" : "bg-line")}>
        {active ? "Ativo" : "Oculto"}
      </button>
      <button
        type="button"
        onClick={() => void onSave(product.id, { name: product.name, description: product.description, priceKz: Number(price), active, categoryId: product.categoryId })}
        className="min-h-11 rounded-full bg-bordeaux px-3 text-sm font-semibold text-on-tomato"
      >
        Guardar
      </button>
    </div>
  );
}

function Fichas({ actor }: { actor: string }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["fichas"], queryFn: () => getFichas() });
  const [productId, setProductId] = useState<number | null>(null);
  const data = q.data;
  const id = productId ?? data?.products[0]?.id ?? null;
  const [lines, setLines] = useState<{ ingredientId: number; qty: number }[] | null>(null);
  useEffect(() => setLines(null), [id]);
  if (!data || id == null) return <p className="text-muted">A carregar fichas…</p>;
  const current = lines ?? data.lines.filter((l) => l.productId === id).map((l) => ({ ingredientId: l.ingredientId, qty: l.qty }));
  const product = data.products.find((p) => p.id === id);
  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted">As fichas já vêm preenchidas como rascunho para a cozinha trabalhar. Ajusta as quantidades reais — ou limpa e recomeça.</p>
      <select value={id} onChange={(e) => setProductId(Number(e.target.value))} className="min-h-12 rounded-2xl bg-paper px-3 shadow-card">
        {data.products.map((p) => <option key={p.id} value={p.id}>{p.category} · {p.name}</option>)}
      </select>
      {current.map((line, index) => {
        const ing = data.ingredients.find((i) => i.id === line.ingredientId);
        const lineKz = ing
          ? Math.round((line.qty * ing.costCents) / 100)
          : 0;
        return (
          <div key={`${line.ingredientId}-${index}`} className="flex items-center gap-2 rounded-2xl bg-paper p-3 shadow-card">
            <span className="flex-1">{ing?.name}</span>
            <input
              type="number"
              value={line.qty}
              onChange={(e) => setLines(current.map((l, i) => i === index ? { ...l, qty: Number(e.target.value) } : l))}
              className="h-11 w-24 rounded-xl bg-cream px-2 text-center tabular-nums"
            />
            <span className="w-16 text-sm text-muted">{ing?.unit}</span>
            <span className="w-20 text-right text-sm tabular-nums">{kz(lineKz)}</span>
          </div>
        );
      })}
      {current.length === 0 && <p className="text-sm text-muted">Ficha vazia. Junta ingredientes.</p>}
      <div className="flex flex-wrap gap-2">
        <select
          className="min-h-12 flex-1 rounded-2xl bg-paper px-3 shadow-card"
          defaultValue=""
          onChange={(e) => {
            const ingredientId = Number(e.target.value);
            if (!ingredientId) return;
            setLines([...current, { ingredientId, qty: 1 }]);
            e.currentTarget.value = "";
          }}
        >
          <option value="">Juntar ingrediente…</option>
          {data.ingredients.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <button type="button" onClick={() => setLines([])} className="min-h-12 rounded-2xl bg-paper px-4 font-semibold shadow-card">Limpar</button>
        <button
          type="button"
          onClick={() => {
            void saveRecipe({ data: { productId: id, actor, lines: current } })
              .then(() => {
                toast.success(`Ficha de ${product?.name ?? "produto"} guardada`);
                void qc.invalidateQueries({ queryKey: ["fichas"] });
              })
              .catch((error) => toast.error(errText(error)));
          }}
          className="min-h-12 rounded-2xl bg-tomato px-4 font-semibold text-on-tomato"
        >
          Guardar ficha
        </button>
      </div>
    </div>
  );
}

function Margens({ actor }: { actor: string }) {
  const qc = useQueryClient();
  const stock = useQuery({ queryKey: ["stock"], queryFn: () => getStock() });
  const fichas = useQuery({ queryKey: ["fichas"], queryFn: () => getFichas() });
  const [prices, setPrices] = useState<Record<number, string>>({});
  if (!stock.data || !fichas.data) return <p className="text-muted">A calcular as margens…</p>;
  const rows = [...stock.data.foodCost].sort((a, b) => b.marginKz - a.marginKz);
  const pizzas = rows.filter((r) => r.categorySlug === "pizzas" || r.categorySlug === "pocket");
  const avg = pizzas.length
    ? Math.round((pizzas.reduce((s, r) => s + r.foodCostPct, 0) / pizzas.length) * 10) / 10
    : 0;
  const ranked = rows.filter((r) => r.categorySlug !== "bebidas");
  const best = ranked.reduce<(typeof ranked)[number] | null>(
    (top, r) => (!top || r.marginKz > top.marginKz ? r : top),
    null,
  );
  const priceOf = (id: number, cents: number, unit: string) => {
    if (prices[id] != null) return prices[id];
    const shown = unit === "g" || unit === "ml" ? (cents * 1000) / 100 : cents / 100;
    return String(Math.round(shown));
  };
  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted">
        Preços de Luanda, Outubro 2026. O food cost ideal numa pizzaria fica entre 25% e 35% — até 40% ainda é aceitável com delivery.
      </p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat label="Food cost das pizzas" value={`${avg}%`} />
        <Stat label="Maior margem" value={best ? kz(best.marginKz) : "—"} />
        <Stat label="Produto a empurrar" value={best?.name ?? "—"} />
      </div>
      <div className="overflow-x-auto rounded-3xl bg-paper shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="px-3 py-3 font-medium">Produto</th>
              <th className="px-3 py-3 font-medium">Venda</th>
              <th className="px-3 py-3 font-medium">Custo</th>
              <th className="px-3 py-3 font-medium">Food cost</th>
              <th className="px-3 py-3 font-medium">Margem</th>
              <th className="px-3 py-3 font-medium">Prioridade</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="px-3 py-3">
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-muted">{r.category}</p>
                </td>
                <td className="px-3 py-3 tabular-nums">{kz(r.priceKz)}</td>
                <td className="px-3 py-3 tabular-nums">{kz(r.costKz)}</td>
                <td className="px-3 py-3">
                  <span className={cn(
                    "inline-flex min-h-8 items-center rounded-full px-2 tabular-nums text-xs font-semibold",
                    r.foodCostPct === 0 ? "bg-line" : r.foodCostPct <= 40 ? "bg-amber text-on-amber" : r.foodCostPct <= 50 ? "bg-cream" : "bg-tomato text-on-tomato",
                  )}>
                    {r.costKz ? `${r.foodCostPct}%` : "—"}
                  </span>
                </td>
                <td className="px-3 py-3 tabular-nums font-semibold">{kz(r.marginKz)}</td>
                <td className="px-3 py-3">{r.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="rounded-3xl bg-paper p-4 shadow-card">
        <h2 className="font-display text-2xl">Preços de compra</h2>
        <p className="mt-1 text-sm text-muted">
          Kz por kg (ou por litro, ou por unidade no pão e nas bebidas). Uma compra no separador Stock também actualiza este preço.
        </p>
        <ul className="mt-3 space-y-2">
          {fichas.data.ingredients.map((i) => {
            const unitLabel = i.unit === "g" ? "Kz/kg" : i.unit === "ml" ? "Kz/l" : "Kz/un";
            return (
              <li key={i.id} className="flex flex-wrap items-center gap-2">
                <span className="min-w-40 flex-1">{i.name}</span>
                <input
                  inputMode="numeric"
                  value={priceOf(i.id, i.costCents, i.unit)}
                  onChange={(e) => setPrices((p) => ({ ...p, [i.id]: e.target.value }))}
                  className="h-11 w-28 rounded-xl bg-cream px-2 text-right tabular-nums"
                  aria-label={`Preço de ${i.name}`}
                />
                <span className="w-16 text-xs text-muted">{unitLabel}</span>
                <button
                  type="button"
                  className="min-h-11 rounded-full bg-bordeaux px-3 text-sm font-semibold text-on-tomato"
                  onClick={() => {
                    const pricePerKgKz = Number(priceOf(i.id, i.costCents, i.unit));
                    void saveIngredientCost({ data: { ingredientId: i.id, pricePerKgKz, actor } })
                      .then(() => {
                        toast.success(`${i.name} actualizado`);
                        void qc.invalidateQueries({ queryKey: ["fichas"] });
                        void qc.invalidateQueries({ queryKey: ["stock"] });
                      })
                      .catch((error) => toast.error(errText(error)));
                  }}
                >
                  Guardar
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="rounded-3xl bg-paper p-4 text-sm shadow-card">
        <h2 className="font-display text-2xl">Porções a controlar</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
          <li>Queijo numa pizza de 8 fatias: 180–220 g. Máximo 250 g. Uma barra de 2,5 kg dá 12 a 13 pizzas a 200 g.</li>
          <li>Magoga: 100–150 g de frango (coxa) por sandes. A ficha está em 130 g.</li>
          <li>Pezzo Burger: 80–120 g de peito. A ficha está em 110 g.</li>
          <li>Mozzarella de referência em Luanda: 15.000–20.000 Kz/kg. Peito: 5.000–8.000. Coxa: 2.500–4.000.</li>
        </ul>
      </section>
    </div>
  );
}

function Stock({ actor }: { actor: string }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["stock"], queryFn: () => getStock() });
  const [ingredientId, setIngredientId] = useState(0);
  const [kind, setKind] = useState<"entrada" | "quebra" | "interno" | "contagem">("entrada");
  const [qty, setQty] = useState("1");
  const [reason, setReason] = useState("");
  const [cost, setCost] = useState("0");
  if (!q.data) return <p className="text-muted">A contar o stock…</p>;
  const chosen = ingredientId || q.data.ingredients[0]?.id || 0;
  return (
    <div className="grid gap-3">
      <form
        className="grid gap-2 rounded-3xl bg-paper p-4 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          void adjustStock({ data: { ingredientId: chosen, kind, qty: Number(qty), reason, actor, costKz: Number(cost) } })
            .then(() => {
              toast.success("Stock atualizado");
              setReason("");
              void qc.invalidateQueries({ queryKey: ["stock"] });
              void qc.invalidateQueries({ queryKey: ["dash"] });
            })
            .catch((error) => toast.error(errText(error)));
        }}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <select value={chosen} onChange={(e) => setIngredientId(Number(e.target.value))} className="min-h-12 rounded-2xl bg-cream px-3">
            {q.data.ingredients.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="min-h-12 rounded-2xl bg-cream px-3">
            <option value="entrada">Entrada (compra)</option>
            <option value="quebra">Quebra / desperdício</option>
            <option value="interno">Consumo interno</option>
            <option value="contagem">Contagem física</option>
          </select>
          <input value={qty} onChange={(e) => setQty(e.target.value)} inputMode="numeric" className="min-h-12 rounded-2xl bg-cream px-3" placeholder="Quantidade" />
          <input value={cost} onChange={(e) => setCost(e.target.value)} inputMode="numeric" className="min-h-12 rounded-2xl bg-cream px-3" placeholder="Custo total da compra (Kz) — actualiza o preço" />
        </div>
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo ou fornecedor" className="min-h-12 rounded-2xl bg-cream px-3" />
        <button className="min-h-12 rounded-2xl bg-tomato font-semibold text-on-tomato">Registar movimento</button>
      </form>
      <div className="grid gap-2 sm:grid-cols-2">
        {q.data.ingredients.map((i) => (
          <div key={i.id} className={cn("rounded-2xl bg-paper p-3 shadow-card", i.stock <= i.min && "ring-2 ring-tomato")}>
            <p className="font-semibold">{i.name}</p>
            <p className="tabular-nums">{i.stock} {i.unit} <span className="text-muted">mín. {i.min} · {i.unit === "unidade" ? `${kz(Math.round(i.costCents / 100))}/un` : `${kz(Math.round((i.costCents * 1000) / 100))}/${i.unit === "ml" ? "l" : "kg"}`}</span></p>
          </div>
        ))}
      </div>
      <h2 className="font-display text-2xl">Movimentos</h2>
      <ul className="space-y-1 text-sm">
        {q.data.moves.map((m) => (
          <li key={m.id} className="rounded-xl bg-paper px-3 py-2 shadow-card">
            {diaCurto(m.at)} {hora(m.at)} · {m.name} {m.qty > 0 ? "+" : ""}{m.qty} {m.unit} · {m.kind} · {m.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Ponto() {
  const q = useQuery({ queryKey: ["punches"], queryFn: () => getPunches() });
  if (!q.data) return <p className="text-muted">A ler o ponto…</p>;
  const byStaff = new Map<number, { name: string; ms: number }>();
  const sorted = [...q.data.punches].sort((a, b) => a.at.localeCompare(b.at));
  const open = new Map<number, string>();
  for (const p of sorted) {
    if (p.kind === "entrada" || p.kind === "regresso") open.set(p.staffId, p.at);
    if ((p.kind === "saida" || p.kind === "pausa") && open.has(p.staffId)) {
      const start = open.get(p.staffId)!;
      const ms = new Date(p.at).getTime() - new Date(start).getTime();
      const bag = byStaff.get(p.staffId) ?? { name: p.name, ms: 0 };
      bag.ms += Math.max(0, ms);
      byStaff.set(p.staffId, bag);
      if (p.kind === "saida") open.delete(p.staffId);
    }
  }
  for (const [staffId, start] of open) {
    const person = q.data.staff.find((s) => s.id === staffId);
    const bag = byStaff.get(staffId) ?? { name: person?.name ?? "", ms: 0 };
    bag.ms += Math.max(0, Date.now() - new Date(start).getTime());
    byStaff.set(staffId, bag);
  }
  function csv() {
    downloadCsv("pezzo-ponto.csv", [
      ["nome", "tipo", "hora", "offline"],
      ...q.data!.punches.map((p) => [p.name, p.kind, p.at, p.offline ? "sim" : "nao"]),
    ]);
  }
  return (
    <div>
      <div className="flex gap-2">
        <button type="button" onClick={csv} className="min-h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow-card">Exportar CSV</button>
        <button type="button" onClick={() => window.print()} className="min-h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow-card">Imprimir / PDF</button>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {q.data.staff.map((s) => (
          <div key={s.id} className="rounded-2xl bg-paper p-3 shadow-card">
            <p className="font-semibold">{s.name}</p>
            <p className="text-sm text-muted">{s.role} · {Math.round((byStaff.get(s.id)?.ms ?? 0) / 3600000)} h nos registos recentes</p>
          </div>
        ))}
      </div>
      <ul className="mt-3 space-y-1 text-sm">
        {q.data.punches.map((p) => (
          <li key={p.id} className="flex justify-between rounded-xl bg-paper px-3 py-2 shadow-card">
            <span>{p.name} · {p.kind}{p.offline ? " · offline" : ""}</span>
            <span className="tabular-nums text-muted">{diaCurto(p.at)} {hora(p.at)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Clientes({ actor }: { actor: string }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["customers"], queryFn: () => getCustomers() });
  if (!q.data) return <p className="text-muted">A abrir as fichas…</p>;
  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted">Segmentos: novo, frequente, VIP, em risco (14 dias) e inativo (30). A 10.ª pizza é oferta.</p>
      {q.data.map((c) => (
        <article key={c.id} className="rounded-3xl bg-paper p-4 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl">{c.name}</h2>
              <p className="text-sm text-muted">{c.phone} · {c.channel}</p>
            </div>
            <p className="font-display text-2xl tabular-nums">{kz(c.spent)}</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {c.tags.map((t) => <span key={t} className="rounded-full bg-amber px-2 py-1 text-xs font-semibold text-on-amber">{t}</span>)}
            {c.birthdaySoon && <span className="rounded-full bg-tomato px-2 py-1 text-xs font-semibold text-on-tomato">aniversário</span>}
          </div>
          <p className="mt-2 text-sm">{c.orders} pedidos · ticket {kz(c.ticket)} · {c.pizzas} pizzas · {c.points} pontos</p>
          <p className="text-sm text-muted">{c.address} · {c.landmark}</p>
          {c.allergies && <p className="text-sm font-semibold text-tomato">Alergia: {c.allergies}</p>}
          <form
            className="mt-2 grid gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              void saveCustomer({
                data: {
                  id: c.id,
                  actor,
                  notes: String(fd.get("notes") ?? ""),
                  allergies: String(fd.get("allergies") ?? ""),
                  optIn: fd.get("opt") === "on",
                },
              }).then(() => {
                toast.success("Ficha guardada");
                void qc.invalidateQueries({ queryKey: ["customers"] });
              });
            }}
          >
            <input name="allergies" defaultValue={c.allergies} placeholder="Alergias" className="min-h-11 rounded-xl bg-cream px-3 text-sm" />
            <input name="notes" defaultValue={c.notes} placeholder="Notas" className="min-h-11 rounded-xl bg-cream px-3 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="opt" defaultChecked={c.optIn} className="size-4" />
              Aceita promoções
            </label>
            <button className="min-h-11 rounded-xl bg-bordeaux text-sm font-semibold text-on-tomato">Guardar ficha</button>
          </form>
        </article>
      ))}
    </div>
  );
}

function Ia({ actor }: { actor: string }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["ideas"], queryFn: () => getSuggestions() });
  const [busy, setBusy] = useState(false);
  if (!q.data) return <p className="text-muted">A ler sugestões…</p>;
  const phone = "+244924499486";
  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted">Nada sai sozinho. O Grok propõe, tu aprovas, e só depois abres o WhatsApp.</p>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          void askGrok({ data: { actor } })
            .then((res) => {
              toast.success(res.title);
              void qc.invalidateQueries({ queryKey: ["ideas"] });
            })
            .catch((error) => toast.error(errText(error)))
            .finally(() => setBusy(false));
        }}
        className="min-h-12 rounded-2xl bg-tomato font-semibold text-on-tomato"
      >
        {busy ? "O Grok está a pensar…" : "Pedir uma sugestão ao Grok"}
      </button>
      {q.data.suggestions.map((s) => (
        <article key={s.id} className="rounded-3xl bg-paper p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{s.source === "grok" ? "Grok" : "Equipa"} · {s.status}</p>
          <h2 className="font-display text-2xl">{s.title}</h2>
          <p className="mt-1 text-sm">{s.body}</p>
          <p className="mt-1 text-sm text-muted">Para: {s.audience}</p>
          {s.message && <p className="mt-2 rounded-2xl bg-cream p-3 text-sm">{s.message}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {s.status === "pendente" && (
              <button type="button" onClick={() => void decideSuggestion({ data: { id: s.id, status: "aprovada", actor } }).then(() => qc.invalidateQueries({ queryKey: ["ideas"] }))} className="min-h-11 rounded-full bg-amber px-3 text-sm font-semibold text-on-amber">Aprovar</button>
            )}
            {s.status !== "dispensada" && s.status !== "enviada" && (
              <button type="button" onClick={() => void decideSuggestion({ data: { id: s.id, status: "dispensada", actor } }).then(() => qc.invalidateQueries({ queryKey: ["ideas"] }))} className="min-h-11 rounded-full bg-paper px-3 text-sm font-semibold shadow-card">Dispensar</button>
            )}
            {s.message && s.status === "aprovada" && (
              <a href={waLink(phone, s.message)} className="inline-flex min-h-11 items-center rounded-full bg-tomato px-3 text-sm font-semibold text-on-tomato">Abrir WhatsApp</a>
            )}
            {s.status === "aprovada" && (
              <button type="button" onClick={() => void decideSuggestion({ data: { id: s.id, status: "enviada", actor } }).then(() => qc.invalidateQueries({ queryKey: ["ideas"] }))} className="min-h-11 rounded-full bg-bordeaux px-3 text-sm font-semibold text-on-tomato">Marcar como enviada</button>
            )}
          </div>
        </article>
      ))}
      <h2 className="font-display text-2xl">Cupões</h2>
      <ul className="space-y-1 text-sm">
        {q.data.coupons.map((c) => (
          <li key={c.id} className="rounded-xl bg-paper px-3 py-2 shadow-card">{c.code} · {c.label} · {c.used}/{c.maxUses}</li>
        ))}
      </ul>
      <form
        className="grid gap-2 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          void saveCoupon({
            data: {
              actor,
              code: String(fd.get("code") ?? ""),
              label: String(fd.get("label") ?? ""),
              kind: String(fd.get("kind") ?? "percent"),
              value: Number(fd.get("value") ?? 0),
              maxUses: Number(fd.get("max") ?? 20),
            },
          }).then(() => {
            toast.success("Cupão guardado");
            void qc.invalidateQueries({ queryKey: ["ideas"] });
          }).catch((error) => toast.error(errText(error)));
        }}
      >
        <input name="code" placeholder="CÓDIGO" className="min-h-12 rounded-2xl bg-paper px-3 shadow-card" />
        <input name="label" placeholder="Nome da campanha" className="min-h-12 rounded-2xl bg-paper px-3 shadow-card" />
        <select name="kind" className="min-h-12 rounded-2xl bg-paper px-3 shadow-card">
          <option value="percent">Percentagem</option>
          <option value="fixo">Valor fixo (Kz)</option>
          <option value="entrega">Entrega grátis</option>
        </select>
        <input name="value" defaultValue="10" className="min-h-12 rounded-2xl bg-paper px-3 shadow-card" />
        <button className="min-h-12 rounded-2xl bg-tomato font-semibold text-on-tomato sm:col-span-2">Criar cupão</button>
      </form>
    </div>
  );
}

function Loja({ actor }: { actor: string }) {
  const q = useQuery({ queryKey: ["settings"], queryFn: () => getAdminSettings() });
  const audit = useQuery({ queryKey: ["audit"], queryFn: () => getAudit() });
  const qc = useQueryClient();
  const [phones, setPhones] = useState("");
  const [fence, setFence] = useState("100");
  const [apiKey, setApiKey] = useState("");
  const [zones, setZones] = useState<{ id: number; name: string; feeKz: number; etaMin: number }[]>([]);
  useEffect(() => {
    if (!q.data) return;
    setPhones(q.data.settings.phones.join(" | "));
    setFence(String(q.data.settings.geofenceM));
    setApiKey(q.data.settings.apiKey);
    setZones(q.data.zones);
  }, [q.data]);
  if (!q.data) return <p className="text-muted">A abrir a loja…</p>;
  return (
    <div className="grid gap-4">
      <form
        className="grid gap-2 rounded-3xl bg-paper p-4 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          void saveSettings({
            data: { actor, phones, geofenceM: Number(fence), apiKey, zones: zones.map((z) => ({ id: z.id, feeKz: z.feeKz, etaMin: z.etaMin })) },
          }).then(() => {
            toast.success("Definições guardadas");
            void qc.invalidateQueries({ queryKey: ["settings"] });
            void qc.invalidateQueries({ queryKey: ["menu"] });
          }).catch((error) => toast.error(errText(error)));
        }}
      >
        <label className="text-sm font-semibold">Telefones (separa com |)</label>
        <input value={phones} onChange={(e) => setPhones(e.target.value)} className="min-h-12 rounded-2xl bg-cream px-3" />
        <label className="text-sm font-semibold">Geofence do ponto (metros)</label>
        <input value={fence} onChange={(e) => setFence(e.target.value)} className="min-h-12 rounded-2xl bg-cream px-3" />
        <label className="text-sm font-semibold">Chave da API dos agentes</label>
        <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="min-h-12 rounded-2xl bg-cream px-3" />
        <h2 className="font-display text-2xl">Zonas de entrega</h2>
        {zones.map((z, i) => (
          <div key={z.id} className="grid grid-cols-3 gap-2">
            <span className="col-span-3 text-sm font-semibold sm:col-span-1 sm:self-center">{z.name}</span>
            <input value={z.feeKz} onChange={(e) => setZones(zones.map((x, idx) => idx === i ? { ...x, feeKz: Number(e.target.value) } : x))} className="min-h-11 rounded-xl bg-cream px-2" />
            <input value={z.etaMin} onChange={(e) => setZones(zones.map((x, idx) => idx === i ? { ...x, etaMin: Number(e.target.value) } : x))} className="min-h-11 rounded-xl bg-cream px-2" />
          </div>
        ))}
        <button className="min-h-12 rounded-2xl bg-tomato font-semibold text-on-tomato">Guardar loja</button>
      </form>
      <section className="rounded-3xl bg-paper p-4 text-sm shadow-card">
        <h2 className="font-display text-2xl">API para agentes</h2>
        <p className="mt-2">Cabeçalho <span className="font-semibold">x-pezzo-key</span>. Rotas: <span className="font-semibold">/api/v1/resumo</span>, pedidos, stock, clientes, eventos. Criar encomenda: POST <span className="font-semibold">/api/v1/encomendas</span> com cliente, zonaId, morada, referencia, itens.</p>
        <p className="mt-2">O WhatsApp Business Cloud API e o Instagram Messaging pedem credenciais da Meta — os pedidos desses canais já entram na mesma fila (balcão, telefone ou agente). O mapa usa OpenStreetMap, sem chave. O ponto recusa picagens fora do raio.</p>
        <p className="mt-2">Offline: cozinha, estafeta e pedido guardam a fila neste telemóvel e sincronizam quando a rede volta. No stock, os movimentos somam — não se pisa o saldo.</p>
      </section>
      <section>
        <h2 className="font-display text-2xl">Auditoria</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {(audit.data ?? []).map((a, i) => (
            <li key={`${a.at}-${i}`} className="rounded-xl bg-paper px-3 py-2 shadow-card">
              {hora(a.at)} · {a.actor} · {a.action} · {a.detail}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function downloadCsv(name: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((c) => `"${c.replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
