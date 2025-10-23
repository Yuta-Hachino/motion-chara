import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live2D Lip Sync App",
  description: "Live2D model with TTS and lip sync animation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
