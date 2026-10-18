import { getSql, type Sql } from "@/lib/db";
import { diaChave, meters, normPhone } from "./format";
import type {
  Channel,
  CheckSave,
  MenuData,
  OrderCard,
  OrderDetail,
  OrderInput,
  Payment,
  PunchInput,
  Quote,
  SettingsPublic,
  Status,
  TrackData,
} from "./types";

function num(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}
function str(v: unknown): string {
  return v == null ? "" : String(v);
}
function bool(v: unknown): boolean {
  return v === true || v === "t" || v === "true" || v === 1;
}

const CHANNELS: Channel[] = ["app", "whatsapp", "instagram", "telefone", "balcao"];
const PAYMENTS: Payment[] = ["dinheiro", "tpa", "multicaixa", "transferencia"];
const STATUSES: Status[] = ["recebido", "preparacao", "pronto", "entrega", "entregue", "cancelado"];

const TS = `to_char(o.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;

const ORDER_SELECT = `
select
  o.id, o.code, o.token, o.status, o.channel, o.customer_name, o.phone,
  o.total_kz, o.subtotal_kz, o.discount_kz, o.delivery_kz, o.payment, o.paid,
  o.address, o.landmark, o.zone_name, o.allergy, o.notes, o.courier_id,
  coalesce(st.name, '') as courier_name, o.delivery_code,
  ${TS} as created_at,
  o.lat, o.lng, o.stock_applied,
  coalesce((
    select string_agg(oi.qty::text || '× ' || oi.name, ', ' order by oi.id)
    from order_items oi where oi.order_id = o.id
  ), '') as item_summary
