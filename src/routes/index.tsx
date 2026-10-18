import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bike, ChefHat, Clock, LayoutDashboard, MapPin, MessageCircle, Pizza } from "lucide-react";
import { getHome } from "@/lib/pezzo/fns";
import { CHANNEL_LABEL, shopStatus, STATUS_LABEL, waLink } from "@/lib/pezzo/format";
import { PROFILES, useSession } from "@/lib/pezzo/session";
import { Shell } from "@/components/pezzo/shell";

export const Route = createFileRoute("/")({
  loader: () => getHome(),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const navigate = useNavigate();
  const setProfile = useSession((s) => s.setProfile);
  const status = shopStatus();
  const phoneA = data.settings.phones[0] ?? "";
  const phoneB = data.settings.phones[1] ?? "";

  function enter(name: string, to: "/" | "/pedir" | "/cozinha" | "/estafeta" | "/admin") {
    const profile = PROFILES.find((p) => p.name === name) ?? PROFILES[0];
    setProfile(profile);
    void navigate({ to });
  }

  return (
    <Shell>
      <section className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-tomato">Maianga · Luanda</p>
          <h1 className="mt-2 font-display text-5xl leading-none text-bordeaux sm:text-6xl">
            Mais sabor em cada fatia
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            O melhor delivery da cidade. Sabor que chega até si — da Rua Marien Ngouabi, mesmo ao lado da Tudor.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => enter("Cliente", "/pedir")}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-tomato px-5 font-semibold text-on-tomato shadow-card"
            >
              <Pizza className="size-5" />
              Fazer pedido
            </button>
            {phoneA && (
              <a
                href={waLink(phoneA, "Olá Pezzo! Quero fazer um pedido.")}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-amber px-5 font-semibold text-on-amber"
              >
                <MessageCircle className="size-5" />
                WhatsApp
              </a>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-2 shadow-card">
              <Clock className="size-4 text-tomato" />
              {status.label} · {status.clock}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-2 shadow-card">
              <MapPin className="size-4 text-tomato" />
              {data.settings.hoursLabel}
            </span>
          </div>
        </div>
        <img
          src="/menu/real/casa.jpg"
          alt="Pizzas da Pezzo, na casa"
          className="mx-auto aspect-[4/5] w-full max-w-md rounded-3xl object-cover shadow-lift"
        />
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <Door
          title="Cliente"
          text="Ementa, cria a tua pizza e acompanha o estafeta."
          onClick={() => enter("Cliente", "/pedir")}
        />
        <Door
          title="Cozinha"
          text="Fila, ficha técnica e stock que se abate sozinho."
          onClick={() => enter("Carla Kapingana", "/cozinha")}
          icon={<ChefHat className="size-5" />}
        />
        <Door
          title="Estafeta"
          text="Aceitar entregas, GPS e código de 4 dígitos."
          onClick={() => enter("João Muongo", "/estafeta")}
          icon={<Bike className="size-5" />}
        />
        <Door
          title="Gestão"
          text="O dia, clientes, ponto, cupões e sugestões do Grok."
          onClick={() => enter("Ana Tavares", "/admin")}
          icon={<LayoutDashboard className="size-5" />}
        />
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-3xl">Agora na fila</h2>
          <Link to="/acompanhar/$token" params={{ token: "demo-quente" }} className="text-sm font-semibold text-tomato">
            Ver a entrega da Marta
          </Link>
        </div>
        <div className="mt-3 grid gap-2">
          {data.live.length === 0 && <p className="text-muted">A cozinha está em pausa. Faz o primeiro pedido.</p>}
          {data.live.map((o) => (
            <div key={o.code} className="flex items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3 shadow-card">
              <div>
                <p className="font-semibold">{o.code}</p>
                <p className="text-sm text-muted">{o.itemSummary}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-tomato">{STATUS_LABEL[o.status]}</p>
                <p className="text-muted">{CHANNEL_LABEL[o.channel]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 rounded-3xl bg-paper p-4 shadow-card sm:grid-cols-3">
        <Info label="Telefones" value={[phoneA, phoneB].filter(Boolean).join(" · ")} />
        <Info label="Morada" value={data.settings.address} />
        <Info label="Redes" value={`${data.settings.instagram} · ${data.settings.email}`} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-3xl">O preçário</h2>
        <p className="mt-1 text-muted">O mesmo cartaz da casa, já na app. Os preços também se editam na gestão.</p>
        <img src="/marca/precario.jpg" alt="Preçário Pezzo Pizza" className="mt-4 w-full rounded-3xl shadow-card" />
      </section>
    </Shell>
  );
}

function Door({
  title,
  text,
  onClick,
  icon,
}: {
  title: string;
  text: string;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-3xl bg-paper p-4 text-left shadow-card transition-shadow duration-150 hover:shadow-lift"
    >
      <div className="flex items-center gap-2 font-display text-2xl">
        {icon}
        {title}
      </div>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}
