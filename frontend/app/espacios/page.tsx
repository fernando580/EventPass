
"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { apiFetch } from "../../lib/api";

interface Sede {
  id: string;
  nombre: string;
}

interface Espacio {
  id: string;
  sede_id: string;
  nombre: string;
  capacidad: number;
}

export default function EspaciosPage() {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [nombre, setNombre] = useState("");
  const [sedeId, setSedeId] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [editando, setEditando] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const limpiarFormulario = () => {
    setNombre("");
    setSedeId("");
    setCapacidad("");
    setEditando(null);
  };

  const cargarDatos = useCallback(async () => {
    try {
      setError("");

      const [datosEspacios, datosSedes] = await Promise.all([
        apiFetch("/api/espacios"),
        apiFetch("/api/sedes"),
      ]);

      setEspacios(datosEspacios);
      setSedes(datosSedes);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar los datos."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  async function guardarEspacio(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nombre.trim() || !sedeId || !capacidad) {
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
      sede_id: sedeId,
      nombre: nombre.trim(),
      capacidad: Number(capacidad),
    };

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      if (editando !== null) {
        await apiFetch(`/api/espacios/${editando}`, {
          method: "PUT",
          body: JSON.stringify(datos),
        });

        setMensaje("Espacio actualizado correctamente.");
      } else {
        await apiFetch("/api/espacios", {
          method: "POST",
          body: JSON.stringify(datos),
        });

        setMensaje("Espacio registrado correctamente.");
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar el espacio."
      );
    } finally {
      setGuardando(false);
    }
  }

  function prepararEdicion(espacio: Espacio) {
    setNombre(espacio.nombre);
    setSedeId(espacio.sede_id);
    setCapacidad(String(espacio.capacidad));
    setEditando(espacio.id);
    setMensaje("");
    setError("");
  }

  async function eliminarEspacio(id: string) {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este espacio?"
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await apiFetch(`/api/espacios/${id}`, {
        method: "DELETE",
      });

      setMensaje("Espacio eliminado correctamente.");

      if (editando === id) {
        limpiarFormulario();
      }

      await cargarDatos();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar el espacio."
      );
    }
  }

  function obtenerNombreSede(id: string) {
    return (
      sedes.find((sede) => sede.id === id)?.nombre ||
      "Sede no encontrada"
    );
  }

  return (
    <main className="min-h-screen bg-[#0b1220] text-slate-100 md:flex">
      <Sidebar activo="Espacios" />

      <section className="min-w-0 flex-1 p-5 md:p-10">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Administración
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Gestión de espacios
          </h2>

          <p className="mt-2 text-slate-400">
            Administra los espacios disponibles dentro de cada sede.
          </p>
        </header>

        <section className="mb-7 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700/70 bg-[#111c31] p-6 shadow-lg">
            <p className="text-sm text-slate-400">
              Total de espacios
            </p>

            <p className="mt-2 text-4xl font-bold text-white">
              {cargando ? "..." : espacios.length}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Espacios registrados en el sistema
            </p>
          </div>

          <div className="rounded-2xl border border-blue-400/20 bg-gradient-to-r from-blue-950 to-[#172d50] p-6 shadow-lg">
            <p className="text-sm text-blue-200">
              Estado del sistema
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              Gestión activa
            </p>

            <p className="mt-2 text-sm text-blue-200">
              Administración conectada con la API
            </p>
          </div>
        </section>

        <section className="mb-7 rounded-2xl border border-slate-700/70 bg-[#111c31] p-6 shadow-lg">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">
              {editando !== null
                ? "Editar espacio"
                : "Registrar espacio"}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Completa los datos y selecciona la sede correspondiente.
            </p>
          </div>

          <form
            onSubmit={guardarEspacio}
            className="grid gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Nombre del espacio
              </label>

              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Escenario Principal"
                maxLength={100}
                className="w-full rounded-xl border border-slate-600 bg-[#17243a] px-4 py-3 text-white outline-none transition focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Sede
              </label>

              <select
                value={sedeId}
                onChange={(e) => setSedeId(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-[#17243a] px-4 py-3 text-white outline-none transition focus:border-blue-400"
              >
                <option value="">Selecciona una sede</option>

                {sedes.map((sede) => (
                  <option key={sede.id} value={sede.id}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Capacidad del espacio
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                placeholder="Ej. 10000"
                className="w-full rounded-xl border border-slate-600 bg-[#17243a] px-4 py-3 text-white outline-none transition focus:border-blue-400"
              />
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <button
                type="submit"
                disabled={guardando || sedes.length === 0}
                className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {guardando
                  ? "Guardando..."
                  : editando !== null
                    ? "Actualizar espacio"
                    : "Registrar espacio"}
              </button>

              {editando !== null && (
                <button
                  type="button"
                  onClick={() => {
                    limpiarFormulario();
                    setError("");
                    setMensaje("");
                  }}
                  className="rounded-xl border border-slate-600 bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-600"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {sedes.length === 0 && !cargando && (
            <p className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-300">
              Primero debes registrar una sede para poder crear espacios.
            </p>
          )}

          {mensaje && (
            <p className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {mensaje}
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-700/70 bg-[#111c31] shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 p-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                Espacios registrados
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Listado de espacios organizados por sede.
              </p>
            </div>

            <button
              type="button"
              onClick={cargarDatos}
              className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
            >
              Actualizar lista
            </button>
          </div>

          {cargando ? (
            <p className="p-8 text-center text-slate-400">
              Cargando espacios...
            </p>
          ) : espacios.length === 0 ? (
            <p className="p-8 text-center text-slate-400">
              No hay espacios registrados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#17243a] text-sm text-slate-300">
                  <tr>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Sede</th>
                    <th className="px-6 py-4">Capacidad</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-700/70">
                  {espacios.map((espacio) => (
                    <tr
                      key={espacio.id}
                      className="transition hover:bg-[#192b46]"
                    >
                      <td className="px-6 py-4 font-semibold text-white">
                        {espacio.nombre}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {obtenerNombreSede(espacio.sede_id)}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {Number(espacio.capacidad).toLocaleString("es-CO")}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => prepararEdicion(espacio)}
                            className="rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => eliminarEspacio(espacio.id)}
                            className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-slate-500">
          EventPass · Sistema de gestión de eventos
        </p>
      </section>
    </main>
  );
}
