import { createServerFn } from "@tanstack/react-start";
import type { CheckSave, OrderInput, PunchInput } from "./types";

async function svc() {
  return import("./service.server");
}

export const getHome = createServerFn({ method: "GET" }).handler(async () => (await svc()).fetchHome());
export const getMenu = createServerFn({ method: "GET" }).handler(async () => (await svc()).fetchMenu());

export const quoteOrder = createServerFn({ method: "POST" })
  .validator((data: OrderInput) => data)
  .handler(async ({ data }) => (await svc()).quoteOrder(data));

export const placeOrder = createServerFn({ method: "POST" })
  .validator((data: OrderInput) => data)
  .handler(async ({ data }) => (await svc()).createOrder(data));

export const getTracking = createServerFn({ method: "GET" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => (await svc()).tracking(data.token));

export const getKitchen = createServerFn({ method: "GET" }).handler(async () => (await svc()).kitchenBoard());

export const getOrder = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => (await svc()).orderDetail(data.id));

export const startPrep = createServerFn({ method: "POST" })
  .validator((data: { id: number; actor: string }) => data)
  .handler(async ({ data }) => (await svc()).markPreparing(data.id, data.actor));

export const finishPrep = createServerFn({ method: "POST" })
  .validator((data: CheckSave) => data)
  .handler(async ({ data }) => (await svc()).finishPrep(data));

export const cancelOrder = createServerFn({ method: "POST" })
  .validator((data: { id: number; actor: string; reason: string }) => data)
  .handler(async ({ data }) => (await svc()).cancelOrder(data.id, data.actor, data.reason));

export const getCourier = createServerFn({ method: "GET" }).handler(async () => (await svc()).courierBoard());

export const acceptDelivery = createServerFn({ method: "POST" })
  .validator((data: { orderId: number; staffId: number; actor: string }) => data)
  .handler(async ({ data }) => (await svc()).acceptDelivery(data.orderId, data.staffId, data.actor));

export const pingCourier = createServerFn({ method: "POST" })
  .validator((data: { orderId: number; staffId: number; lat: number; lng: number; simulated: boolean }) => data)
  .handler(async ({ data }) => (await svc()).pingCourier(data));

export const confirmDelivery = createServerFn({ method: "POST" })
  .validator((data: { orderId: number; code: string; actor: string; paid: boolean; note: string }) => data)
  .handler(async ({ data }) => (await svc()).confirmDelivery(data));

export const getDashboard = createServerFn({ method: "GET" }).handler(async () => (await svc()).dashboard());
export const getOrders = createServerFn({ method: "GET" }).handler(async () => (await svc()).listOrders());
export const getStock = createServerFn({ method: "GET" }).handler(async () => (await svc()).stockBoard());

export const adjustStock = createServerFn({ method: "POST" })
  .validator(
    (data: {
      ingredientId: number;
      kind: "entrada" | "quebra" | "interno" | "contagem";
      qty: number;
      reason: string;
      actor: string;
      costKz: number;
    }) => data,
  )
  .handler(async ({ data }) => (await svc()).stockAdjust(data));

export const saveIngredientCost = createServerFn({ method: "POST" })
  .validator((data: { ingredientId: number; pricePerKgKz: number; actor: string }) => data)
  .handler(async ({ data }) => (await svc()).saveIngredientCost(data));

export const getFichas = createServerFn({ method: "GET" }).handler(async () => (await svc()).fichas());

export const saveRecipe = createServerFn({ method: "POST" })
  .validator((data: { productId: number; actor: string; lines: { ingredientId: number; qty: number }[] }) => data)
  .handler(async ({ data }) => (await svc()).saveRecipe(data));

export const saveProduct = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: number | null;
      categoryId: number;
      name: string;
      description: string;
      priceKz: number;
      active: boolean;
      actor: string;
    }) => data,
  )
  .handler(async ({ data }) => (await svc()).saveProduct(data));

export const getCustomers = createServerFn({ method: "GET" }).handler(async () => (await svc()).customerBoard());

export const saveCustomer = createServerFn({ method: "POST" })
  .validator((data: { id: number; notes: string; allergies: string; optIn: boolean; actor: string }) => data)
  .handler(async ({ data }) => (await svc()).saveCustomer(data));

export const getPunches = createServerFn({ method: "GET" }).handler(async () => (await svc()).punchBoard());

export const doPunch = createServerFn({ method: "POST" })
  .validator((data: PunchInput) => data)
  .handler(async ({ data }) => (await svc()).doPunch(data));

export const getSuggestions = createServerFn({ method: "GET" }).handler(async () => (await svc()).suggestionBoard());

export const decideSuggestion = createServerFn({ method: "POST" })
  .validator((data: { id: number; status: string; actor: string }) => data)
  .handler(async ({ data }) => (await svc()).decideSuggestion(data.id, data.status, data.actor));

export const saveCoupon = createServerFn({ method: "POST" })
  .validator((data: { code: string; label: string; kind: string; value: number; maxUses: number; actor: string }) => data)
  .handler(async ({ data }) => (await svc()).saveCoupon(data));

export const askGrok = createServerFn({ method: "POST" })
  .validator((data: { actor: string }) => data)
  .handler(async ({ data }) => (await svc()).askGrok(data.actor));

export const getAdminSettings = createServerFn({ method: "GET" }).handler(async () => (await svc()).adminSettings());

export const saveSettings = createServerFn({ method: "POST" })
  .validator(
    (data: {
      phones: string;
      geofenceM: number;
      apiKey: string;
      actor: string;
      zones: { id: number; feeKz: number; etaMin: number }[];
    }) => data,
  )
  .handler(async ({ data }) => (await svc()).saveSettings(data));

export const getAudit = createServerFn({ method: "GET" }).handler(async () => (await svc()).auditLog());
