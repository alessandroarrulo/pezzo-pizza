import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bike, ChefHat, LayoutDashboard, Pizza, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { confirmDelivery, doPunch, placeOrder } from "@/lib/pezzo/fns";
import { errText, hora } from "@/lib/pezzo/format";
import { PROFILES, useSession } from "@/lib/pezzo/session";
import { cn } from "@/lib/utils";

export function Shell({
  children,
  kds = false,
}: {
  children: React.ReactNode;
  kds?: boolean;
}) {
  const profile = useSession((s) => s.profile);
  const queue = useSession((s) => s.queue);
  const offline = useSession((s) => s.simulatedOffline);
  const lastSync = useSession((s) => s.lastSync);
  const setProfile = useSession((s) => s.setProfile);
  const setOffline = useSession((s) => s.setOffline);
  const dark = useSession((s) => s.kdsDark);
  const [open, setOpen] = useState(false);
  const [navOnline, setNavOnline] = useState(true);

  useEffect(() => {
    void useSession.persist.rehydrate();
    const on = () => setNavOnline(true);
    const off = () => setNavOnline(false);
    setNavOnline(navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const online = navOnline && !offline;

  async function flush() {
    const jobs = [...useSession.getState().queue];
    if (!jobs.length) {
      useSession.getState().markSync(new Date().toISOString());
      toast.success("Nada por enviar.");
      return;
    }
    for (const job of jobs) {
      try {
        if (job.type === "order") await placeOrder({ data: job.body });
        if (job.type === "punch") await doPunch({ data: job.body });
        if (job.type === "deliver") await confirmDelivery({ data: job.body });
        useSession.getState().dequeue(job.id);
      } catch (error) {
        toast.error(errText(error));
        return;
      }
    }
    useSession.getState().markSync(new Date().toISOString());
    toast.success("Sincronizado.");
  }

  useEffect(() => {
    if (!online) return;
    if (!useSession.getState().queue.length) return;
    void flush();
    // Reenvia a fila só quando a rede volta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  const syncLabel = !online
    ? queue.length
      ? `Offline · ${queue.length} por enviar`
      : "Offline"
    : queue.length
      ? `A sincronizar · ${queue.length}`
      : lastSync
        ? `Sincronizado às ${hora(lastSync)}`
        : "Online";

  return (
    <div className={cn(kds && dark && "kds")}>
      <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-h-11 items-center gap-2">
            <img src="/marca/logo.jpg" alt="Pezzo Pizza" className="size-11 rounded-2xl object-cover" />
            <span className="font-display text-xl leading-none">Pezzo</span>
          </Link>
          <button
            type="button"
            onClick={() => void flush()}
            className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-3 text-sm shadow-card"
          >
            {online ? <Wifi className="size-4 text-tomato" /> : <WifiOff className="size-4" />}
            <span className="max-w-40 truncate">{syncLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex min-h-11 items-center rounded-full bg-bordeaux px-3 text-sm font-semibold text-on-tomato"
          >
            {profile.name.split(" ")[0]}
          </button>
        </div>
        {open && (
          <div className="mx-auto grid max-w-6xl gap-1 px-4 pb-3 sm:grid-cols-2">
            {PROFILES.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setProfile(p);
                  setOpen(false);
                }}
                className={cn(
                  "flex min-h-12 items-center justify-between rounded-2xl bg-paper px-3 text-left shadow-card",
                  profile.name === p.name && "ring-2 ring-tomato",
                )}
              >
                <span className="font-semibold">{p.title}</span>
                <span className="text-sm text-muted">{p.name}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOffline(!offline)}
              className="min-h-12 rounded-2xl bg-amber px-3 text-left font-semibold text-on-amber"
            >
              {offline ? "Voltar a estar online" : "Simular rede fraca (offline)"}
            </button>
          </div>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-5 pb-28">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-4">
          <Tab to="/pedir" icon={<Pizza className="size-5" />} label="Pedir" />
          <Tab to="/cozinha" icon={<ChefHat className="size-5" />} label="Cozinha" />
          <Tab to="/estafeta" icon={<Bike className="size-5" />} label="Estafeta" />
          <Tab to="/admin" icon={<LayoutDashboard className="size-5" />} label="Gestão" />
        </div>
      </nav>
    </div>
  );
}

function Tab({ to, icon, label }: { to: "/pedir" | "/cozinha" | "/estafeta" | "/admin"; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-muted data-[status=active]:text-tomato"
      activeProps={{ "data-status": "active" }}
    >
      {icon}
      {label}
    </Link>
  );
}

export function useOnline() {
  const simulated = useSession((s) => s.simulatedOffline);
  const [nav, setNav] = useState(true);
  useEffect(() => {
    const sync = () => setNav(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  return nav && !simulated;
}
