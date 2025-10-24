import type { Metadata } from "next";
import Script from "next/script";
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
        <Script
          src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/live2dcubismcore.min.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
