import "./globals.css";
import Image from "next/image";
import ComplianceAssistant from "./components/ComplianceAssistant";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-slate-50">
        <header className="fixed top-0 left-0 w-full bg-white z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center">
            <div className="flex items-center">
              <Image
                src="/Flatten_Regnova_logo_on_LightBG.png"
                alt="Regnova Logo"
                width={100}
                height={30}
                className="h-8 w-auto"
              />
            </div>
          </div>
        </header>
        <div className="pt-14 flex h-screen overflow-hidden">
          <aside className="w-[320px] h-full bg-white border-r border-slate-200 p-6 overflow-y-auto">
            <ComplianceAssistant />
          </aside>
          <main className="flex-1 relative overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
