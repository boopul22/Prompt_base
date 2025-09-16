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
    default: "Free PromptBase - Viral AI Prompts Collection",
    template: "%s | Free PromptBase"
  },
  description: "Discover thousands of viral AI prompts for ChatGPT, Claude, and other AI tools. Free collection of tested prompts for content creation, marketing, coding, and business growth.",
  keywords: [
    "AI prompts",
    "ChatGPT prompts",
    "Claude prompts",
    "viral prompts",
    "AI content creation",
    "prompt engineering",
    "free AI prompts",
    "prompt library",
    "AI marketing",
    "AI writing prompts",
    "prompt collection",
    "AI prompt database"
  ],
  authors: [{ name: "Free PromptBase Team" }],
  creator: "Free PromptBase",
  publisher: "Free PromptBase",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Free PromptBase - Viral AI Prompts Collection",
    description: "Discover thousands of viral AI prompts for ChatGPT, Claude, and other AI tools. Free collection of tested prompts for content creation, marketing, coding, and business growth.",
    url: "/",
    siteName: "Free PromptBase",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free PromptBase - Viral AI Prompts Collection"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PromptBase - Viral AI Prompts Collection",
    description: "Discover thousands of viral AI prompts for ChatGPT, Claude, and other AI tools. Free collection of tested prompts.",
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
    google: "your-google-verification-code-here",
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
