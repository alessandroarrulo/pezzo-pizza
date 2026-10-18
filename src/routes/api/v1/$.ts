import { createFileRoute } from "@tanstack/react-router";

async function handle(request: Request, splat: string | undefined, method: string) {
  const { assertAgent, agentGet, agentCreate } = await import("@/lib/pezzo/service.server");
  const ok = await assertAgent(request.headers.get("x-pezzo-key"));
  if (!ok) {
    return Response.json({ erro: "Chave em falta ou inválida. Envia o cabeçalho x-pezzo-key." }, { status: 401 });
  }
  const path = (splat ?? "").replace(/^\/+|\/+$/g, "");
  try {
    if (method === "GET" && (path === "" || path === "resumo")) return Response.json(await agentGet("resumo"));
    if (method === "GET" && path === "pedidos") return Response.json(await agentGet("pedidos"));
    if (method === "GET" && path === "stock") return Response.json(await agentGet("stock"));
    if (method === "GET" && path === "clientes") return Response.json(await agentGet("clientes"));
    if (method === "GET" && path === "eventos") return Response.json(await agentGet("eventos"));
    if (method === "POST" && path === "encomendas") {
      const body = (await request.json()) as unknown;
      return Response.json(await agentCreate(body));
    }
    return Response.json({ erro: "Recurso desconhecido." }, { status: 404 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return Response.json({ erro: message }, { status: 400 });
  }
}

export const Route = createFileRoute("/api/v1/$")({
  server: {
    handlers: {
      GET: ({ request, params }) => handle(request, params._splat, "GET"),
      POST: ({ request, params }) => handle(request, params._splat, "POST"),
    },
  },
});
