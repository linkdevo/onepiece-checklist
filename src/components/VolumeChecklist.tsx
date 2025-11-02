"use client";
import { useEffect, useMemo, useState } from "react";
import useLocalStorage from "../lib/useLocalStorage";

const TOTAL = 111;
const VOLUMES = Array.from({ length: TOTAL }, (_, i) => i + 1);
const LS_KEY = "op_volumes_v1";

export default function VolumeChecklist() {
  const [owned, setOwned] = useLocalStorage<number[]>(LS_KEY, []);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return VOLUMES;
    return VOLUMES.filter((n) => String(n).includes(q));
  }, [query]);

  const totalOwned = owned.length;
  const missing = useMemo(
    () => VOLUMES.filter((n) => !owned.includes(n)),
    [owned]
  );

  function toggle(n: number) {
    setOwned((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  }

  function markAll() {
    setOwned(VOLUMES);
  }

  function unmarkAll() {
    setOwned([]);
  }

  function invertSelection() {
    setOwned((prev) => VOLUMES.filter((n) => !prev.includes(n)));
  }

  async function copyMissing() {
    const text = missing.join(", ");
    await navigator.clipboard.writeText(text);
    alert("Lista de volumes faltantes copiada!");
  }

  function exportJSON() {
    const data = { owned };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "onepiece-checklist-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.owned)) {
          const onlyValid = parsed.owned
            .map((n: unknown) => Number(n))
            .filter((n: number) => Number.isInteger(n) && n >= 1 && n <= TOTAL);
          setOwned(Array.from(new Set(onlyValid)).sort((a, b) => a - b));
          alert("Backup importado com sucesso!");
        } else {
          alert("Arquivo inválido: propriedade 'owned' ausente.");
        }
      } catch {
        alert("Não foi possível ler o JSON.");
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  useEffect(() => {
    // garantir ordenação na primeira carga
    setOwned((prev) => [...prev].sort((a, b) => a - b));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="space-y-6">
      {/* Painel Superior */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 shadow">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-400">Coleção</p>
              <p className="text-2xl font-bold">
                {totalOwned}/{TOTAL}{" "}
                <span className="text-sm font-medium text-zinc-400">
                  ({Math.round((totalOwned / TOTAL) * 100)}%)
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={markAll}
                className="rounded-xl px-3 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 transition"
              >
                Marcar tudo
              </button>
              <button
                onClick={unmarkAll}
                className="rounded-xl px-3 py-2 text-sm font-semibold bg-zinc-700 hover:bg-zinc-600 transition"
              >
                Limpar
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={invertSelection}
              className="rounded-lg px-3 py-1.5 text-xs font-medium border border-zinc-700 hover:bg-zinc-800 transition"
            >
              Inverter seleção
            </button>
            <button
              onClick={copyMissing}
              className="rounded-lg px-3 py-1.5 text-xs font-medium border border-zinc-700 hover:bg-zinc-800 transition"
            >
              Copiar faltantes
            </button>
            <button
              onClick={exportJSON}
              className="rounded-lg px-3 py-1.5 text-xs font-medium border border-zinc-700 hover:bg-zinc-800 transition"
            >
              Exportar JSON
            </button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium border border-zinc-700 hover:bg-zinc-800 transition">
              Importar JSON
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={importJSON}
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 shadow">
          <label htmlFor="q" className="text-sm text-zinc-400">
            Buscar volume
          </label>
          <input
            id="q"
            inputMode="numeric"
            pattern="[0-9]*"
            value={query}
            onChange={(e) => setQuery(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="Ex.: 10, 99, 111"
            className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 outline-none ring-1 ring-zinc-700 focus:ring-2 focus:ring-emerald-500"
          />
          <p className="mt-2 text-xs text-zinc-500">
            Dica: digite "10" para ver 10, 100, 101...
          </p>
        </div>
      </div>

      {/* Lista de Volumes */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {filtered.map((n) => {
          const checked = owned.includes(n);
          return (
            <li key={n} className="group">
              <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-2 pr-3 hover:border-zinc-700 transition">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(n)}
                  className="h-4 w-4 accent-emerald-600"
                  aria-label={`Volume ${n}`}
                />
                <span className="select-none font-semibold tracking-wide">
                  Vol. {String(n).padStart(3, "0")}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {/* Resumo */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 shadow text-sm text-zinc-300">
        <p>
          Faltantes ({missing.length}): {missing.join(", ") || "nenhum 🎉"}
        </p>
      </div>
    </section>
  );
}
