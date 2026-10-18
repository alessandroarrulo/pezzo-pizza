export type Channel = "app" | "whatsapp" | "instagram" | "telefone" | "balcao";
export type Payment = "dinheiro" | "tpa" | "multicaixa" | "transferencia";
export type Status = "recebido" | "preparacao" | "pronto" | "entrega" | "entregue" | "cancelado";
export type PunchKind = "entrada" | "saida" | "pausa" | "regresso";
export type Role = "cliente" | "cozinha" | "estafeta" | "admin";

export type Product = {
  id: number;
  categoryId: number;
  category: string;
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  priceKz: number;
  active: boolean;
  photo: string;
  custom: boolean;
};

export type Category = { id: number; name: string; slug: string; sort: number };
export type Topping = {
  id: number;
  name: string;
  unit: string;
  portion: number;
  extraKz: number;
};
export type Zone = { id: number; name: string; feeKz: number; etaMin: number };

export type SettingsPublic = {
  name: string;
  tagline: string;
  address: string;
  phones: string[];
  instagram: string;
  facebook: string;
  email: string;
  lat: number;
  lng: number;
  geofenceM: number;
  hoursLabel: string;
  loyaltyEvery: number;
};

export type MenuData = {
  settings: SettingsPublic;
  categories: Category[];
  products: Product[];
  toppings: Topping[];
  zones: Zone[];
};

export type OrderItemInput = {
  productId: number;
  qty: number;
  notes?: string;
  extras?: number[];
};

export type OrderInput = {
  clientRef: string;
  customerName: string;
  phone: string;
  channel: Channel;
  zoneId: number;
  address: string;
  landmark: string;
  payment: Payment;
  proof: string;
  notes: string;
  coupon: string;
  actor: string;
  items: OrderItemInput[];
};

export type QuoteLine = { name: string; qty: number; unitKz: number; lineKz: number };
export type Quote = {
  lines: QuoteLine[];
  subtotalKz: number;
  discountKz: number;
  deliveryKz: number;
  totalKz: number;
  freePizzas: number;
  couponLabel: string;
  loyaltyNote: string;
  etaMin: number;
};

export type OrderCard = {
  id: number;
  code: string;
  token: string;
  status: Status;
  channel: Channel;
  customerName: string;
  phone: string;
  totalKz: number;
  subtotalKz: number;
  discountKz: number;
  deliveryKz: number;
  payment: Payment;
  paid: boolean;
  address: string;
  landmark: string;
  zoneName: string;
  allergy: string;
  notes: string;
  courierId: number | null;
  courierName: string;
  deliveryCode: string;
  createdAt: string;
  lat: number;
  lng: number;
  itemSummary: string;
  stockApplied: boolean;
};

export type CheckLine = {
  id: number;
  orderId: number;
  itemName: string;
  ingredientId: number;
  name: string;
  unit: string;
  expectedQty: number;
  actualQty: number;
  reason: string;
};

export type OrderItem = {
  id: number;
  name: string;
  qty: number;
  unitKz: number;
  notes: string;
  extras: string;
};

export type TimelineEvent = { status: string; actor: string; at: string };

export type OrderDetail = {
  order: OrderCard;
  items: OrderItem[];
  checks: CheckLine[];
  events: TimelineEvent[];
};

export type TrackData = {
  order: OrderCard;
  events: TimelineEvent[];
  shop: { lat: number; lng: number; address: string };
  courier: { lat: number; lng: number; at: string; name: string; simulated: boolean } | null;
  etaMin: number;
};

export type PunchInput = {
  staffId: number;
  kind: PunchKind;
  lat: number;
  lng: number;
  offline: boolean;
  at: string | null;
  actor: string;
};

export type CheckSave = {
  orderId: number;
  actor: string;
  lines: { id: number; actualQty: number; reason: string }[];
};

export type Profile = {
  role: Role;
  staffId: number | null;
  name: string;
  title: string;
};
