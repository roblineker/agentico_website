import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agentico - AI-Powered Business Automation",
  description: "Transform your business with intelligent automation. Custom AI solutions for trades and professional services.",
  keywords: ["AI automation", "business automation", "trades", "professional services", "AI tools", "small business"],
  authors: [{ name: "Agentico" }],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Agentico - AI-Powered Business Automation",
    description: "Transform your business with intelligent automation. Custom AI solutions for trades and professional services.",
    url: "https://agentico.com.au",
    siteName: "Agentico",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentico - AI-Powered Business Automation",
    description: "Transform your business with intelligent automation. Custom AI solutions for trades and professional services.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
