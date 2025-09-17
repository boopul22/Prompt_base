import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Free Prompt Base - Download Free AI Prompts for All Models",
    template: "%s | Free Prompt Base"
  },
  description: "Access thousands of free AI prompts for ChatGPT, Claude, Gemini, and all AI models. Download tested prompts for content creation, marketing, SEO, and business growth.",
  keywords: [
    "free AI prompts",
    "free ChatGPT prompts", 
    "Claude prompts",
    "Gemini prompts",
    "prompt engineering",
    "AI prompt library",
    "free prompt templates",
    "AI marketing prompts",
    "AI content creation",
    "prompt engineering guide",
    "free AI prompt database",
    "AI SEO prompts",
    "AI writing prompts",
    "prompt collection",
    "artificial intelligence prompts",
    "machine learning prompts"
  ],
  authors: [{ name: "Free Prompt Base Team" }],
  creator: "Free Prompt Base",
  publisher: "Free Prompt Base",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Free Prompt Base - Download Free AI Prompts for All Models",
    description: "Access thousands of free AI prompts for ChatGPT, Claude, Gemini, and all AI models. Download tested prompts for content creation, marketing, SEO, and business growth.",
    url: "/",
    siteName: "Free Prompt Base",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Prompt Base - Download Free AI Prompts for All AI Models"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Prompt Base - Download Free AI Prompts for All Models",
    description: "Access thousands of free AI prompts for ChatGPT, Claude, Gemini, and all AI models.",
    images: ["/og-image.png"],
    site: "@freepromptbase"
  },
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
  verification: {
    google: "Kwixb4_W335SRst1i80tZp-VzgBmBizhUO1WXYV5RH4",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('SW registered: ', registration);
                  }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
