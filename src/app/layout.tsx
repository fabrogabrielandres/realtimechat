import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/queryprovider/Providers";

const jetBrains_Mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: 'Real-Time Chat App',
  description: 'Chat application with ElysiaJS and Next.js',
  openGraph: {
    title: 'Real-Time Chat with ElysiaJS',
    description: 'Exploring real-time architectures with WebSockets, Redis, and Bun',
    url: 'https://realtimechatp2p.vercel.app',
    images: [
      {
        url: 'https://realtimechatp2p.vercel.app/og-image.png',
        width: 1200,  
        height: 627,  
        alt: 'Real-Time Chat',
      },
    ],
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetBrains_Mono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
