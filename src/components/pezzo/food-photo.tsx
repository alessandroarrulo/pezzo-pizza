import { useState } from "react";
import { Pizza } from "lucide-react";
import { cn } from "@/lib/utils";

export function FoodPhoto({ src, name, className }: { src: string; name: string; className?: string }) {
  const [bad, setBad] = useState(false);
  if (!src || bad) {
    return (
      <div className={cn("grid place-items-center bg-amber text-bordeaux", className)}>
        <Pizza className="size-8" aria-hidden />
        <span className="sr-only">{name}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setBad(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
