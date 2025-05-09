import "./globals.css";
import Image from "next/image";
import ComplianceAssistant from "./components/ComplianceAssistant";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="fixed top-0 left-0 w-full bg-[#ffffff] z-10 ">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Image
                src="/Flatten_Regnova_logo_on_LightBG.png"
                alt="Regnova Logo"
                width={100}
                height={100}
                className="h-8 w-auto"
              />
            </div>
          </div>
        </header>
        <div className="pt-10 flex flex-row h-screen bg-gray-100">
          <div className="sticky top-20 left-0 h-[calc(100vh-5rem)] z-10 flex items-start">
            <ComplianceAssistant />
          </div>
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
