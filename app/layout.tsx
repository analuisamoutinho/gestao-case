import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case — Onboarding OS",
  description: "Sistema Operacional de Onboarding da Case Aceleradora",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Header */}
        <header style={{ borderBottom: "1px solid #D9B794", background: "#F4E6D4" }} className="px-8 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              {/* Rosa dos ventos símbolo */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="#B8864B" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="3" fill="#B8864B" />
                <polygon points="16,2 18,14 16,12 14,14" fill="#B8864B" />
                <polygon points="16,30 18,18 16,20 14,18" fill="#4A2E1F" />
                <polygon points="2,16 14,18 12,16 14,14" fill="#B8864B" />
                <polygon points="30,16 18,18 20,16 18,14" fill="#4A2E1F" />
              </svg>
              <div>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#1E120D', letterSpacing: '0.08em' }}>
                  CASE
                </span>
                <span style={{ fontSize: '0.65rem', color: '#B8864B', letterSpacing: '0.15em', display: 'block', fontWeight: 500 }}>
                  ACELERADORA
                </span>
              </div>
            </Link>
            <span style={{ fontSize: '0.75rem', color: '#8B7060', letterSpacing: '0.12em', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              ONBOARDING OS
            </span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10">
          {children}
        </main>

        <footer style={{ borderTop: "1px solid #D9B794", marginTop: "4rem" }} className="py-6 text-center">
          <span style={{ fontSize: '0.7rem', color: '#A89070', letterSpacing: '0.15em', fontFamily: 'Montserrat, sans-serif' }}>
            CASE ACELERADORA © 2025
          </span>
        </footer>
      </body>
    </html>
  );
}
