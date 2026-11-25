
import Link from "next/link";

interface SidebarProps {
  activo: string;
}

export default function Sidebar({ activo }: SidebarProps) {
  const enlaces = [
    { nombre: "Inicio", ruta: "/" },
    { nombre: "Roles", ruta: "/roles" },
    { nombre: "Categorías", ruta: "/categorias" },
    { nombre: "Sedes", ruta: "/sedes" },
    { nombre: "Espacios", ruta: "/espacios" },
  ];

  return (
    <aside className="w-full border-r border-slate-700/60 bg-[#101a2b] px-5 py-7 text-white md:sticky md:top-0 md:h-screen md:w-72 md:shrink-0 md:px-6">
      {/* Encabezado */}
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Event<span className="text-blue-400">Pass</span>
        </h1>

        <p className="mt-3 text-sm font-medium tracking-wide text-slate-400">
          Sistema de gestión de eventos
        </p>

        <div className="mt-7 h-px bg-gradient-to-r from-blue-500/70 to-transparent" />
      </div>

      {/* Navegación */}
      <div>
        <p className="mb-5 px-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Menú principal
        </p>

        <nav className="flex flex-col gap-3">
          {enlaces.map((enlace) => {
            const seleccionado = activo === enlace.nombre;

            return (
              <Link
                key={enlace.nombre}
                href={enlace.ruta}
                className={`flex items-center rounded-xl px-5 py-4 text-base font-semibold transition-all duration-200 ${
                  seleccionado
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-950/40"
                    : "text-slate-300 hover:bg-[#1b2b43] hover:text-white"
                }`}
              >
                {enlace.nombre}
                {seleccionado && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Estado del sistema */}
      <div className="mt-12 rounded-2xl border border-slate-700/70 bg-[#17243a] p-5">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />

          <p className="text-sm font-bold text-white">
            Sistema conectado
          </p>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Plataforma de administración y gestión de eventos EventPass.
        </p>
      </div>

      <div className="mt-10 border-t border-slate-700/60 pt-5">
        <p className="text-center text-xs font-medium tracking-wider text-slate-500">
          EVENTPASS © 2026
        </p>
      </div>
    </aside>
  );
}
