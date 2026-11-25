
"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { apiFetch } from "../../lib/api";

interface Sede {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  capacidad_total: number;
}

export default function SedesPage() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [editando, setEditando] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const limpiarFormulario = () => {
    setNombre("");
    setDireccion("");
    setCiudad("");
    setCapacidad("");
    setEditando(null);
  };

  const cargarSedes = useCallback(async () => {
    try {
      setError("");
      const datos = await apiFetch("/api/sedes");
      setSedes(datos);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las sedes."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarSedes();
  }, [cargarSedes]);

  async function guardarSede(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !nombre.trim() ||
      !direccion.trim() ||
      !ciudad.trim() ||
      !capacidad
    ) {
      setError("Completa todos los campos.");
      return;
    }

    if (
      !Number.isInteger(Number(capacidad)) ||
      Number(capacidad) <= 0
    ) {
      setError("La capacidad debe ser un número entero mayor que cero.");
      return;
    }

    const datos = {
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      ciudad: ciudad.trim(),
      capacidad_total: Number(capacidad),
    };

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      if (editando !== null) {
        await apiFetch(`/api/sedes/${editando}`, {
          method: "PUT",
          body: JSON.stringify(datos),
        });

        setMensaje("¡Sede actualizada correctamente!");
      } else {
        await apiFetch("/api/sedes", {
          method: "POST",
          body: JSON.stringify(datos),
        });

        setMensaje("¡Sede registrada correctamente!");
      }

      limpiarFormulario();
      await cargarSedes();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la sede."
      );
    } finally {
      setGuardando(false);
    }
  }

  function prepararEdicion(sede: Sede) {
    setNombre(sede.nombre);
    setDireccion(sede.direccion);
    setCiudad(sede.ciudad);
    setCapacidad(String(sede.capacidad_total));
    setEditando(sede.id);
    setMensaje("");
    setError("");
  }

  function cancelarEdicion() {
    limpiarFormulario();
    setError("");
    setMensaje("");
  }

  async function eliminarSede(id: string) {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar esta sede? También podrían eliminarse sus espacios asociados."
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await apiFetch(`/api/sedes/${id}`, {
        method: "DELETE",
      });

      setMensaje("Sede eliminada correctamente.");

      if (editando === id) {
        limpiarFormulario();
      }

      await cargarSedes();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar la sede."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#0b1220] text-white md:flex">
      <Sidebar activo="Sedes" />

      <section className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">
        <header className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[3px] text-blue-400">
              EVENTPASS / ADMINISTRACIÓN
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Gestión de sedes
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Administra los lugares donde se realizarán los eventos.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <div>
              <p className="text-xs text-slate-400">Estado del módulo</p>
              <p className="text-sm font-semibold text-emerald-400">
                Administración activa
              </p>
            </div>
          </div>
        </header>

        <div className="mb-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-blue-400/20 bg-gradient-to-br from-[#174a9a] to-[#10213d] p-6 shadow-xl shadow-blue-950/30">
            <p className="text-sm font-medium text-blue-100">
              Total de sedes
            </p>

            <p className="mt-3 text-4xl font-bold text-white">
              {cargando ? "..." : sedes.length}
            </p>

            <p className="mt-2 text-sm text-blue-200">
              Lugares registrados en el sistema
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-[#111c31] p-6 shadow-lg">
            <p className="text-sm text-slate-400">Módulo actual</p>

            <p className="mt-3 text-2xl font-bold text-cyan-300">
              Sedes
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Administración de espacios físicos para eventos
            </p>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-slate-700/70 bg-[#111c31] p-6 shadow-xl md:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold tracking-[2px] text-cyan-400">
              {editando !== null ? "EDITAR REGISTRO" : "NUEVO REGISTRO"}
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              {editando !== null ? "Modificar sede" : "Registrar una sede"}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Completa la información del lugar donde se realizarán los eventos.
            </p>
          </div>

          <form onSubmit={guardarSede} className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Nombre de la sede
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ejemplo: Arena Cañaveralejo"
                maxLength={150}
                className="w-full rounded-xl border border-slate-600 bg-[#0b1628] px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Dirección
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ejemplo: Calle 5 # 38-00"
                maxLength={200}
                className="w-full rounded-xl border border-slate-600 bg-[#0b1628] px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Ciudad
              </label>
              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Ejemplo: Cali"
                maxLength={100}
                className="w-full rounded-xl border border-slate-600 bg-[#0b1628] px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Capacidad total
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                placeholder="Ejemplo: 15000"
                className="w-full rounded-xl border border-slate-600 bg-[#0b1628] px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={guardando}
                className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {guardando
                  ? "Guardando..."
                  : editando !== null
                    ? "Guardar cambios"
                    : "+ Registrar sede"}
              </button>

              {editando !== null && (
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="rounded-xl border border-slate-600 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-700"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {mensaje && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300">
            ✓ {mensaje}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-700/70 bg-[#111c31] shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/70 p-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                Sedes registradas
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Listado actualizado desde la base de datos.
              </p>
            </div>

            <button
              type="button"
              onClick={cargarSedes}
              className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
            >
              ↻ Actualizar
            </button>
          </div>

          {cargando ? (
            <p className="p-8 text-center text-slate-400">
              Cargando sedes...
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0b172b] text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Dirección</th>
                    <th className="px-6 py-4">Ciudad</th>
                    <th className="px-6 py-4">Capacidad</th>
                    <th className="px-6 py-4">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-700/60">
                  {sedes.map((sede) => (
                    <tr
                      key={sede.id}
                      className="transition hover:bg-blue-500/5"
                    >
                      <td className="px-6 py-5 font-semibold text-white">
                        {sede.nombre}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-300">
                        {sede.direccion}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-300">
                        {sede.ciudad}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-cyan-300">
                        {Number(sede.capacidad_total).toLocaleString("es-CO")}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => prepararEdicion(sede)}
                            className="rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => eliminarSede(sede.id)}
                            className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {sedes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No hay sedes registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-8 text-center text-xs text-slate-500">
          EventPass · Sistema de gestión de eventos
        </p>
      </section>
    </main>
  );
}

