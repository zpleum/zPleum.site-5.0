import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import localFontLoader from "next/font/local";
import "./globals.css";

import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import ClientThemeWrapper from "@/components/ClientThemeWrapper";
import TrafficTracker from "@/components/TrafficTracker";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const sovRangBab = localFontLoader({
  src: "../fonts/SOV_RangBab.ttf",
  variable: "--font-sov-rangbab",
});

const sovKhongKhanad = localFontLoader({
  src: "../fonts/SOV_KhongKhanad.ttf",
  variable: "--font-sov-khongkhanad",
});

import { query } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  try {
    interface SeoSettings {
      site_title: string;
      site_description: string;
      keywords: string;
      og_image: string | null;
    }

    const seoSettings = await query<SeoSettings[]>(
      'SELECT site_title, site_description, keywords, og_image FROM seo_settings WHERE id = 1'
    );

    if (seoSettings && seoSettings.length > 0) {
      const { site_title, site_description, keywords, og_image } = seoSettings[0];
      return {
        title: {
          default: site_title,
          template: `%s | ${site_title}`
        },
        description: site_description,
        keywords: keywords,
        openGraph: {
          title: site_title,
          description: site_description,
          images: og_image ? [og_image] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title: site_title,
          description: site_description,
          images: og_image ? [og_image] : [],
        }
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: "zPleum - Full Stack Developer",
    description: "Portfolio of Wiraphat Makwong, aka Pleum, Full Stack Developer",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${spaceGrotesk.variable} ${sovRangBab.variable} ${sovKhongKhanad.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased selection:bg-[var(--primary)] selection:text-white">
        <ClientThemeWrapper>
          <SmoothScroll>
            <div className="flex flex-col min-h-screen">
              <TrafficTracker />
              <Header />
              <main className="flex-grow">
                {children}
              </main>
            </div>
          </SmoothScroll>
        </ClientThemeWrapper>
      </body>
    </html>
  );
}
