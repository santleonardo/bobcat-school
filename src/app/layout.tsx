import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bobcat Language School",
  description: "Plataforma interativa de aprendizado de inglês da Bobcat Language School.",
  keywords: ["Bobcat", "English", "Language School", "Learn English", "Lição", "Aprender Inglês"],
  authors: [{ name: "Bobcat Language School" }],
  icons: {
    icon: "/bobcat-logo.png",
  },
  openGraph: {
    title: "Bobcat Language School",
    description: "Plataforma interativa de aprendizado de inglês",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bobcat Language School",
    description: "Plataforma interativa de aprendizado de inglês",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
