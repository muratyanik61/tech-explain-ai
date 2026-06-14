import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Explain AI — IT kavramlarını sade Türkçe öğren",
  description:
    "IT ve bilgisayar bilimi kavramlarını seviyene göre, gerçek hayattan benzetmelerle ve mini quizlerle anlatan; öğrendiklerini tarayıcıda kaydedip tek tıkla yeniden açabildiğin AI destekli öğrenme uygulaması.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