from orders o
left join staff st on st.id = o.courier_id
`;

type Ing = {
  id: number;
  name: string;
  unit: string;
  stock: number;
  min: number;
  portion: number;
  extraKz: number;
  costCents: number;
  active: boolean;
};
type Prod = MenuData["products"][number];
type Coupon = {
  id: number;
  code: string;
  label: string;
  kind: string;
  value: number;
  expires: string | null;
  maxUses: number;
  used: number;
  active: boolean;
};

function mapOrder(r: Record<string, unknown>): OrderCard {
  const status = str(r.status) as Status;
  const channel = str(r.channel) as Channel;
  const payment = str(r.payment) as Payment;
  return {
    id: num(r.id),
    code: str(r.code),
    token: str(r.token),
    status: STATUSES.includes(status) ? status : "recebido",
    channel: CHANNELS.includes(channel) ? channel : "app",
    customerName: str(r.customer_name),
    phone: str(r.phone),
    totalKz: num(r.total_kz),
    subtotalKz: num(r.subtotal_kz),
    discountKz: num(r.discount_kz),
    deliveryKz: num(r.delivery_kz),
    payment: PAYMENTS.includes(payment) ? payment : "dinheiro",
    paid: bool(r.paid),
    address: str(r.address),
    landmark: str(r.landmark),
    zoneName: str(r.zone_name),
    allergy: str(r.allergy),
    notes: str(r.notes),
    courierId: r.courier_id == null ? null : num(r.courier_id),
    courierName: str(r.courier_name),
    deliveryCode: str(r.delivery_code),
    createdAt: str(r.created_at),
    lat: num(r.lat),
    lng: num(r.lng),
    itemSummary: str(r.item_summary),
    stockApplied: bool(r.stock_applied),
  };
}

async function settingsOf(db: Sql) {
  const rows = await db<Record<string, unknown>>`select * from settings where id = 1`;
  const r = rows[0];
  if (!r) throw new Error("A loja ainda não está configurada.");
  const publicSettings: SettingsPublic = {
    name: str(r.name),
    tagline: str(r.tagline),
    address: str(r.address),
    phones: str(r.phones)
      .split("|")
      .map((p) => p.trim())
      .filter(Boolean),
    instagram: str(r.instagram),
    facebook: str(r.facebook),
    email: str(r.email),
    lat: num(r.lat),
    lng: num(r.lng),
    geofenceM: num(r.geofence_m),
    hoursLabel: str(r.hours_label),
    loyaltyEvery: num(r.loyalty_every) || 10,
  };
  return { ...publicSettings, apiKey: str(r.api_key) };
}

async function loadIngs(db: Sql): Promise<Ing[]> {
  const rows = await db<Record<string, unknown>>`select * from ingredients order by name`;
  return rows.map((r) => ({
    id: num(r.id),
    name: str(r.name),
    unit: str(r.unit),
    stock: num(r.stock_qty),
    min: num(r.min_qty),
    portion: num(r.portion),
    extraKz: num(r.extra_kz),
    costCents: num(r.cost_cents),
    active: bool(r.active),
  }));
}

async function loadProducts(db: Sql): Promise<Prod[]> {
  const rows = await db<Record<string, unknown>>`
    select p.*, c.name as category, c.slug as category_slug
    from products p join categories c on c.id = p.category_id
    order by c.sort, p.sort, p.name
  `;
  return rows.map((r) => ({
    id: num(r.id),
    categoryId: num(r.category_id),
    category: str(r.category),
    categorySlug: str(r.category_slug),
    name: str(r.name),
    slug: str(r.slug),
    description: str(r.description),
    priceKz: num(r.price_kz),
    active: bool(r.active),
    photo: str(r.photo),
    custom: bool(r.custom),
  }));
}

async function loadZones(db: Sql) {
  const rows = await db<Record<string, unknown>>`select * from zones order by sort, id`;
  return rows.map((r) => ({
    id: num(r.id),
    name: str(r.name),
    feeKz: num(r.fee_kz),
    etaMin: num(r.eta_min),
  }));
}

async function loadCoupons(db: Sql): Promise<Coupon[]> {
  const rows = await db<Record<string, unknown>>`
    select id, code, label, kind, value_kz, max_uses, used, active,
      case when expires_at is null then null
        else to_char(expires_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') end as expires
    from coupons order by id
  `;
  return rows.map((r) => ({
    id: num(r.id),
    code: str(r.code),
    label: str(r.label),
    kind: str(r.kind),
    value: num(r.value_kz),
    expires: r.expires == null ? null : str(r.expires),
    maxUses: num(r.max_uses),
    used: num(r.used),
    active: bool(r.active),
  }));
}

async function audit(db: Sql, actor: string, action: string, detail: string) {
  await db`insert into audit (actor, action, detail) values (${actor.slice(0, 80)}, ${action}, ${detail.slice(0, 400)})`;
}

async function logEvent(db: Sql, type: string, payload: unknown) {
  await db`insert into events (type, payload) values (${type}, ${JSON.stringify(payload)})`;
}

function cleanOrder(input: OrderInput, strict: boolean): OrderInput {
  const channel = input.channel;
  const payment = input.payment;
  if (!CHANNELS.includes(channel)) throw new Error("Canal de pedido desconhecido.");
  if (!PAYMENTS.includes(payment)) throw new Error("Forma de pagamento desconhecida.");
  const name = input.customerName.trim();
  const phone = normPhone(input.phone.trim());
  if (name.length < 2) throw new Error("Indica o nome de quem recebe.");
  if (phone.replace(/\D/g, "").length < 9) throw new Error("Indica um telefone válido, com o 9 de Angola.");
  if (!input.items?.length) throw new Error("O pedido está vazio.");
  if (input.items.length > 30) throw new Error("Demasiados itens neste pedido.");
  if (strict && input.zoneId !== 1) {
    if (input.address.trim().length < 4) throw new Error("Indica a morada da entrega.");
    if (input.landmark.trim().length < 3) {
      throw new Error("Em Luanda o ponto de referência ajuda. Ex.: próximo à Tudor.");
    }
  }
  return {
    ...input,
    customerName: name.slice(0, 80),
    phone,
    address: input.address.trim().slice(0, 180),
    landmark: input.landmark.trim().slice(0, 120),
    notes: (input.notes ?? "").trim().slice(0, 280),
    proof: (input.proof ?? "").trim().slice(0, 80),
    coupon: (input.coupon ?? "").trim().toUpperCase().slice(0, 20),
    actor: (input.actor || "Cliente").slice(0, 80),
    clientRef: (input.clientRef || crypto.randomUUID()).slice(0, 64),
    items: input.items.map((item) => ({
      productId: Number(item.productId),
      qty: Number(item.qty),
      notes: (item.notes ?? "").slice(0, 160),
      extras: (item.extras ?? []).map(Number).filter((n) => Number.isFinite(n)),
    })),
  };
}

function priceCart(
  input: OrderInput,
  products: Prod[],
  ings: Ing[],
  zones: Awaited<ReturnType<typeof loadZones>>,
  coupons: Coupon[],
  pizzasCount: number,
): Quote & {
  zoneName: string;
  enriched: {
    product: Prod;
    qty: number;
    unit: number;
    extraNames: string[];
    extraIds: number[];
    notes: string;
  }[];
} {
  const zone = zones.find((z) => z.id === input.zoneId);
  if (!zone) throw new Error("Escolhe a zona de entrega.");
  const enriched = input.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.active) throw new Error("Um produto já não está na ementa.");
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 20) {
      throw new Error("Quantidade inválida.");
    }
    const extraNames: string[] = [];
    const extraIds: number[] = [];
    let extra = 0;
    for (const id of item.extras ?? []) {
      const ing = ings.find((i) => i.id === id && i.extraKz > 0);
      if (!ing) continue;
      extra += ing.extraKz;
      extraNames.push(ing.name);
      extraIds.push(ing.id);
    }
    return {
      product,
      qty: item.qty,
      unit: product.priceKz + extra,
      extraNames,
      extraIds,
      notes: item.notes ?? "",
    };
  });
  const subtotal = enriched.reduce((s, l) => s + l.unit * l.qty, 0);
  const pizzaUnits: number[] = [];
  for (const line of enriched) {
    if (line.product.categorySlug === "pizzas" || line.product.categorySlug === "pocket") {
      for (let i = 0; i < line.qty; i += 1) pizzaUnits.push(line.product.priceKz);
    }
  }
  const freePizzas = Math.floor(((pizzasCount % 10) + pizzaUnits.length) / 10);
  const cheapest = [...pizzaUnits].sort((a, b) => a - b);
  let discount = 0;
  for (let i = 0; i < freePizzas && i < cheapest.length; i += 1) discount += cheapest[i];
  let delivery = zone.feeKz;
  let couponLabel = "";
  if (input.coupon) {
    const coupon = coupons.find((c) => c.code === input.coupon);
    if (!coupon || !coupon.active) throw new Error("Cupão inválido.");
    if (coupon.expires && new Date(coupon.expires).getTime() < Date.now()) {
      throw new Error("Este cupão já expirou.");
    }
    if (coupon.used >= coupon.maxUses) throw new Error("Este cupão já atingiu o limite.");
    if (coupon.kind === "percent") {
      discount += Math.round((subtotal * coupon.value) / 100);
      couponLabel = `${coupon.code} · ${coupon.value}%`;
    } else if (coupon.kind === "fixo") {
      discount += coupon.value;
      couponLabel = `${coupon.code} · ${coupon.label}`;
    } else if (coupon.kind === "entrega") {
      delivery = 0;
      couponLabel = `${coupon.code} · entrega grátis`;
    }
  }
  discount = Math.min(discount, subtotal);
  const total = subtotal - discount + delivery;
  const every = 10;
  const before = pizzasCount % every;
  const loyaltyNote =
    freePizzas > 0
      ? freePizzas === 1
        ? "A 10.ª pizza é por nossa conta."
        : `${freePizzas} pizzas saem por nossa conta (fidelização).`
      : pizzaUnits.length > 0
        ? `Faltam ${every - ((before + pizzaUnits.length) % every) || every} pizzas para a oferta.`
        : "";
  return {
    lines: enriched.map((l) => ({
      name: l.extraNames.length ? `${l.product.name} + ${l.extraNames.join(", ")}` : l.product.name,
      qty: l.qty,
      unitKz: l.unit,
      lineKz: l.unit * l.qty,
    })),
    subtotalKz: subtotal,
    discountKz: discount,
    deliveryKz: delivery,
    totalKz: total,
    freePizzas,
    couponLabel,
    loyaltyNote,
    etaMin: zone.etaMin + 12,
    zoneName: zone.name,
    enriched,
  };
}

async function ensureRealPhotos(db: Sql) {
  await db`update products set photo = '/menu/real/bela.jpg' where slug in ('pocket-bela', 'pizza-bela', 'pizza-sempre') and photo <> '/menu/real/bela.jpg'`;
  await db`update products set photo = '/menu/real/aloha.jpg' where slug in ('pocket-aloha', 'pizza-aloha') and photo <> '/menu/real/aloha.jpg'`;
  await db`update products set photo = '/menu/real/pezzo.jpg' where slug in ('pocket-pezzo', 'pizza-pezzo', 'cria-a-tua') and photo <> '/menu/real/pezzo.jpg'`;
  await db`update products set photo = '/menu/real/frango.jpg' where slug in ('pocket-sweet', 'pizza-amor') and photo <> '/menu/real/frango.jpg'`;
  await db`update products set photo = '/menu/real/estacoes.jpg' where slug = 'pizza-estacoes' and photo <> '/menu/real/estacoes.jpg'`;
  await db`update products set photo = '/menu/real/mar.jpg' where slug = 'pizza-mar' and photo <> '/menu/real/mar.jpg'`;
}

export async function fetchMenu(): Promise<MenuData> {
  const db = await getSql();
  await ensureRealPhotos(db);
  const full = await settingsOf(db);
  const { apiKey: _apiKey, ...settings } = full;
  const categories = (
    await db<Record<string, unknown>>`select * from categories order by sort`
  ).map((r) => ({ id: num(r.id), name: str(r.name), slug: str(r.slug), sort: num(r.sort) }));
  const products = await loadProducts(db);
  const ings = await loadIngs(db);
  const zones = await loadZones(db);
  return {
    settings,
    categories,
    products,
    toppings: ings
      .filter((i) => i.extraKz > 0 && i.active)
      .map((i) => ({ id: i.id, name: i.name, unit: i.unit, portion: i.portion, extraKz: i.extraKz })),
    zones,
  };
}

export async function fetchHome() {
  const menu = await fetchMenu();
  const db = await getSql();
  const open = await db.query<Record<string, unknown>>(
    `${ORDER_SELECT} where o.status in ('recebido','preparacao','pronto','entrega') order by o.id desc limit 12`,
  );
  return {
    ...menu,
    live: open.map(mapOrder).map((o) => ({
      code: o.code,
      status: o.status,
      itemSummary: o.itemSummary,
      channel: o.channel,
    })),
  };
}

async function pizzasOf(db: Sql, phone: string) {
  const rows = await db<Record<string, unknown>>`select pizzas_count from customers where phone = ${phone}`;
  return rows[0] ? num(rows[0].pizzas_count) : 0;
}

export async function quoteOrder(raw: OrderInput): Promise<Quote> {
  const db = await getSql();
  const input = cleanOrder(raw, false);
  const [products, ings, zones, coupons] = await Promise.all([
    loadProducts(db),
    loadIngs(db),
    loadZones(db),
    loadCoupons(db),
  ]);
  const pizzas = await pizzasOf(db, input.phone);
  const priced = priceCart(input, products, ings, zones, coupons, pizzas);
  return {
    lines: priced.lines,
    subtotalKz: priced.subtotalKz,
    discountKz: priced.discountKz,
    deliveryKz: priced.deliveryKz,
    totalKz: priced.totalKz,
    freePizzas: priced.freePizzas,
    couponLabel: priced.couponLabel,
    loyaltyNote: priced.loyaltyNote,
    etaMin: priced.etaMin,
  };
}

export async function createOrder(raw: OrderInput) {
  const db = await getSql();
  const input = cleanOrder(raw, true);
  const existing = await db<Record<string, unknown>>`
    select token, code from orders where client_ref = ${input.clientRef}
  `;
  if (existing[0]) {
    return { token: str(existing[0].token), code: str(existing[0].code), replayed: true };
  }
  const [products, ings, zones, coupons, shop] = await Promise.all([
    loadProducts(db),
    loadIngs(db),
    loadZones(db),
    loadCoupons(db),
    settingsOf(db),
  ]);
  const found = await db<Record<string, unknown>>`select * from customers where phone = ${input.phone}`;
  const pizzas = found[0] ? num(found[0].pizzas_count) : 0;
  const allergy = found[0] ? str(found[0].allergies) : "";
  const priced = priceCart(input, products, ings, zones, coupons, pizzas);
  const zone = zones.find((z) => z.id === input.zoneId)!;
  const lat = zone.feeKz === 0 ? shop.lat : shop.lat + 0.01 + (zone.id - 2) * 0.008;
  const lng = zone.feeKz === 0 ? shop.lng : shop.lng + 0.012 + (zone.id - 2) * 0.005;
  let customerId: number;
  if (found[0]) {
    customerId = num(found[0].id);
    await db`
      update customers
      set name = ${input.customerName}, address = ${input.address}, landmark = ${input.landmark}, channel = ${input.channel}
      where id = ${customerId}
    `;
  } else {
    const ins = await db<{ id: number }>`
      insert into customers (name, phone, channel, address, landmark, opt_in)
      values (${input.customerName}, ${input.phone}, ${input.channel}, ${input.address}, ${input.landmark}, true)
      returning id
    `;
    customerId = num(ins[0].id);
  }
  const code4 = String(1000 + Math.floor(Math.random() * 9000));
  const token = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
  const inserted = await db<{ id: number }>`
    insert into orders (
      code, token, client_ref, customer_id, customer_name, phone, channel, status, payment, paid, proof,
      address, landmark, zone_id, zone_name, lat, lng, delivery_kz, subtotal_kz, discount_kz, total_kz,
      notes, coupon, allergy, delivery_code
    ) values (
      ${"TMP"}, ${token}, ${input.clientRef}, ${customerId}, ${input.customerName}, ${input.phone},
      ${input.channel}, 'recebido', ${input.payment}, ${input.payment === "transferencia" ? false : false},
      ${input.proof}, ${input.address || "Levantamento na loja"}, ${input.landmark || "Balcão"},
      ${zone.id}, ${zone.name}, ${lat}, ${lng}, ${priced.deliveryKz}, ${priced.subtotalKz}, ${priced.discountKz},
      ${priced.totalKz}, ${input.notes}, ${input.coupon}, ${allergy}, ${code4}
    ) returning id
  `;
  const orderId = num(inserted[0].id);
  const code = `PP-${2400 + orderId}`;
  await db`update orders set code = ${code} where id = ${orderId}`;
  const pizzaQty = priced.enriched.reduce((s, l) => {
    return l.product.categorySlug === "pizzas" || l.product.categorySlug === "pocket" ? s + l.qty : s;
  }, 0);
  await db`
    update customers
    set pizzas_count = pizzas_count + ${pizzaQty},
        points = points + ${Math.floor(priced.totalKz / 100)}
    where id = ${customerId}
  `;
  if (input.coupon) {
    await db`update coupons set used = used + 1 where code = ${input.coupon}`;
  }
  for (const line of priced.enriched) {
    const extraText = line.extraNames.join(", ");
    const item = await db<{ id: number }>`
      insert into order_items (order_id, product_id, name, qty, unit_kz, notes, extras)
      values (${orderId}, ${line.product.id}, ${line.product.name}, ${line.qty}, ${line.unit}, ${line.notes}, ${extraText})
      returning id
    `;
    const itemId = num(item[0].id);
    const recipes = await db<Record<string, unknown>>`
      select ingredient_id, qty from recipes where product_id = ${line.product.id}
    `;
    const qtyMap = new Map<number, number>();
    for (const r of recipes) {
      qtyMap.set(num(r.ingredient_id), num(r.qty) * line.qty);
    }
    for (const extraId of line.extraIds) {
      const ing = ings.find((i) => i.id === extraId);
      if (!ing) continue;
      qtyMap.set(extraId, (qtyMap.get(extraId) ?? 0) + Math.max(1, ing.portion) * line.qty);
    }
    for (const [ingId, qty] of qtyMap) {
      const ing = ings.find((i) => i.id === ingId);
      if (!ing || qty <= 0) continue;
      await db`
        insert into order_checks (order_id, order_item_id, ingredient_id, item_name, name, unit, expected_qty, actual_qty)
        values (${orderId}, ${itemId}, ${ingId}, ${line.product.name}, ${ing.name}, ${ing.unit}, ${qty}, ${qty})
      `;
    }
  }
  await db`
    insert into order_events (order_id, status, actor) values (${orderId}, 'recebido', ${input.actor})
  `;
  await logEvent(db, "order.created", { code, canal: input.channel, total: priced.totalKz });
  await audit(db, input.actor, "pedido.criado", code);
  return { token, code, totalKz: priced.totalKz, deliveryCode: code4, replayed: false };
}

export async function tracking(token: string): Promise<TrackData> {
  const db = await getSql();
  const rows = await db.query<Record<string, unknown>>(`${ORDER_SELECT} where o.token = $1`, [token]);
  if (!rows[0]) throw new Error("Não encontrámos este pedido. Confirma o link.");
  const order = mapOrder(rows[0]);
  const events = await db<Record<string, unknown>>`
    select status, actor, to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from order_events where order_id = ${order.id} order by id
  `;
  const shop = await settingsOf(db);
  const pings = await db<Record<string, unknown>>`
    select p.lat, p.lng, p.simulated, st.name as name,
      to_char(p.at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from pings p left join staff st on st.id = p.staff_id
    where p.order_id = ${order.id}
    order by p.id desc limit 1
  `;
  const zone = (await loadZones(db)).find((z) => z.name === order.zoneName);
  return {
    order,
    events: events.map((e) => ({ status: str(e.status), actor: str(e.actor), at: str(e.at) })),
    shop: { lat: shop.lat, lng: shop.lng, address: shop.address },
    courier: pings[0]
      ? {
          lat: num(pings[0].lat),
          lng: num(pings[0].lng),
          at: str(pings[0].at),
          name: str(pings[0].name) || order.courierName,
          simulated: bool(pings[0].simulated),
        }
      : null,
    etaMin: (zone?.etaMin ?? 25) + 8,
  };
}

async function ordersWhere(db: Sql, clause: string, params: unknown[] = []) {
  const rows = await db.query<Record<string, unknown>>(`${ORDER_SELECT} ${clause}`, params);
  return rows.map(mapOrder);
}

export async function kitchenBoard() {
  const db = await getSql();
  const orders = await ordersWhere(
    db,
    `where o.status in ('recebido','preparacao','pronto') order by o.created_at asc`,
  );
  const week = await db<Record<string, unknown>>`
    select count(*) as n from orders o
    where o.stock_applied = true
      and o.created_at > now() - interval '7 days'
      and o.status <> 'cancelado'
      and not exists (
        select 1 from order_checks c
        where c.order_id = o.id and c.actual_qty <> c.expected_qty
      )
  `;
  return { orders, cleanWeek: num(week[0]?.n) };
}

export async function orderDetail(id: number): Promise<OrderDetail> {
  const db = await getSql();
  const rows = await ordersWhere(db, `where o.id = $1`, [id]);
  if (!rows[0]) throw new Error("Pedido não encontrado.");
  const items = await db<Record<string, unknown>>`
    select id, name, qty, unit_kz, notes, extras from order_items where order_id = ${id} order by id
  `;
  const checks = await db<Record<string, unknown>>`
    select * from order_checks where order_id = ${id} order by id
  `;
  const events = await db<Record<string, unknown>>`
    select status, actor, to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from order_events where order_id = ${id} order by id
  `;
  return {
    order: rows[0],
    items: items.map((i) => ({
      id: num(i.id),
      name: str(i.name),
      qty: num(i.qty),
      unitKz: num(i.unit_kz),
      notes: str(i.notes),
      extras: str(i.extras),
    })),
    checks: checks.map((c) => ({
      id: num(c.id),
      orderId: num(c.order_id),
      itemName: str(c.item_name),
      ingredientId: num(c.ingredient_id),
      name: str(c.name),
      unit: str(c.unit),
      expectedQty: num(c.expected_qty),
      actualQty: num(c.actual_qty),
      reason: str(c.reason),
    })),
    events: events.map((e) => ({ status: str(e.status), actor: str(e.actor), at: str(e.at) })),
  };
}

export async function markPreparing(id: number, actor: string) {
  const db = await getSql();
  const rows = await db<{ id: number }>`
    update orders set status = 'preparacao', updated_at = now()
    where id = ${id} and status = 'recebido'
    returning id
  `;
  if (!rows[0]) throw new Error("Este pedido já não está à espera.");
  await db`insert into order_events (order_id, status, actor) values (${id}, 'preparacao', ${actor})`;
  await audit(db, actor, "pedido.preparacao", String(id));
  return { ok: true };
}

export async function finishPrep(input: CheckSave) {
  const db = await getSql();
  const orders = await db<Record<string, unknown>>`select * from orders where id = ${input.orderId}`;
  const order = orders[0];
  if (!order) throw new Error("Pedido não encontrado.");
  const status = str(order.status);
  if (status === "cancelado" || status === "entregue") throw new Error("Este pedido já não se prepara.");
  if (bool(order.stock_applied)) {
    if (status === "preparacao" || status === "recebido") {
      await db`update orders set status = 'pronto', updated_at = now() where id = ${input.orderId}`;
      await db`insert into order_events (order_id, status, actor) values (${input.orderId}, 'pronto', ${input.actor})`;
    }
    return { ok: true, already: true };
  }
  const current = await db<Record<string, unknown>>`select * from order_checks where order_id = ${input.orderId}`;
  const byId = new Map(input.lines.map((l) => [l.id, l]));
  for (const row of current) {
    const edit = byId.get(num(row.id));
    const actual = edit ? Math.max(0, Math.round(edit.actualQty)) : num(row.actual_qty);
    const reason = (edit?.reason ?? str(row.reason)).trim().slice(0, 160);
    if (actual !== num(row.expected_qty) && reason.length < 3) {
      throw new Error(`Em ${str(row.name)}, a quantidade mudou. Diz o motivo (ex.: sem cebola).`);
    }
    await db`
      update order_checks set actual_qty = ${actual}, reason = ${reason} where id = ${num(row.id)}
    `;
    await db`update ingredients set stock_qty = stock_qty - ${actual} where id = ${num(row.ingredient_id)}`;
    await db`
      insert into stock_moves (ingredient_id, kind, qty, reason, actor, order_id)
      values (${num(row.ingredient_id)}, 'pedido', ${-actual}, ${reason || str(order.code)}, ${input.actor}, ${input.orderId})
    `;
  }
  await db`
    update orders set status = 'pronto', stock_applied = true, updated_at = now() where id = ${input.orderId}
  `;
  await db`insert into order_events (order_id, status, actor) values (${input.orderId}, 'pronto', ${input.actor})`;
  const lows = await db<Record<string, unknown>>`
    select name, stock_qty, min_qty, unit from ingredients where stock_qty <= min_qty and active = true
  `;
  for (const low of lows) {
    await logEvent(db, "stock.low", { ingrediente: str(low.name), stock: num(low.stock_qty), minimo: num(low.min_qty) });
  }
  await audit(db, input.actor, "pedido.pronto", str(order.code));
  return { ok: true, already: false, low: lows.length };
}

export async function cancelOrder(id: number, actor: string, reason: string) {
  const db = await getSql();
  const rows = await db<{ code: string }>`
    update orders set status = 'cancelado', updated_at = now(), notes = ${reason.slice(0, 180)}
    where id = ${id} and status not in ('entregue','cancelado')
    returning code
  `;
  if (!rows[0]) throw new Error("Não dá para cancelar este pedido.");
  await db`insert into order_events (order_id, status, actor) values (${id}, 'cancelado', ${actor})`;
  await audit(db, actor, "pedido.cancelado", `${rows[0].code}: ${reason}`);
  return { ok: true };
}

export async function courierBoard() {
  const db = await getSql();
  const orders = await ordersWhere(
    db,
    `where o.status in ('pronto','entrega') order by o.created_at asc`,
  );
  const shop = await settingsOf(db);
  const pings = await db<Record<string, unknown>>`
    select distinct on (order_id) order_id, lat, lng, simulated, staff_id,
      to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from pings order by order_id, id desc
  `;
  return {
    orders,
    shop: { lat: shop.lat, lng: shop.lng },
    pings: pings.map((p) => ({
      orderId: num(p.order_id),
      lat: num(p.lat),
      lng: num(p.lng),
      simulated: bool(p.simulated),
      staffId: num(p.staff_id),
      at: str(p.at),
    })),
  };
}

export async function acceptDelivery(orderId: number, staffId: number, actor: string) {
  const db = await getSql();
  const rows = await db<{ id: number }>`
    update orders set status = 'entrega', courier_id = ${staffId}, updated_at = now()
    where id = ${orderId} and status = 'pronto'
    returning id
  `;
  if (!rows[0]) throw new Error("Este pedido já não está pronto para sair.");
  await db`insert into order_events (order_id, status, actor) values (${orderId}, 'entrega', ${actor})`;
  const shop = await settingsOf(db);
  await db`
    insert into pings (staff_id, order_id, lat, lng, simulated)
    values (${staffId}, ${orderId}, ${shop.lat}, ${shop.lng}, true)
  `;
  await audit(db, actor, "pedido.saiu", String(orderId));
  return { ok: true };
}

export async function pingCourier(input: {
  orderId: number;
  staffId: number;
  lat: number;
  lng: number;
  simulated: boolean;
}) {
  const db = await getSql();
  const rows = await db<{ id: number }>`
    select id from orders where id = ${input.orderId} and status = 'entrega'
  `;
  if (!rows[0]) return { ok: false };
  await db`
    insert into pings (staff_id, order_id, lat, lng, simulated)
    values (${input.staffId}, ${input.orderId}, ${input.lat}, ${input.lng}, ${input.simulated})
  `;
  return { ok: true };
}

export async function confirmDelivery(input: {
  orderId: number;
  code: string;
  actor: string;
  paid: boolean;
  note: string;
}) {
  const db = await getSql();
  const rows = await db<Record<string, unknown>>`select * from orders where id = ${input.orderId}`;
  const order = rows[0];
  if (!order) throw new Error("Pedido não encontrado.");
  if (str(order.status) !== "entrega") throw new Error("Este pedido não está em entrega.");
  if (str(order.delivery_code) !== input.code.trim()) {
    throw new Error("Código incorrecto. Pede os 4 dígitos ao cliente.");
  }
  await db`
    update orders set status = 'entregue', paid = ${input.paid}, updated_at = now()
    where id = ${input.orderId}
  `;
  await db`insert into order_events (order_id, status, actor) values (${input.orderId}, 'entregue', ${input.actor})`;
  await logEvent(db, "order.delivered", { code: str(order.code), pago: input.paid, nota: input.note.slice(0, 140) });
  await audit(db, input.actor, "pedido.entregue", str(order.code));
  return { ok: true };
}

export async function listOrders() {
  const db = await getSql();
  return ordersWhere(db, `order by o.id desc limit 80`);
}

export async function dashboard() {
  const db = await getSql();
  const orders = await ordersWhere(db, `where o.created_at > now() - interval '21 days' order by o.id desc`);
  const today = diaChave(new Date().toISOString());
  const todayOrders = orders.filter((o) => diaChave(o.createdAt) === today && o.status !== "cancelado");
  const delivered = todayOrders.filter((o) => o.status === "entregue");
  const sales = delivered.reduce((s, o) => s + o.totalKz, 0);
  const byChannelMap = new Map<string, { n: number; total: number }>();
  for (const o of todayOrders) {
    const cur = byChannelMap.get(o.channel) ?? { n: 0, total: 0 };
    cur.n += 1;
    cur.total += o.totalKz;
    byChannelMap.set(o.channel, cur);
  }
  const days: { day: string; total: number; n: number }[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 86400000);
    const key = diaChave(d.toISOString());
    const slice = orders.filter((o) => diaChave(o.createdAt) === key && o.status === "entregue");
    days.push({
      day: key.slice(5),
      total: slice.reduce((s, o) => s + o.totalKz, 0),
      n: slice.length,
    });
  }
  const itemRows = await db<Record<string, unknown>>`
    select oi.name, sum(oi.qty) as qty, sum(oi.qty * oi.unit_kz) as total
    from order_items oi join orders o on o.id = oi.order_id
    where o.status <> 'cancelado' and o.created_at > now() - interval '14 days'
    group by oi.name order by sum(oi.qty) desc limit 6
  `;
  const events = await db<Record<string, unknown>>`
    select order_id, status, to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from order_events where at > now() - interval '7 days'
  `;
  const byOrder = new Map<number, Record<string, number>>();
  for (const e of events) {
    const id = num(e.order_id);
    const bag = byOrder.get(id) ?? {};
    bag[str(e.status)] = new Date(str(e.at)).getTime();
    byOrder.set(id, bag);
  }
  const prep: number[] = [];
  const trip: number[] = [];
  for (const bag of byOrder.values()) {
    if (bag.recebido && bag.pronto) prep.push((bag.pronto - bag.recebido) / 60000);
    if (bag.entrega && bag.entregue) trip.push((bag.entregue - bag.entrega) / 60000);
  }
  const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((s, n) => s + n, 0) / xs.length) : null);
  const punches = await db<Record<string, unknown>>`
    select p.staff_id, p.kind, s.name, s.role,
      to_char(p.at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from punches p join staff s on s.id = p.staff_id
    where p.at > now() - interval '18 hours'
    order by p.at desc
  `;
  const seen = new Set<number>();
  const present: { name: string; role: string; since: string; kind: string }[] = [];
  for (const p of punches) {
    const id = num(p.staff_id);
    if (seen.has(id)) continue;
    seen.add(id);
    const kind = str(p.kind);
    if (kind === "entrada" || kind === "regresso" || kind === "pausa") {
      present.push({ name: str(p.name), role: str(p.role), since: str(p.at), kind });
    }
  }
  const lows = (await loadIngs(db)).filter((i) => i.stock <= i.min);
  return {
    salesKz: sales,
    orders: todayOrders.length,
    ticketKz: delivered.length ? Math.round(sales / delivered.length) : 0,
    open: todayOrders.filter((o) => o.status !== "entregue").length,
    byChannel: [...byChannelMap.entries()].map(([channel, v]) => ({ channel, ...v })),
    byDay: days,
    top: itemRows.map((r) => ({ name: str(r.name), qty: num(r.qty), total: num(r.total) })),
    prepAvgMin: avg(prep),
    tripAvgMin: avg(trip),
    present,
    lowStock: lows.map((i) => ({ name: i.name, stock: i.stock, min: i.min, unit: i.unit })),
  };
}

async function ensureCostBasis(db: Sql) {
  // A massa de pocket chegou a ficar a 3.000 Kz/g por um preço mal gravado.
  // 450 Kz por base de 150 g são 3 Kz/g, ou seja 300 cêntimos.
  await db`update ingredients set cost_cents = 300 where name = 'Massa' and cost_cents > 1000`;
}

async function productCosts(db: Sql) {
  const products = (await loadProducts(db)).filter((p) => !p.custom);
  const recipes = await db<Record<string, unknown>>`
    select r.product_id, r.qty, i.cost_cents
    from recipes r join ingredients i on i.id = r.ingredient_id
  `;
  const cost = new Map<number, number>();
  for (const r of recipes) {
    const qty = num(r.qty);
    const cents = num(r.cost_cents);
    cost.set(num(r.product_id), (cost.get(num(r.product_id)) ?? 0) + qty * cents);
  }
  return products.map((p) => {
    const costKz = Math.round((cost.get(p.id) ?? 0) / 100);
    const marginKz = p.priceKz - costKz;
    const foodCostPct = p.priceKz > 0 ? Math.round((costKz / p.priceKz) * 1000) / 10 : 0;
    const marginPct = p.priceKz > 0 ? marginKz / p.priceKz : 0;
    const priority = p.categorySlug === "bebidas"
      ? "—"
      : foodCostPct === 0
        ? "Ficha vazia"
        : marginPct >= 0.45 && foodCostPct <= 60
          ? "Alta"
          : foodCostPct <= 45
            ? "Média"
            : "Rever";
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      categorySlug: p.categorySlug,
      priceKz: p.priceKz,
      costKz,
      marginKz,
      foodCostPct,
      priority,
    };
  });
}

export async function stockBoard() {
  const db = await getSql();
  await ensureCostBasis(db);
  const ingredients = await loadIngs(db);
  const moves = await db<Record<string, unknown>>`
    select m.id, m.kind, m.qty, m.cost_kz, m.reason, m.actor, i.name, i.unit,
      to_char(m.at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from stock_moves m join ingredients i on i.id = m.ingredient_id
    order by m.id desc limit 40
  `;
  const products = await loadProducts(db);
  const foodCost = await productCosts(db);
  return {
    ingredients,
    moves: moves.map((m) => ({
      id: num(m.id),
      kind: str(m.kind),
      qty: num(m.qty),
      costKz: num(m.cost_kz),
      reason: str(m.reason),
      actor: str(m.actor),
      name: str(m.name),
      unit: str(m.unit),
      at: str(m.at),
    })),
    foodCost,
  };
}

export async function stockAdjust(input: {
  ingredientId: number;
  kind: "entrada" | "quebra" | "interno" | "contagem";
  qty: number;
  reason: string;
  actor: string;
  costKz: number;
}) {
  const db = await getSql();
  const rows = await db<Record<string, unknown>>`select * from ingredients where id = ${input.ingredientId}`;
  const ing = rows[0];
  if (!ing) throw new Error("Ingrediente não encontrado.");
  const qty = Math.round(input.qty);
  if (!Number.isFinite(qty)) throw new Error("Quantidade inválida.");
  const reason = input.reason.trim().slice(0, 180);
  if (reason.length < 3 && input.kind !== "entrada") throw new Error("Indica o motivo.");
  let delta = qty;
  if (input.kind === "quebra" || input.kind === "interno") {
    if (qty <= 0) throw new Error("A quantidade tem de ser positiva.");
    delta = -qty;
  } else if (input.kind === "entrada") {
    if (qty <= 0) throw new Error("A entrada tem de ser positiva.");
    delta = qty;
  } else {
    delta = qty - num(ing.stock_qty);
  }
  const costKz = Math.max(0, Math.round(input.costKz || 0));
  // Uma compra com custo actualiza o preço usado no food cost.
  // A quantidade está na unidade de stock, por isso o preço unitário é o total a dividir por ela.
  if (input.kind === "entrada" && costKz > 0 && qty > 0) {
    const per = Math.round((costKz * 100) / qty);
    await db`update ingredients set cost_cents = ${per} where id = ${input.ingredientId}`;
  }
  await db`update ingredients set stock_qty = stock_qty + ${delta} where id = ${input.ingredientId}`;
  await db`
    insert into stock_moves (ingredient_id, kind, qty, cost_kz, reason, actor)
    values (${input.ingredientId}, ${input.kind}, ${delta}, ${Math.max(0, Math.round(input.costKz || 0))}, ${reason}, ${input.actor})
  `;
  await audit(db, input.actor, `stock.${input.kind}`, `${str(ing.name)} ${delta}`);
  return { ok: true };
}

export async function saveIngredientCost(input: { ingredientId: number; pricePerKgKz: number; actor: string }) {
  const db = await getSql();
  const price = Math.round(input.pricePerKgKz);
  if (!Number.isFinite(price) || price < 0) throw new Error("Preço inválido.");
  const rows = await db<Record<string, unknown>>`select name, unit from ingredients where id = ${input.ingredientId}`;
  const ing = rows[0];
  if (!ing) throw new Error("Ingrediente não encontrado.");
  const unit = str(ing.unit);
  // O ecrã pede Kz por kg, por litro ou por unidade. A base guarda o preço da unidade de stock.
  const cents = unit === "g" || unit === "ml" ? Math.round((price * 100) / 1000) : Math.round(price * 100);
  await db`update ingredients set cost_cents = ${cents} where id = ${input.ingredientId}`;
  await audit(db, input.actor, "custo.atualizado", `${str(ing.name)} ${price} Kz`);
  return { ok: true };
}

export async function fichas() {
  const db = await getSql();
  await ensureCostBasis(db);
  const products = await loadProducts(db);
  const ingredients = await loadIngs(db);
  const lines = await db<Record<string, unknown>>`
    select product_id, ingredient_id, qty from recipes order by product_id, ingredient_id
  `;
  return {
    products,
    ingredients: ingredients.map((i) => ({ id: i.id, name: i.name, unit: i.unit, costCents: i.costCents })),
    lines: lines.map((l) => ({
      productId: num(l.product_id),
      ingredientId: num(l.ingredient_id),
      qty: num(l.qty),
    })),
  };
}

export async function saveRecipe(input: {
  productId: number;
  actor: string;
  lines: { ingredientId: number; qty: number }[];
}) {
  const db = await getSql();
  await db`delete from recipes where product_id = ${input.productId}`;
  for (const line of input.lines) {
    const qty = Math.round(line.qty);
    if (qty <= 0) continue;
    await db`
      insert into recipes (product_id, ingredient_id, qty)
      values (${input.productId}, ${line.ingredientId}, ${qty})
      on conflict (product_id, ingredient_id) do update set qty = ${qty}
    `;
  }
  await audit(db, input.actor, "ficha.atualizada", String(input.productId));
  return { ok: true };
}

export async function saveProduct(input: {
  id: number | null;
  categoryId: number;
  name: string;
  description: string;
  priceKz: number;
  active: boolean;
  actor: string;
}) {
  const db = await getSql();
  const name = input.name.trim().slice(0, 80);
  if (name.length < 2) throw new Error("O produto precisa de um nome.");
  const price = Math.round(input.priceKz);
  if (price < 0) throw new Error("Preço inválido.");
  const description = input.description.trim().slice(0, 220);
  if (input.id) {
    await db`
      update products set name = ${name}, description = ${description}, price_kz = ${price},
        active = ${input.active}, category_id = ${input.categoryId}
      where id = ${input.id}
    `;
    await audit(db, input.actor, "ementa.editada", name);
    return { id: input.id };
  }
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString().slice(-4)}`;
  const rows = await db<{ id: number }>`
    insert into products (category_id, name, slug, description, price_kz, active, photo, sort)
    values (${input.categoryId}, ${name}, ${slug}, ${description}, ${price}, ${input.active}, '', 50)
    returning id
  `;
  await audit(db, input.actor, "ementa.nova", name);
  return { id: num(rows[0].id) };
}

export async function customerBoard() {
  const db = await getSql();
  const rows = await db<Record<string, unknown>>`
    select c.*,
      (select count(*) from orders o where o.customer_id = c.id and o.status <> 'cancelado') as orders,
      (select coalesce(sum(total_kz), 0) from orders o where o.customer_id = c.id and o.status <> 'cancelado') as spent,
      (select to_char(max(o.created_at) at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
         from orders o where o.customer_id = c.id and o.status <> 'cancelado') as last_order,
      to_char(c.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created,
      case when c.birthday is null then null else to_char(c.birthday, 'YYYY-MM-DD') end as birthday_s
    from customers c order by c.name
  `;
  return rows.map((r) => {
    const last = r.last_order == null ? null : str(r.last_order);
    const created = str(r.created);
    const orders = num(r.orders);
    const spent = num(r.spent);
    const days = last ? Math.floor((Date.now() - new Date(last).getTime()) / 86400000) : 999;
    const age = Math.floor((Date.now() - new Date(created).getTime()) / 86400000);
    const tags: string[] = [];
    if (days >= 30) tags.push("inativo");
    else if (days >= 14) tags.push("em risco");
    if (spent >= 30000 || num(r.pizzas_count) >= 12) tags.push("VIP");
    if (orders >= 3 && days < 14) tags.push("frequente");
    if (age <= 14 && orders <= 1) tags.push("novo");
    if (!tags.length) tags.push("regular");
    const bday = r.birthday_s == null ? null : str(r.birthday_s);
    let birthdaySoon = false;
    if (bday) {
      const [, m, d] = bday.split("-").map(Number);
      const now = new Date();
      const luanda = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Luanda" }));
      const target = new Date(luanda.getFullYear(), (m ?? 1) - 1, d ?? 1);
      const diff = Math.round((target.getTime() - new Date(luanda.getFullYear(), luanda.getMonth(), luanda.getDate()).getTime()) / 86400000);
      birthdaySoon = diff >= 0 && diff <= 7;
    }
    return {
      id: num(r.id),
      name: str(r.name),
      phone: str(r.phone),
      notes: str(r.notes),
      allergies: str(r.allergies),
      channel: str(r.channel),
      optIn: bool(r.opt_in),
      points: num(r.points),
      pizzas: num(r.pizzas_count),
      address: str(r.address),
      landmark: str(r.landmark),
      orders,
      spent,
      lastOrder: last,
      tags,
      birthday: bday,
      birthdaySoon,
      ticket: orders ? Math.round(spent / orders) : 0,
    };
  });
}

export async function saveCustomer(input: {
  id: number;
  notes: string;
  allergies: string;
  optIn: boolean;
  actor: string;
}) {
  const db = await getSql();
  await db`
    update customers set notes = ${input.notes.slice(0, 280)}, allergies = ${input.allergies.slice(0, 120)},
      opt_in = ${input.optIn}
    where id = ${input.id}
  `;
  await audit(db, input.actor, "cliente.editado", String(input.id));
  return { ok: true };
}

export async function punchBoard() {
  const db = await getSql();
  const staff = await db<Record<string, unknown>>`select id, name, role, phone from staff where active order by id`;
  const punches = await db<Record<string, unknown>>`
    select p.id, p.staff_id, p.kind, p.inside, p.offline, p.actor, s.name,
      to_char(p.at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from punches p join staff s on s.id = p.staff_id
    where p.at > now() - interval '14 days'
    order by p.at desc limit 200
  `;
  return {
    staff: staff.map((s) => ({ id: num(s.id), name: str(s.name), role: str(s.role), phone: str(s.phone) })),
    punches: punches.map((p) => ({
      id: num(p.id),
      staffId: num(p.staff_id),
      name: str(p.name),
      kind: str(p.kind),
      inside: bool(p.inside),
      offline: bool(p.offline),
      at: str(p.at),
    })),
  };
}

export async function doPunch(input: PunchInput) {
  const db = await getSql();
  const shop = await settingsOf(db);
  const staff = await db<Record<string, unknown>>`select * from staff where id = ${input.staffId} and active`;
  if (!staff[0]) throw new Error("Funcionário não encontrado.");
  if (!["entrada", "saida", "pausa", "regresso"].includes(input.kind)) throw new Error("Tipo de picagem inválido.");
  const dist = meters(input.lat, input.lng, shop.lat, shop.lng);
  if (dist > shop.geofenceM) {
    await audit(db, input.actor, "ponto.recusado", `${Math.round(dist)} m`);
    throw new Error(`Estás a ${Math.round(dist)} m da Pezzo. O ponto só regista dentro de ${shop.geofenceM} m.`);
  }
  const last = await db<Record<string, unknown>>`
    select kind from punches where staff_id = ${input.staffId} order by at desc, id desc limit 1
  `;
  const prev = last[0] ? str(last[0].kind) : "";
  const open = prev === "entrada" || prev === "regresso";
  const paused = prev === "pausa";
  if (input.kind === "entrada" && (open || paused)) throw new Error("Já estás em serviço.");
  if (input.kind === "saida" && !open && !paused) throw new Error("Ainda não entraste.");
  if (input.kind === "pausa" && !open) throw new Error("Só podes pausar depois de entrar.");
  if (input.kind === "regresso" && !paused) throw new Error("Não há pausa em aberto.");
  let when: string | null = null;
  if (input.offline && input.at) {
    const t = new Date(input.at).getTime();
    if (Number.isNaN(t)) throw new Error("Hora do telemóvel inválida.");
    if (t > Date.now() + 10 * 60 * 1000) throw new Error("A hora do telemóvel está no futuro.");
    if (Date.now() - t > 3 * 86400000) throw new Error("Picagem antiga demais para sincronizar.");
    when = new Date(t).toISOString();
  }
  await db`
    insert into punches (staff_id, kind, lat, lng, inside, offline, actor, at)
    values (
      ${input.staffId}, ${input.kind}, ${input.lat}, ${input.lng}, true, ${input.offline}, ${input.actor},
      coalesce(${when}::timestamptz, now())
    )
  `;
  await audit(db, input.actor, `ponto.${input.kind}`, input.offline ? "offline" : "online");
  return { ok: true, inside: true, meters: Math.round(dist) };
}

export async function suggestionBoard() {
  const db = await getSql();
  const rows = await db<Record<string, unknown>>`
    select id, kind, title, body, audience, message, status, source,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from suggestions order by id desc limit 30
  `;
  const coupons = await loadCoupons(db);
  return {
    suggestions: rows.map((r) => ({
      id: num(r.id),
      kind: str(r.kind),
      title: str(r.title),
      body: str(r.body),
      audience: str(r.audience),
      message: str(r.message),
      status: str(r.status),
      source: str(r.source),
      at: str(r.at),
    })),
    coupons,
  };
}

export async function decideSuggestion(id: number, status: string, actor: string) {
  if (!["aprovada", "dispensada", "enviada", "pendente"].includes(status)) {
    throw new Error("Estado inválido.");
  }
  const db = await getSql();
  await db`update suggestions set status = ${status} where id = ${id}`;
  await audit(db, actor, "sugestao", `${id} ${status}`);
  return { ok: true };
}

export async function saveCoupon(input: {
  code: string;
  label: string;
  kind: string;
  value: number;
  maxUses: number;
  actor: string;
}) {
  const db = await getSql();
  const code = input.code.trim().toUpperCase().replace(/\s+/g, "").slice(0, 16);
  if (code.length < 3) throw new Error("O código precisa de pelo menos 3 letras.");
  if (!["percent", "fixo", "entrega"].includes(input.kind)) throw new Error("Tipo de cupão inválido.");
  await db`
    insert into coupons (code, label, kind, value_kz, expires_at, max_uses, active)
    values (${code}, ${input.label.slice(0, 80)}, ${input.kind}, ${Math.max(0, Math.round(input.value))}, now() + interval '45 days', ${Math.max(1, Math.round(input.maxUses))}, true)
    on conflict (code) do update set label = excluded.label, kind = excluded.kind, value_kz = excluded.value_kz, active = true
  `;
  await audit(db, input.actor, "cupao", code);
  return { ok: true };
}

export async function askGrok(actor: string) {
  const db = await getSql();
  const recent = await db`
    select id from suggestions where source = 'grok' and created_at > now() - interval '20 seconds'
  `;
  if (recent.length) throw new Error("Espera uns segundos antes de pedir outra sugestão.");
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("A IA não está disponível neste momento.");
  const lows = (await loadIngs(db)).filter((i) => i.stock <= i.min).slice(0, 6);
  const customers = await customerBoard();
  const risk = customers.filter((c) => c.tags.includes("em risco") || c.tags.includes("inativo")).slice(0, 4);
  const birthdays = customers.filter((c) => c.birthdaySoon).slice(0, 3);
  const top = await db<Record<string, unknown>>`
    select name, sum(qty) as qty from order_items group by name order by sum(qty) desc limit 5
  `;
  const context = JSON.stringify({
    loja: "Pezzo Pizza, Maianga, Luanda. Terça a domingo 10h-20h. Fechado à segunda.",
    stockBaixo: lows.map((i) => ({ nome: i.name, stock: i.stock, minimo: i.min, unidade: i.unit })),
    maisVendidos: top.map((t) => ({ nome: str(t.name), qtd: num(t.qty) })),
    clientesParados: risk.map((c) => ({ nome: c.name.split(" ")[0], dias: c.lastOrder ? Math.floor((Date.now() - new Date(c.lastOrder).getTime()) / 86400000) : null, etiquetas: c.tags })),
    aniversarios: birthdays.map((c) => ({ nome: c.name.split(" ")[0], alergias: c.allergies, pizzas: c.pizzas })),
    regra: "A 10.ª pizza é oferta. Nada é enviado sem aprovação da gerência.",
  });
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "grok-4.5",
      max_tokens: 450,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "És o assistente da Pezzo Pizza em Luanda. Responde APENAS com JSON: {\"title\",\"body\",\"audience\",\"message\",\"kind\"}. kind é um de: inativos, combo, stock, aniversario, dia_fraco. message é um WhatsApp curto em português de Angola, para o admin aprovar — não digas que já foi enviado. Não inventes números fora do contexto.",
        },
        { role: "user", content: context },
      ],
    }),
  });
  if (!res.ok) throw new Error(`O Grok não respondeu (${res.status}). Tenta outra vez daqui a pouco.`);
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = body.choices?.[0]?.message?.content ?? "";
  const parsed = readSuggestion(text);
  await db`
    insert into suggestions (kind, title, body, audience, message, status, source)
    values (${parsed.kind}, ${parsed.title}, ${parsed.body}, ${parsed.audience}, ${parsed.message}, 'pendente', 'grok')
  `;
  await audit(db, actor, "sugestao.grok", parsed.title);
  return { ok: true as const, title: parsed.title };
}

