
"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { apiFetch } from "../../lib/api";

interface Categoria {
  id: number;
  nombre: string;
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarCategorias = useCallback(async () => {
    try {
      setError("");
      const datos = await apiFetch("/api/categorias");
      setCategorias(datos);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las categorías."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  async function guardarCategoria(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nombre.trim()) {
      setError("Escribe el nombre de la categoría.");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      if (editando !== null) {
        await apiFetch(`/api/categorias/${editando}`, {
          method: "PUT",
          body: JSON.stringify({ nombre: nombre.trim() }),
        });

        setMensaje("¡Categoría actualizada correctamente!");
      } else {
        await apiFetch("/api/categorias", {
          method: "POST",
          body: JSON.stringify({ nombre: nombre.trim() }),
        });

        setMensaje("¡Categoría registrada correctamente!");
      }

      setNombre("");
      setEditando(null);
      await cargarCategorias();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la categoría."
      );
    } finally {
      setGuardando(false);
    }
  }

  function prepararEdicion(categoria: Categoria) {
    setNombre(categoria.nombre);
    setEditando(categoria.id);
    setMensaje("");
    setError("");
  }

  function cancelarEdicion() {
    setNombre("");
    setEditando(null);
    setError("");
    setMensaje("");
  }

  async function eliminarCategoria(id: number) {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar esta categoría?"
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await apiFetch(`/api/categorias/${id}`, {
        method: "DELETE",
      });

      setMensaje("Categoría eliminada correctamente.");

      if (editando === id) {
        cancelarEdicion();
      }

      await cargarCategorias();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar la categoría."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#0b1220] text-white md:flex">
      <Sidebar activo="Categorías" />

      <section className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">
        <header className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[3px] text-blue-400">
              EVENTPASS / ADMINISTRACIÓN
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Gestión de categorías
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Organiza y administra los tipos de eventos de la plataforma.
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
              Total de categorías
            </p>

            <p className="mt-3 text-4xl font-bold text-white">
              {cargando ? "..." : categorias.length}
            </p>

            <p className="mt-2 text-sm text-blue-200">
              Registros disponibles en el sistema
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-[#111c31] p-6 shadow-lg">
            <p className="text-sm text-slate-400">Módulo actual</p>

            <p className="mt-3 text-2xl font-bold text-cyan-300">
              Categorías
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Clasificación de eventos de EventPass
            </p>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-slate-700/70 bg-[#111c31] p-6 shadow-xl md:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold tracking-[2px] text-cyan-400">
              {editando !== null ? "EDITAR REGISTRO" : "NUEVO REGISTRO"}
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              {editando !== null
                ? "Modificar categoría"
                : "Registrar una categoría"}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {editando !== null
                ? "Modifica el nombre de la categoría seleccionada."
                : "Ingresa un nombre para agregar una nueva categoría."}
            </p>
          </div>

          <form
            onSubmit={guardarCategoria}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ejemplo: Concierto, Teatro, Deporte..."
              maxLength={100}
              className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-[#0b1628] px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />

            <button
              type="submit"
              disabled={guardando}
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando
                ? "Guardando..."
                : editando !== null
                  ? "Guardar cambios"
                  : "+ Registrar categoría"}
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
                Categorías registradas
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Listado actualizado desde la base de datos.
              </p>
            </div>

            <button
              type="button"
              onClick={cargarCategorias}
              className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
            >
              ↻ Actualizar
            </button>
          </div>

          {cargando ? (
            <p className="p-8 text-center text-slate-400">
              Cargando categorías...
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0b172b] text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-700/60">
                  {categorias.map((categoria) => (
                    <tr
                      key={categoria.id}
                      className="transition hover:bg-blue-500/5"
                    >
                      <td className="px-6 py-5 text-sm text-slate-400">
                        #{categoria.id}
                      </td>

                      <td className="px-6 py-5 font-semibold text-white">
                        {categoria.nombre}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                          Activa
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => prepararEdicion(categoria)}
                            className="rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => eliminarCategoria(categoria.id)}
                            className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {categorias.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-slate-400"
                      >
                        No hay categorías registradas.
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
