import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fns-CItOgTXU.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getHome = createServerFn({ method: "GET" }).handler(createSsrRpc("41f7534fe8377698c9edcc9dca50e75d3c04c3b8dfee3033de0a61e3571ca6b1"));
var getMenu = createServerFn({ method: "GET" }).handler(createSsrRpc("a87b1c03e68c92395d914c0bd9a373ed4553c4cba46781f684deb853b9b63819"));
var quoteOrder = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("f27034ce98641b0b3e8c2f1ead55c335dac713f4ad5c57d1de1440fee5ec2dd3"));
var placeOrder = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("6c928d28297f947a08ad7c5b6f550a7b2473aadd2315e447fb0b0ec7c479e96d"));
var getTracking = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("b22518c99444cfa1bca1085049345481df536f609469481482fddace6f2aee34"));
var getKitchen = createServerFn({ method: "GET" }).handler(createSsrRpc("6c110d1286ca76626953ed558841eeffca415fdf24e424cd6fb3a2d224cb3927"));
var getOrder = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("ac5d6dc36e508f6ab3a3e6824af1692b7349e578e005f41124c91ff94438c612"));
var startPrep = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("4e18a23c1890b8daff1693448bd152d5d413aa60fc488c5b4f48d8ccb50f7607"));
var finishPrep = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("a3754872654d924422a2698f94e6e5ead7173b960218d0ebc20f85b3b67e2a1f"));
var cancelOrder = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("75dbab5440edc9bfaedb9d7b4b4d580d5f0a41c83785a698c04db4d4a44c92f2"));
var getCourier = createServerFn({ method: "GET" }).handler(createSsrRpc("d12af759d248c9baff3d53a4709ff53be890c74a2cedfa4d545daa3ec6902676"));
var acceptDelivery = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("8ac21c2d5d9797c459e72da8afdcc132941d8edc8be4ffc5290c91c2dcda7d18"));
var pingCourier = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("b6fab01c63a337d74cfef64eb6b2df4e1ee8d98548bcfcdeb00ca3ace9a66d87"));
var confirmDelivery = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("eb7855e0d31386eec4f754abea2fbdc0e1ea68fc5a965c6b93c4ca3a0ec790ba"));
var getDashboard = createServerFn({ method: "GET" }).handler(createSsrRpc("11756bed428b911fc538b6c1e6cf95eff7970159b8867edf278a410e6e015852"));
var getOrders = createServerFn({ method: "GET" }).handler(createSsrRpc("cb70d1a3698573d05648837f23f08fc54fdefad5dcac1d42e5099cfa76dcc580"));
var getStock = createServerFn({ method: "GET" }).handler(createSsrRpc("18f693647ce4c2d2e98e5eb6dc03b103be9a09cfe0894d5067818b8f64dc7923"));
var adjustStock = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("f8f5ac97f620a678527021c549ba7e773ebdb48b2da8cfe5ec00ac0489179c8a"));
var saveIngredientCost = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("8561f4758dd336da11eed4151d312c4bd7b106eed60e7a3162151b4ad8d2b6cb"));
var getFichas = createServerFn({ method: "GET" }).handler(createSsrRpc("0569a1e443c268dfa21cdfe9325595d061d4a57ad99c9b44873a997fdd663778"));
var saveRecipe = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("1e05ad68d3738f3f6c3d345eec574f43e490ea02aa902d87102d01004f26ca40"));
var saveProduct = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("f500f7600a270d39eb5a810ed1a70a290fcc27122e676a4eb10510f1badb3641"));
var getCustomers = createServerFn({ method: "GET" }).handler(createSsrRpc("033070c50db5ddd257a4e4dd5347b96c619c76b30a1b9efaac5c82b4c7d479d2"));
var saveCustomer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("a9749dad547a5dc05ce945af99d74edd03dd34a99786e31fbcbb9acd44daa4ed"));
var getPunches = createServerFn({ method: "GET" }).handler(createSsrRpc("69c496bd690d6f4ae2367b8058e20eeb9aeee99feceeef65395a5aa7df7cab0f"));
var doPunch = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("853b78922e13d355b75a7574ddb08a6a98bea5b7e507aada0c68a10c0cc2f0bc"));
var getSuggestions = createServerFn({ method: "GET" }).handler(createSsrRpc("35d16f85c8eef227f25b94c9ceb10bb86840a91161ac2130afd413efe0561a2d"));
var decideSuggestion = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("cdee45fe4acc6321a9013dc81ddc22668b7d7b06090ad70e470cadc5cb01e520"));
var saveCoupon = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("3bba0939d1a0f293a57d71db595fa68083c8047b6d840bcc2737a99c6d93eb33"));
var askGrok = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("f4dd5ae1630e595e85f18b94d9b322d50226a7f4b93ad29a70166f37b887ba90"));
var getAdminSettings = createServerFn({ method: "GET" }).handler(createSsrRpc("d02b168cc6b3182af8656b6f5d0c5d91de74571d41b5f9f01a8a0d284f6d9adf"));
var saveSettings = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("b33c2937f64400b4aa2cb683f110dff5b5046f8f829db4e489bad6c224769eff"));
var getAudit = createServerFn({ method: "GET" }).handler(createSsrRpc("a32ef93d0c4a524524d6fc6422082966bf052b9f52acc98be1ebb542d1ea7729"));
//#endregion
export { saveProduct as A, getTracking as C, saveCoupon as D, quoteOrder as E, saveSettings as M, startPrep as N, saveCustomer as O, getSuggestions as S, placeOrder as T, getMenu as _, confirmDelivery as a, getPunches as b, finishPrep as c, getCourier as d, getCustomers as f, getKitchen as g, getHome as h, cancelOrder as i, saveRecipe as j, saveIngredientCost as k, getAdminSettings as l, getFichas as m, adjustStock as n, decideSuggestion as o, getDashboard as p, askGrok as r, doPunch as s, acceptDelivery as t, getAudit as u, getOrder as v, pingCourier as w, getStock as x, getOrders as y };