function readSuggestion(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  const fallback = {
    title: "Sugestão do Grok",
    body: text.slice(0, 700),
    audience: "Gestão",
    message: "",
    kind: "geral",
  };
  if (start < 0 || end <= start) return fallback;
  try {
    const obj = JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
    return {
      title: str(obj.title || fallback.title).slice(0, 120),
      body: str(obj.body).slice(0, 800),
      audience: str(obj.audience || "Gestão").slice(0, 140),
      message: str(obj.message).slice(0, 500),
      kind: str(obj.kind || "geral").slice(0, 40),
    };
  } catch {
    return fallback;
  }
}

export async function adminSettings() {
  const db = await getSql();
  const settings = await settingsOf(db);
  const zones = await loadZones(db);
  return { settings, zones };
}

export async function saveSettings(input: {
  phones: string;
  geofenceM: number;
  apiKey: string;
  actor: string;
  zones: { id: number; feeKz: number; etaMin: number }[];
}) {
  const db = await getSql();
  const phones = input.phones
    .split(/[|,]/)
    .map((p) => p.trim())
    .filter(Boolean)
    .join("|");
  if (!phones) throw new Error("Fica pelo menos um telefone.");
  const fence = Math.max(30, Math.min(500, Math.round(input.geofenceM)));
  const key = input.apiKey.trim().slice(0, 80);
  if (key.length < 8) throw new Error("A chave da API tem de ter pelo menos 8 caracteres.");
  await db`
    update settings set phones = ${phones}, geofence_m = ${fence}, api_key = ${key} where id = 1
  `;
  for (const z of input.zones) {
    await db`
      update zones set fee_kz = ${Math.max(0, Math.round(z.feeKz))}, eta_min = ${Math.max(5, Math.round(z.etaMin))}
      where id = ${z.id}
    `;
  }
  await audit(db, input.actor, "loja.definicoes", "contactos, geofence e zonas");
  return { ok: true };
}

