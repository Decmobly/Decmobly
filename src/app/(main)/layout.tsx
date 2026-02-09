import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Script from 'next/script'; // Importe o componente Script

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <meta name="google-site-verification" content="6N2GoYbAE12FrUHmCXBDOLqQxoIdzUpiK67ElguwNpo" />
      {/* Google Analytics Scripts */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-KS72PN24N2"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-KS72PN24N2');
        `}
      </Script>

      <Header />
      
      <main className="grow">
        {/* Dica: Meta tags de verificação costumam ficar no <head>, 
            mas no Next.js o ideal é usar o objeto 'metadata' */}
        {children}
      </main>

      <Footer />
    </div>
  );
}