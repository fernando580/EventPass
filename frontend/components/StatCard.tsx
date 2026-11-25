
interface StatCardProps {
  titulo: string;
  cantidad: number | string;
  descripcion: string;
  icono: string;
}

export default function StatCard({
  titulo,
  cantidad,
  descripcion,
  icono,
}: StatCardProps) {
  return (
    <article className="h-full rounded-xl border border-slate-700/70 bg-[#111c31] p-6 shadow-lg transition hover:border-blue-400/50 hover:shadow-blue-950/30">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-300">
          {titulo}
        </p>

        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-2xl text-cyan-300">
          {icono}
        </span>
      </div>

      <p className="text-4xl font-bold tracking-tight text-white">
        {cantidad}
      </p>

      <p className="mt-3 text-sm text-slate-400">
        {descripcion}
      </p>

      <p className="mt-5 text-sm font-semibold text-blue-400">
        Ver módulo →
      </p>
    </article>
  );
}
