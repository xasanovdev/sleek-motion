import type { ReactNode } from "react";

export function RootDocument({
  children,
  lang,
}: {
  children: ReactNode;
  lang: "en" | "uz";
}) {
  return (
    <html lang={lang} className="h-full antialiased">
      <body className="min-h-full"><div className="app-root">{children}</div></body>
    </html>
  );
}
