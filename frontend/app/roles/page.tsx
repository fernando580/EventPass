
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Sidebar from "../../components/Sidebar";
import { apiFetch } from "../../lib/api";

interface Rol {
  id: number;
  nombre: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarRoles = useCallback(async () => {
    try {
      setError("");
      const datos = await apiFetch("/api/roles");
      setRoles(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los roles");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarRoles();
  }, [cargarRoles]);

  async function guardarRol(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nombre.trim()) {
      setError("Escribe el nombre del rol.");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      if (editando !== null) {
        await apiFetch(`/api/roles/${editando}`, {
          method: "PUT",
          body: JSON.stringify({ nombre: nombre.trim() }),
        });

        setMensaje("¡El rol se actualizó correctamente!");
      } else {
        await apiFetch("/api/roles", {
          method: "POST",
          body: JSON.stringify({ nombre: nombre.trim() }),
        });

        setMensaje("¡El rol se registró correctamente!");
      }

      setNombre("");
      setEditando(null);
      await cargarRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el rol");
    } finally {
      setGuardando(false);
    }
  }

  function prepararEdicion(rol: Rol) {
    setEditando(rol.id);
    setNombre(rol.nombre);
    setError("");
    setMensaje("");
  }

  function cancelarEdicion() {
    setEditando(null);
    setNombre("");
    setError("");
    setMensaje("");
  }

  async function eliminarRol(rol: Rol) {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el rol "${rol.nombre}"?`
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await apiFetch(`/api/roles/${rol.id}`, {
        method: "DELETE",
      });

      setMensaje("El rol se eliminó correctamente.");
      await cargarRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el rol");
    }
  }

  return (
    <main className="min-h-screen bg-[#0b1220] text-white md:flex">
      <Sidebar activo="Roles" />

      <section className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">
        <header className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[3px] text-blue-400">
              EVENTPASS / ADMINISTRACIÓN
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Gestión de roles
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Organiza y administra los perfiles de tu plataforma.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <div>
              <p className="text-xs text-slate-400">Estado del módulo</p>
              <p className="text-sm font-semibold text-emerald-400">Administración activa</p>
            </div>
          </div>
        </header>

        <div className="mb-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-blue-400/20 bg-gradient-to-br from-[#174a9a] to-[#10213d] p-6 shadow-xl shadow-blue-950/30">
            <p className="text-sm font-medium text-blue-100">
              Total de roles
            </p>
            <p className="mt-3 text-4xl font-bold text-white">
              {cargando ? "..." : roles.length}
            </p>
            <p className="mt-2 text-sm text-blue-200">
              Registros disponibles en el sistema
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-[#111c31] p-6 shadow-lg">
            <p className="text-sm text-slate-400">Módulo actual</p>
            <p className="mt-3 text-2xl font-bold text-cyan-300">
              Roles
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Administración de perfiles de EventPass
            </p>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-slate-700/70 bg-[#111c31] p-6 shadow-xl md:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold tracking-[2px] text-cyan-400">
              {editando !== null ? "EDITAR REGISTRO" : "NUEVO REGISTRO"}
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              {editando !== null ? "Modificar rol" : "Registrar un rol"}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {editando !== null
                ? "Modifica el nombre del rol seleccionado."
                : "Ingresa el nombre para agregar un nuevo rol al sistema."}
            </p>
          </div>

          <form onSubmit={guardarRol} className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ejemplo: Supervisor"
              maxLength={50}
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
                  : "+ Registrar rol"}
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
                Roles registrados
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Listado actualizado desde la base de datos.
              </p>
            </div>

            <button
              onClick={cargarRoles}
              className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
            >
              ↻ Actualizar
            </button>
          </div>

          {cargando ? (
            <p className="p-8 text-center text-slate-400">
              Cargando roles...
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0b172b] text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Nombre del rol</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-700/60">
                  {roles.map((rol) => (
                    <tr
                      key={rol.id}
                      className="transition hover:bg-blue-500/5"
                    >
                      <td className="px-6 py-5 text-sm text-slate-400">
                        #{rol.id}
                      </td>

                      <td className="px-6 py-5 font-semibold text-white">
                        {rol.nombre}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                          Activo
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => prepararEdicion(rol)}
                            className="rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
                          >
                            ✎ Editar
                          </button>

                          <button
                            onClick={() => eliminarRol(rol)}
                            className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {roles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400">
                        Todavía no hay roles registrados.
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
