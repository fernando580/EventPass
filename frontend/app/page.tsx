
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import { apiFetch } from "../lib/api";

interface Estadisticas {
  roles: number;
  categorias: number;
  sedes: number;
  espacios: number;
}

function contarRegistros(datos: unknown): number {
  if (Array.isArray(datos)) {
    return datos.length;
  }

  if (
    datos !== null &&
    typeof datos === "object" &&
    "data" in datos &&
    Array.isArray(datos.data)
  ) {
    return datos.data.length;
  }

  return 0;
}

export default function Home() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    roles: 0,
    categorias: 0,
    sedes: 0,
    espacios: 0,
  });

  const [cargando, setCargando] = useState(true);
  const [conectado, setConectado] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarEstadisticas() {
      try {
        setCargando(true);
        setError("");

        const [roles, categorias, sedes, espacios] = await Promise.all([
          apiFetch("/api/roles"),
          apiFetch("/api/categorias"),
          apiFetch("/api/sedes"),
          apiFetch("/api/espacios"),
        ]);

        setEstadisticas({
          roles: contarRegistros(roles),
          categorias: contarRegistros(categorias),
          sedes: contarRegistros(sedes),
          espacios: contarRegistros(espacios),
        });

        setConectado(true);
      } catch (err) {
        setConectado(false);
        setError(
          err instanceof Error
            ? err.message
            : "No fue posible consultar el servidor."
        );
      } finally {
        setCargando(false);
      }
    }

    cargarEstadisticas();
  }, []);

  const tarjetas = [
    {
      titulo: "Roles",
      cantidad: estadisticas.roles,
      descripcion: "Roles registrados en el sistema",
      icono: "♙",
      ruta: "/roles",
      color: "text-blue-400",
    },
    {
      titulo: "Categorías",
      cantidad: estadisticas.categorias,
      descripcion: "Categorías de eventos",
      icono: "◇",
      ruta: "/categorias",
      color: "text-cyan-400",
    },
    {
      titulo: "Sedes",
      cantidad: estadisticas.sedes,
      descripcion: "Lugares disponibles",
      icono: "▦",
      ruta: "/sedes",
      color: "text-indigo-400",
    },
    {
      titulo: "Espacios",
      cantidad: estadisticas.espacios,
      descripcion: "Espacios registrados",
      icono: "⌖",
      ruta: "/espacios",
      color: "text-sky-400",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#0b1220] text-white md:flex-row">
      <Sidebar activo="Inicio" />

      <main className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">
        <header className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-400">
              EVENTPASS / PANEL PRINCIPAL
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Panel de control
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Administra y consulta la información de tus eventos.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#111c31] px-4 py-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                conectado ? "bg-emerald-400" : "bg-red-400"
              }`}
            />

            <span className="text-sm font-medium text-slate-200">
              {cargando
                ? "Conectando..."
                : conectado
                  ? "Backend conectado"
                  : "Sin conexión"}
            </span>
          </div>
        </header>

        <section className="mb-9 overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-r from-[#122c55] via-[#10213d] to-[#111c31] p-6 shadow-xl md:p-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Bienvenido a EventPass
          </p>

          <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white md:text-3xl">
            Gestiona tus eventos desde un solo lugar.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Consulta los registros, administra las sedes y organiza los
            espacios de tu plataforma.
          </p>

          <Link
            href="/categorias"
            className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500"
          >
            Explorar módulos <span className="ml-2">→</span>
          </Link>
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">
                Resumen general
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Estado actual de los registros de EventPass.
              </p>
            </div>

            <span className="text-xs font-medium text-slate-500">
              {cargando ? "Actualizando datos..." : "Datos del backend"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {tarjetas.map((tarjeta) => (
              <Link
                href={tarjeta.ruta}
                key={tarjeta.titulo}
                className="block rounded-xl transition hover:-translate-y-1"
              >
                <StatCard
                  titulo={tarjeta.titulo}
                  cantidad={cargando ? "..." : tarjeta.cantidad}
                  descripcion={tarjeta.descripcion}
                  icono={tarjeta.icono}
                />
              </Link>
            ))}
          </div>
        </section>

        {error && (
          <div className="mt-7 rounded-xl border border-red-500/30 bg-red-950/30 p-4">
            <p className="font-semibold text-red-300">
              No se pudieron cargar las estadísticas
            </p>
            <p className="mt-1 text-sm text-red-200">{error}</p>
          </div>
        )}

        <section className="mt-9">
          <h2 className="mb-4 text-xl font-bold text-white">
            Accesos rápidos
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tarjetas.map((tarjeta) => (
              <Link
                key={tarjeta.titulo}
                href={tarjeta.ruta}
                className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-[#111c31] p-5 transition hover:border-blue-400/50 hover:bg-[#172641]"
              >
                <div className="flex items-center gap-4">
                  <span className={`text-2xl ${tarjeta.color}`}>
                    {tarjeta.icono}
                  </span>

                  <div>
                    <p className="font-semibold text-white">
                      Administrar {tarjeta.titulo.toLowerCase()}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Consultar y gestionar registros
                    </p>
                  </div>
                </div>

                <span className="text-xl text-blue-400">→</span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center text-xs text-slate-500">
          EventPass · Sistema de gestión de eventos
        </footer>
      </main>
    </div>
  );
}
