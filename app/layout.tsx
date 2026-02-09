import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { Toaster } from "sonner"; // Notificações usadas no projeto
import "./globals.css";

// 1. Configuração de Fontes (Next.js Fonts evita Layout Shift)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

// 2. SEO Global (Metadata API)
export const metadata: Metadata = {

  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://decmobly.com.br"),
  
  title: {
    default: "Decmobly | Móveis Planejados em Manaus",
    template: "%s | Decmobly", // As páginas internas usarão: "Nome da Página | Decmobly"
  },
  description: "Transformamos ambientes com móveis sob medida, unindo design sofisticado, ergonomia e materiais de alta performance. Solicite seu projeto exclusivo.",
  
  keywords: ["móveis planejados em Manaus", "marcenaria em Manaus", "cozinha planejada", "quarto planejado", "móveis planejados", "banheiro planejado", "decmobly"],
  
  authors: [{ name: "Decmobly Team" }],
  creator: "Decmobly",
  
  // Configuração para bots (Google, Bing, etc)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "Decmobly | Móveis Planejados",
    description: "Design inteligente e sofisticação para seu lar. Agende uma visita técnica. Atendemos Manaus e região.",
    siteName: "Decmobly",
    images: [
      {
        url: "/og-image.jpg", // Crie uma imagem de 1200x630px na pasta public
        width: 1200,
        height: 630,
        alt: "Ambiente planejado Decmobly",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Decmobly | Móveis Planejados",
    description: "Design inteligente e sofisticação para seu lar.",
    images: ["/og-image.jpg"],
  },

  // Ícones (Favicon)
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

// 3. Viewport e Tema (Separado do Metadata no Next.js 14+)
export const viewport: Viewport = {
  themeColor: "#fdfbf7", // Cor da barra de endereço no mobile (Creme da marca)
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Acessibilidade: permite zoom
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org para Negócio Local (JSON-LD)
  // Ajuda o Google a entender que é uma loja física/serviço
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "name": "Decmobly Móveis Planejados",
    "image": "https://decmobly.com/og-image.jpg",
    "description": "Especialistas em móveis sob medida em Manaus.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Cravina dos Poetas, 413 - Alvorada",
      "addressLocality": "Manaus",
      "addressRegion": "AM",
      "postalCode": "69045-000",
      "addressCountry": "BR"
    },
    "telephone": "+5597984208329",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:30",
        "closes": "18:00"
      }
    ],
    "url": "https://decmobly.com.br"
  };

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${playfair.variable} ${lato.variable} font-sans antialiased bg-[#fdfbf7] text-[#5c4d3c] overflow-x-hidden`}>
        {/* Injeta o Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {children}
        
        {/* Componente de Toast Global (Sonner) */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}