export async function auditLog() {
  const db = await getSql();
  const rows = await db<Record<string, unknown>>`
    select actor, action, detail, to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from audit order by id desc limit 40
  `;
  return rows.map((r) => ({ actor: str(r.actor), action: str(r.action), detail: str(r.detail), at: str(r.at) }));
}

export async function assertAgent(key: string | null) {
  const db = await getSql();
  const settings = await settingsOf(db);
  return Boolean(key) && key === settings.apiKey;
}

export async function agentGet(kind: string) {
  if (kind === "resumo") {
    const dash = await dashboard();
    const shop = await settingsOf(await getSql());
    return {
      loja: shop.name,
      morada: shop.address,
      vendasEntreguesHojeKz: dash.salesKz,
      pedidosHoje: dash.orders,
      ticketMedioKz: dash.ticketKz,
      emAberto: dash.open,
      stockBaixo: dash.lowStock,
      presentes: dash.present,
    };
  }
  if (kind === "pedidos") return listOrders();
  if (kind === "stock") {
    const board = await stockBoard();
    return board.ingredients.map((i) => ({
      nome: i.name,
      unidade: i.unit,
      stock: i.stock,
      minimo: i.min,
      baixo: i.stock <= i.min,
    }));
  }
  if (kind === "clientes") {
    const rows = await customerBoard();
    return rows.map((c) => ({
      nome: c.name,
      telefone: c.phone,
      etiquetas: c.tags,
      gastoKz: c.spent,
      pedidos: c.orders,
      pizzas: c.pizzas,
      optIn: c.optIn,
      ultimoPedido: c.lastOrder,
    }));
  }
  if (kind === "eventos") {
    const db = await getSql();
    const rows = await db<Record<string, unknown>>`
      select id, type, payload, to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
      from events order by id desc limit 40
    `;
    return rows.map((r) => ({ id: num(r.id), tipo: str(r.type), payload: str(r.payload), at: str(r.at) }));
  }
  throw new Error("Recurso desconhecido.");
}

export async function agentCreate(body: unknown) {
  if (!body || typeof body !== "object") throw new Error("JSON inválido.");
  const b = body as Record<string, unknown>;
  const cliente = (b.cliente ?? {}) as Record<string, unknown>;
  const itens = Array.isArray(b.itens) ? b.itens : [];
  const input: OrderInput = {
    clientRef: str(b.clientRef || crypto.randomUUID()),
    customerName: str(cliente.nome || b.nome),
    phone: str(cliente.telefone || b.telefone),
    channel: (str(b.canal || "whatsapp") as Channel) || "whatsapp",
    zoneId: num(b.zonaId || 2),
    address: str(b.morada),
    landmark: str(b.referencia),
    payment: (str(b.pagamento || "dinheiro") as Payment) || "dinheiro",
    proof: str(b.comprovativo),
    notes: str(b.notas),
    coupon: str(b.cupao),
    actor: "Agente",
    items: itens.map((item) => {
      const it = item as Record<string, unknown>;
      return {
        productId: num(it.produtoId),
        qty: num(it.qtd || 1),
        notes: str(it.notas),
        extras: Array.isArray(it.extras) ? it.extras.map((n) => num(n)) : [],
      };
    }),
  };
  return createOrder(input);
}
