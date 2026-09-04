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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
