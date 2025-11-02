import "./globals.css";

export const metadata = {
  title: "One Piece Checklist",
  description: "Checklist de volumes 1–111 do mangá One Piece",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
