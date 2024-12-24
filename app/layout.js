import { Inter } from "next/font/google";
import PlausibleProvider from "next-plausible";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import Navbar from "@/components/Navbar";
import config from "@/config";
import "./globals.css";
// import { NavbarProvider } from "@/context/NavbarContext"; // Import NavbarProvider

const font = Inter({ subsets: ["latin"] });

export const viewport = {
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

export const metadata = getSEOTags();

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme={config.colors.theme} className={font.className}>
      <head>
        {config.domainName && (
          <PlausibleProvider domain={config.domainName} />
        )}
        <script
          defer
          data-domain={config.domainName}
          data-api="/plausible/api/event"
          src="/plausible/js/script.js"
        ></script>
      </head>
      <body>
          <ClientLayout>
            {children}
          </ClientLayout>
      </body>
    </html>
  );
}
