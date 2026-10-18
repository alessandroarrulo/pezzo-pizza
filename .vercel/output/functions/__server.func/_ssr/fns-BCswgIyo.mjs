import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fns-BCswgIyo.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function svc() {
	return import("./service.server-Cn8oBB9z.mjs");
}
var getHome_createServerFn_handler = createServerRpc({
	id: "41f7534fe8377698c9edcc9dca50e75d3c04c3b8dfee3033de0a61e3571ca6b1",
	name: "getHome",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getHome.__executeServer(opts));
var getHome = createServerFn({ method: "GET" }).handler(getHome_createServerFn_handler, async () => (await svc()).fetchHome());
var getMenu_createServerFn_handler = createServerRpc({
	id: "a87b1c03e68c92395d914c0bd9a373ed4553c4cba46781f684deb853b9b63819",
	name: "getMenu",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getMenu.__executeServer(opts));
var getMenu = createServerFn({ method: "GET" }).handler(getMenu_createServerFn_handler, async () => (await svc()).fetchMenu());
var quoteOrder_createServerFn_handler = createServerRpc({
	id: "f27034ce98641b0b3e8c2f1ead55c335dac713f4ad5c57d1de1440fee5ec2dd3",
	name: "quoteOrder",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => quoteOrder.__executeServer(opts));
var quoteOrder = createServerFn({ method: "POST" }).validator((data) => data).handler(quoteOrder_createServerFn_handler, async ({ data }) => (await svc()).quoteOrder(data));
var placeOrder_createServerFn_handler = createServerRpc({
	id: "6c928d28297f947a08ad7c5b6f550a7b2473aadd2315e447fb0b0ec7c479e96d",
	name: "placeOrder",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).validator((data) => data).handler(placeOrder_createServerFn_handler, async ({ data }) => (await svc()).createOrder(data));
var getTracking_createServerFn_handler = createServerRpc({
	id: "b22518c99444cfa1bca1085049345481df536f609469481482fddace6f2aee34",
	name: "getTracking",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getTracking.__executeServer(opts));
var getTracking = createServerFn({ method: "GET" }).validator((data) => data).handler(getTracking_createServerFn_handler, async ({ data }) => (await svc()).tracking(data.token));
var getKitchen_createServerFn_handler = createServerRpc({
	id: "6c110d1286ca76626953ed558841eeffca415fdf24e424cd6fb3a2d224cb3927",
	name: "getKitchen",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getKitchen.__executeServer(opts));
var getKitchen = createServerFn({ method: "GET" }).handler(getKitchen_createServerFn_handler, async () => (await svc()).kitchenBoard());
var getOrder_createServerFn_handler = createServerRpc({
	id: "ac5d6dc36e508f6ab3a3e6824af1692b7349e578e005f41124c91ff94438c612",
	name: "getOrder",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getOrder.__executeServer(opts));
var getOrder = createServerFn({ method: "GET" }).validator((data) => data).handler(getOrder_createServerFn_handler, async ({ data }) => (await svc()).orderDetail(data.id));
var startPrep_createServerFn_handler = createServerRpc({
	id: "4e18a23c1890b8daff1693448bd152d5d413aa60fc488c5b4f48d8ccb50f7607",
	name: "startPrep",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => startPrep.__executeServer(opts));
var startPrep = createServerFn({ method: "POST" }).validator((data) => data).handler(startPrep_createServerFn_handler, async ({ data }) => (await svc()).markPreparing(data.id, data.actor));
var finishPrep_createServerFn_handler = createServerRpc({
	id: "a3754872654d924422a2698f94e6e5ead7173b960218d0ebc20f85b3b67e2a1f",
	name: "finishPrep",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => finishPrep.__executeServer(opts));
var finishPrep = createServerFn({ method: "POST" }).validator((data) => data).handler(finishPrep_createServerFn_handler, async ({ data }) => (await svc()).finishPrep(data));
var cancelOrder_createServerFn_handler = createServerRpc({
	id: "75dbab5440edc9bfaedb9d7b4b4d580d5f0a41c83785a698c04db4d4a44c92f2",
	name: "cancelOrder",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => cancelOrder.__executeServer(opts));
var cancelOrder = createServerFn({ method: "POST" }).validator((data) => data).handler(cancelOrder_createServerFn_handler, async ({ data }) => (await svc()).cancelOrder(data.id, data.actor, data.reason));
var getCourier_createServerFn_handler = createServerRpc({
	id: "d12af759d248c9baff3d53a4709ff53be890c74a2cedfa4d545daa3ec6902676",
	name: "getCourier",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getCourier.__executeServer(opts));
var getCourier = createServerFn({ method: "GET" }).handler(getCourier_createServerFn_handler, async () => (await svc()).courierBoard());
var acceptDelivery_createServerFn_handler = createServerRpc({
	id: "8ac21c2d5d9797c459e72da8afdcc132941d8edc8be4ffc5290c91c2dcda7d18",
	name: "acceptDelivery",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => acceptDelivery.__executeServer(opts));
var acceptDelivery = createServerFn({ method: "POST" }).validator((data) => data).handler(acceptDelivery_createServerFn_handler, async ({ data }) => (await svc()).acceptDelivery(data.orderId, data.staffId, data.actor));
var pingCourier_createServerFn_handler = createServerRpc({
	id: "b6fab01c63a337d74cfef64eb6b2df4e1ee8d98548bcfcdeb00ca3ace9a66d87",
	name: "pingCourier",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => pingCourier.__executeServer(opts));
var pingCourier = createServerFn({ method: "POST" }).validator((data) => data).handler(pingCourier_createServerFn_handler, async ({ data }) => (await svc()).pingCourier(data));
var confirmDelivery_createServerFn_handler = createServerRpc({
	id: "eb7855e0d31386eec4f754abea2fbdc0e1ea68fc5a965c6b93c4ca3a0ec790ba",
	name: "confirmDelivery",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => confirmDelivery.__executeServer(opts));
var confirmDelivery = createServerFn({ method: "POST" }).validator((data) => data).handler(confirmDelivery_createServerFn_handler, async ({ data }) => (await svc()).confirmDelivery(data));
var getDashboard_createServerFn_handler = createServerRpc({
	id: "11756bed428b911fc538b6c1e6cf95eff7970159b8867edf278a410e6e015852",
	name: "getDashboard",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).handler(getDashboard_createServerFn_handler, async () => (await svc()).dashboard());
var getOrders_createServerFn_handler = createServerRpc({
	id: "cb70d1a3698573d05648837f23f08fc54fdefad5dcac1d42e5099cfa76dcc580",
	name: "getOrders",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getOrders.__executeServer(opts));
var getOrders = createServerFn({ method: "GET" }).handler(getOrders_createServerFn_handler, async () => (await svc()).listOrders());
var getStock_createServerFn_handler = createServerRpc({
	id: "18f693647ce4c2d2e98e5eb6dc03b103be9a09cfe0894d5067818b8f64dc7923",
	name: "getStock",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getStock.__executeServer(opts));
var getStock = createServerFn({ method: "GET" }).handler(getStock_createServerFn_handler, async () => (await svc()).stockBoard());
var adjustStock_createServerFn_handler = createServerRpc({
	id: "f8f5ac97f620a678527021c549ba7e773ebdb48b2da8cfe5ec00ac0489179c8a",
	name: "adjustStock",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => adjustStock.__executeServer(opts));
var adjustStock = createServerFn({ method: "POST" }).validator((data) => data).handler(adjustStock_createServerFn_handler, async ({ data }) => (await svc()).stockAdjust(data));
var saveIngredientCost_createServerFn_handler = createServerRpc({
	id: "8561f4758dd336da11eed4151d312c4bd7b106eed60e7a3162151b4ad8d2b6cb",
	name: "saveIngredientCost",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => saveIngredientCost.__executeServer(opts));
var saveIngredientCost = createServerFn({ method: "POST" }).validator((data) => data).handler(saveIngredientCost_createServerFn_handler, async ({ data }) => (await svc()).saveIngredientCost(data));
var getFichas_createServerFn_handler = createServerRpc({
	id: "0569a1e443c268dfa21cdfe9325595d061d4a57ad99c9b44873a997fdd663778",
	name: "getFichas",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getFichas.__executeServer(opts));
var getFichas = createServerFn({ method: "GET" }).handler(getFichas_createServerFn_handler, async () => (await svc()).fichas());
var saveRecipe_createServerFn_handler = createServerRpc({
	id: "1e05ad68d3738f3f6c3d345eec574f43e490ea02aa902d87102d01004f26ca40",
	name: "saveRecipe",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => saveRecipe.__executeServer(opts));
var saveRecipe = createServerFn({ method: "POST" }).validator((data) => data).handler(saveRecipe_createServerFn_handler, async ({ data }) => (await svc()).saveRecipe(data));
var saveProduct_createServerFn_handler = createServerRpc({
	id: "f500f7600a270d39eb5a810ed1a70a290fcc27122e676a4eb10510f1badb3641",
	name: "saveProduct",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => saveProduct.__executeServer(opts));
var saveProduct = createServerFn({ method: "POST" }).validator((data) => data).handler(saveProduct_createServerFn_handler, async ({ data }) => (await svc()).saveProduct(data));
var getCustomers_createServerFn_handler = createServerRpc({
	id: "033070c50db5ddd257a4e4dd5347b96c619c76b30a1b9efaac5c82b4c7d479d2",
	name: "getCustomers",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getCustomers.__executeServer(opts));
var getCustomers = createServerFn({ method: "GET" }).handler(getCustomers_createServerFn_handler, async () => (await svc()).customerBoard());
var saveCustomer_createServerFn_handler = createServerRpc({
	id: "a9749dad547a5dc05ce945af99d74edd03dd34a99786e31fbcbb9acd44daa4ed",
	name: "saveCustomer",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => saveCustomer.__executeServer(opts));
var saveCustomer = createServerFn({ method: "POST" }).validator((data) => data).handler(saveCustomer_createServerFn_handler, async ({ data }) => (await svc()).saveCustomer(data));
var getPunches_createServerFn_handler = createServerRpc({
	id: "69c496bd690d6f4ae2367b8058e20eeb9aeee99feceeef65395a5aa7df7cab0f",
	name: "getPunches",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getPunches.__executeServer(opts));
var getPunches = createServerFn({ method: "GET" }).handler(getPunches_createServerFn_handler, async () => (await svc()).punchBoard());
var doPunch_createServerFn_handler = createServerRpc({
	id: "853b78922e13d355b75a7574ddb08a6a98bea5b7e507aada0c68a10c0cc2f0bc",
	name: "doPunch",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => doPunch.__executeServer(opts));
var doPunch = createServerFn({ method: "POST" }).validator((data) => data).handler(doPunch_createServerFn_handler, async ({ data }) => (await svc()).doPunch(data));
var getSuggestions_createServerFn_handler = createServerRpc({
	id: "35d16f85c8eef227f25b94c9ceb10bb86840a91161ac2130afd413efe0561a2d",
	name: "getSuggestions",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getSuggestions.__executeServer(opts));
var getSuggestions = createServerFn({ method: "GET" }).handler(getSuggestions_createServerFn_handler, async () => (await svc()).suggestionBoard());
var decideSuggestion_createServerFn_handler = createServerRpc({
	id: "cdee45fe4acc6321a9013dc81ddc22668b7d7b06090ad70e470cadc5cb01e520",
	name: "decideSuggestion",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => decideSuggestion.__executeServer(opts));
var decideSuggestion = createServerFn({ method: "POST" }).validator((data) => data).handler(decideSuggestion_createServerFn_handler, async ({ data }) => (await svc()).decideSuggestion(data.id, data.status, data.actor));
var saveCoupon_createServerFn_handler = createServerRpc({
	id: "3bba0939d1a0f293a57d71db595fa68083c8047b6d840bcc2737a99c6d93eb33",
	name: "saveCoupon",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => saveCoupon.__executeServer(opts));
var saveCoupon = createServerFn({ method: "POST" }).validator((data) => data).handler(saveCoupon_createServerFn_handler, async ({ data }) => (await svc()).saveCoupon(data));
var askGrok_createServerFn_handler = createServerRpc({
	id: "f4dd5ae1630e595e85f18b94d9b322d50226a7f4b93ad29a70166f37b887ba90",
	name: "askGrok",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => askGrok.__executeServer(opts));
var askGrok = createServerFn({ method: "POST" }).validator((data) => data).handler(askGrok_createServerFn_handler, async ({ data }) => (await svc()).askGrok(data.actor));
var getAdminSettings_createServerFn_handler = createServerRpc({
	id: "d02b168cc6b3182af8656b6f5d0c5d91de74571d41b5f9f01a8a0d284f6d9adf",
	name: "getAdminSettings",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getAdminSettings.__executeServer(opts));
var getAdminSettings = createServerFn({ method: "GET" }).handler(getAdminSettings_createServerFn_handler, async () => (await svc()).adminSettings());
var saveSettings_createServerFn_handler = createServerRpc({
	id: "b33c2937f64400b4aa2cb683f110dff5b5046f8f829db4e489bad6c224769eff",
	name: "saveSettings",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => saveSettings.__executeServer(opts));
var saveSettings = createServerFn({ method: "POST" }).validator((data) => data).handler(saveSettings_createServerFn_handler, async ({ data }) => (await svc()).saveSettings(data));
var getAudit_createServerFn_handler = createServerRpc({
	id: "a32ef93d0c4a524524d6fc6422082966bf052b9f52acc98be1ebb542d1ea7729",
	name: "getAudit",
	filename: "src/lib/pezzo/fns.ts"
}, (opts) => getAudit.__executeServer(opts));
var getAudit = createServerFn({ method: "GET" }).handler(getAudit_createServerFn_handler, async () => (await svc()).auditLog());
//#endregion
export { acceptDelivery_createServerFn_handler, adjustStock_createServerFn_handler, askGrok_createServerFn_handler, cancelOrder_createServerFn_handler, confirmDelivery_createServerFn_handler, decideSuggestion_createServerFn_handler, doPunch_createServerFn_handler, finishPrep_createServerFn_handler, getAdminSettings_createServerFn_handler, getAudit_createServerFn_handler, getCourier_createServerFn_handler, getCustomers_createServerFn_handler, getDashboard_createServerFn_handler, getFichas_createServerFn_handler, getHome_createServerFn_handler, getKitchen_createServerFn_handler, getMenu_createServerFn_handler, getOrder_createServerFn_handler, getOrders_createServerFn_handler, getPunches_createServerFn_handler, getStock_createServerFn_handler, getSuggestions_createServerFn_handler, getTracking_createServerFn_handler, pingCourier_createServerFn_handler, placeOrder_createServerFn_handler, quoteOrder_createServerFn_handler, saveCoupon_createServerFn_handler, saveCustomer_createServerFn_handler, saveIngredientCost_createServerFn_handler, saveProduct_createServerFn_handler, saveRecipe_createServerFn_handler, saveSettings_createServerFn_handler, startPrep_createServerFn_handler };
