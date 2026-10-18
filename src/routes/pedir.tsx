import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Shell, useOnline } from "@/components/pezzo/shell";
import { FoodPhoto } from "@/components/pezzo/food-photo";
import { getMenu, placeOrder, quoteOrder } from "@/lib/pezzo/fns";
import { CHANNEL_LABEL, errText, kz, shopStatus } from "@/lib/pezzo/format";
import { useSession } from "@/lib/pezzo/session";
import type { Channel, OrderInput, Payment, Product, Quote, Topping } from "@/lib/pezzo/types";
import { cn } from "@/lib/utils";

const channels = ["app", "whatsapp", "instagram", "telefone", "balcao"] as const;

export const Route = createFileRoute("/pedir")({
  validateSearch: (search: Record<string, unknown>): { canal: Channel } => {
    const value = String(search.canal ?? "app");
    return { canal: (channels as readonly string[]).includes(value) ? (value as Channel) : "app" };
  },
  component: PedirPage,
});

type Line = {
  key: string;
  product: Product;
  qty: number;
  extras: Topping[];
  notes: string;
};

function PedirPage() {
  const { canal } = Route.useSearch();
  const navigate = useNavigate();
  const online = useOnline();
  const menu = useQuery({ queryKey: ["menu"], queryFn: () => getMenu() });
  const favorites = useSession((s) => s.favorites);
  const toggleFavorite = useSession((s) => s.toggleFavorite);
  const savedName = useSession((s) => s.customerName);
  const savedPhone = useSession((s) => s.phone);
  const setCustomer = useSession((s) => s.setCustomer);
  const enqueue = useSession((s) => s.enqueue);
  const profile = useSession((s) => s.profile);
  const [cat, setCat] = useState<number | "all">("all");
  const [cart, setCart] = useState<Line[]>([]);
  const [custom, setCustom] = useState<Product | null>(null);
  const [picked, setPicked] = useState<number[]>([]);
  const [payOpen, setPayOpen] = useState(false);
  const [name, setName] = useState(savedName);
  const [phone, setPhone] = useState(savedPhone);
  const [zoneId, setZoneId] = useState(2);
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [payment, setPayment] = useState<Payment>("dinheiro");
  const [proof, setProof] = useState("");
  const [notes, setNotes] = useState("");
  const [coupon, setCoupon] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [busy, setBusy] = useState(false);
  const status = shopStatus();

  const products = menu.data?.products.filter((p) => p.active && (cat === "all" || p.categoryId === cat)) ?? [];

  function add(product: Product, extras: Topping[] = [], lineNotes = "") {
    setCart((prev) => {
      const key = `${product.id}:${extras.map((e) => e.id).join("-")}:${lineNotes}`;
      const found = prev.find((l) => l.key === key);
      if (found) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { key, product, qty: 1, extras, notes: lineNotes }];
    });
    setCustom(null);
    setPicked([]);
    toast.success(`${product.name} no carrinho`);
  }

  const count = cart.reduce((s, l) => s + l.qty, 0);
  const rough = cart.reduce((s, l) => s + (l.product.priceKz + l.extras.reduce((e, x) => e + x.extraKz, 0)) * l.qty, 0);

  const payload = useMemo<OrderInput | null>(() => {
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
        extras: l.extras.map((e) => e.id),
      })),
    };
  }, [menu.data, cart, name, phone, canal, zoneId, address, landmark, payment, proof, notes, coupon, profile]);

  async function preview() {
    if (!payload) return;
    try {
      setQuote(await quoteOrder({ data: { ...payload, clientRef: "quote" } }));
    } catch (error) {
      setQuote(null);
      toast.error(errText(error));
    }
  }

  async function submit() {
    if (!payload) return;
    const body = { ...payload, clientRef: crypto.randomUUID() };
    setCustomer(name, phone);
    if (!online) {
      enqueue({ id: body.clientRef, type: "order", body, at: new Date().toISOString() });
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
      await navigate({ to: "/acompanhar/$token", params: { token: res.token } });
    } catch (error) {
      toast.error(errText(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-tomato">{CHANNEL_LABEL[canal]}</p>
          <h1 className="font-display text-4xl">A ementa</h1>
        </div>
        <p className={cn("rounded-full px-3 py-1 text-sm font-semibold", status.open ? "bg-amber text-on-amber" : "bg-bordeaux text-on-tomato")}>
          {status.label}
        </p>
      </div>
      {!status.open && (
        <p className="mt-3 rounded-2xl bg-paper p-3 text-sm shadow-card">
          A cozinha abre terça a domingo, das 10h às 20h. Podes deixar o pedido na mesma — a equipa vê-o assim que entrar.
        </p>
      )}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <Chip on={cat === "all"} onClick={() => setCat("all")}>Tudo</Chip>
        {menu.data?.categories.map((c) => (
          <Chip key={c.id} on={cat === c.id} onClick={() => setCat(c.id)}>
            {c.name}
          </Chip>
        ))}
      </div>

      {menu.isLoading && <p className="mt-6 text-muted">A abrir o forno…</p>}
      {menu.isError && <p className="mt-6 text-tomato">Não consegui carregar a ementa.</p>}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {products.map((p) => (
          <article key={p.id} className="overflow-hidden rounded-3xl bg-paper shadow-card">
            <div className="relative h-40">
              <FoodPhoto src={p.photo} name={p.name} className="h-40" />
              <button
                type="button"
                aria-label={favorites.includes(p.id) ? "Tirar dos favoritos" : "Favorito"}
                onClick={() => toggleFavorite(p.id)}
                className="absolute right-2 top-2 grid size-11 place-items-center rounded-full bg-paper text-tomato"
              >
                <Star className={cn("size-5", favorites.includes(p.id) && "fill-amber")} />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl leading-none">{p.name}</h2>
                  <p className="mt-1 text-sm text-muted">{p.description}</p>
                </div>
                <p className="shrink-0 font-display text-xl tabular-nums">{kz(p.priceKz)}</p>
              </div>
              <button
                type="button"
                onClick={() => (p.custom ? setCustom(p) : add(p))}
                className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-tomato font-semibold text-on-tomato"
              >
                <Plus className="size-4" />
                {p.custom ? "Criar" : "Adicionar"}
              </button>
            </div>
          </article>
        ))}
      </div>

      {custom && menu.data && (
        <div className="fixed inset-0 z-40 grid items-end bg-bordeaux/40 p-3 sm:items-center sm:justify-center">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream p-4 shadow-lift">
            <h2 className="font-display text-3xl">Cria a tua pizza</h2>
            <p className="text-sm text-muted">Base {kz(custom.priceKz)}. Cada extra tem o seu preço.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {menu.data.toppings.map((t) => {
                const on = picked.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPicked((ids) => (on ? ids.filter((id) => id !== t.id) : [...ids, t.id]))}
                    className={cn(
                      "min-h-12 rounded-2xl px-3 text-left text-sm shadow-card",
                      on ? "bg-amber text-on-amber" : "bg-paper",
                    )}
                  >
                    <span className="font-semibold">{t.name}</span>
                    <span className="block text-xs">+ {kz(t.extraKz)}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 font-display text-2xl tabular-nums">
              {kz(custom.priceKz + menu.data.toppings.filter((t) => picked.includes(t.id)).reduce((s, t) => s + t.extraKz, 0))}
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setCustom(null)} className="min-h-12 flex-1 rounded-2xl bg-paper font-semibold shadow-card">
                Fechar
              </button>
              <button
                type="button"
                onClick={() => add(custom, menu.data!.toppings.filter((t) => picked.includes(t.id)))}
                className="min-h-12 flex-1 rounded-2xl bg-tomato font-semibold text-on-tomato"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-16 z-20 mx-auto max-w-6xl px-4">
          <button
            type="button"
            onClick={() => {
              setPayOpen(true);
              void preview();
            }}
            className="flex min-h-14 w-full items-center justify-between rounded-full bg-bordeaux px-5 font-semibold text-on-tomato shadow-lift"
          >
            <span>{count} {count === 1 ? "item" : "itens"}</span>
            <span className="tabular-nums">{kz(rough)} · pedir</span>
          </button>
        </div>
      )}

      {payOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-cream">
          <div className="mx-auto max-w-lg px-4 py-5 pb-28">
            <h2 className="font-display text-4xl">O teu pedido</h2>
            <ul className="mt-3 space-y-2">
              {cart.map((l) => (
                <li key={l.key} className="flex items-center gap-2 rounded-2xl bg-paper p-3 shadow-card">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{l.product.name}</p>
                    {l.extras.length > 0 && <p className="text-xs text-muted">{l.extras.map((e) => e.name).join(", ")}</p>}
                  </div>
                  <button type="button" className="grid size-11 place-items-center rounded-full bg-cream" onClick={() => setCart((c) => c.flatMap((x) => x.key === l.key ? x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : [] : [x]))}>
                    <Minus className="size-4" />
                  </button>
                  <span className="w-6 text-center tabular-nums">{l.qty}</span>
                  <button type="button" className="grid size-11 place-items-center rounded-full bg-cream" onClick={() => setCart((c) => c.map((x) => x.key === l.key ? { ...x, qty: x.qty + 1 } : x))}>
                    <Plus className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 grid gap-3">
              <Field label="Nome" value={name} onChange={setName} />
              <Field label="Telefone" value={phone} onChange={setPhone} placeholder="924 000 000" />
              <label className="grid gap-1 text-sm font-semibold">
                Zona
                <select
                  className="min-h-12 rounded-2xl bg-paper px-3 shadow-card"
                  value={zoneId}
                  onChange={(e) => setZoneId(Number(e.target.value))}
                >
                  {menu.data?.zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} · {z.feeKz ? kz(z.feeKz) : "sem taxa"} · ~{z.etaMin} min
                    </option>
                  ))}
                </select>
              </label>
              <Field label="Morada" value={address} onChange={setAddress} />
              <Field label="Ponto de referência" value={landmark} onChange={setLandmark} placeholder="Próximo à Tudor" />
              <label className="grid gap-1 text-sm font-semibold">
                Pagamento
                <select className="min-h-12 rounded-2xl bg-paper px-3 shadow-card" value={payment} onChange={(e) => setPayment(e.target.value as Payment)}>
                  <option value="dinheiro">Dinheiro na entrega</option>
                  <option value="tpa">TPA / cartão na entrega</option>
                  <option value="multicaixa">Multicaixa Express</option>
                  <option value="transferencia">Transferência bancária</option>
                </select>
              </label>
              {payment === "transferencia" && <Field label="Referência do comprovativo" value={proof} onChange={setProof} />}
              <Field label="Cupão" value={coupon} onChange={(v) => setCoupon(v.toUpperCase())} placeholder="PEZZO10" />
              <Field label="Notas para a cozinha" value={notes} onChange={setNotes} />
            </div>
            {quote && (
              <div className="mt-4 rounded-3xl bg-paper p-4 shadow-card">
                {quote.lines.map((l) => (
                  <p key={l.name} className="flex justify-between text-sm">
                    <span>{l.qty}× {l.name}</span>
                    <span className="tabular-nums">{kz(l.lineKz)}</span>
                  </p>
                ))}
                <p className="mt-2 flex justify-between text-sm text-muted"><span>Entrega</span><span className="tabular-nums">{kz(quote.deliveryKz)}</span></p>
                {quote.discountKz > 0 && <p className="flex justify-between text-sm text-tomato"><span>Desconto {quote.couponLabel}</span><span className="tabular-nums">− {kz(quote.discountKz)}</span></p>}
                <p className="mt-2 flex justify-between font-display text-2xl"><span>Total</span><span className="tabular-nums">{kz(quote.totalKz)}</span></p>
                {quote.loyaltyNote && <p className="mt-1 text-sm text-tomato">{quote.loyaltyNote}</p>}
                <p className="text-sm text-muted">Estimativa ~{quote.etaMin} min depois de sair do forno.</p>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setPayOpen(false)} className="min-h-12 flex-1 rounded-2xl bg-paper font-semibold shadow-card">Voltar</button>
              <button type="button" onClick={() => void preview()} className="min-h-12 flex-1 rounded-2xl bg-amber font-semibold text-on-amber">Atualizar total</button>
            </div>
            <button type="button" disabled={busy} onClick={() => void submit()} className="mt-2 min-h-14 w-full rounded-full bg-tomato font-semibold text-on-tomato disabled:opacity-60">
              {busy ? "A enviar…" : online ? "Confirmar pedido" : "Guardar offline"}
            </button>
            <p className="mt-2 text-center text-xs text-muted">A cada 10 pizzas, uma sai por nossa conta.</p>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Chip({ children, on, onClick }: { children: React.ReactNode; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold", on ? "bg-bordeaux text-on-tomato" : "bg-paper shadow-card")}>
      {children}
    </button>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-12 rounded-2xl bg-paper px-3 font-normal shadow-card"
      />
    </label>
  );
}
