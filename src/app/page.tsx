import VolumeChecklist from "@/components/VolumeChecklist";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 md:p-10">
      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          One Piece — Checklist
        </h1>
        <p className="mt-2 text-zinc-400">
          Marque os volumes que você já tem. Os dados ficam salvos no seu
          navegador.
        </p>
      </header>
      <VolumeChecklist />
      <footer className="mt-10 text-center text-xs text-zinc-500">
        <p>Feito com Next.js + Tailwind. Backup disponível por JSON.</p>
      </footer>
    </main>
  );
}
