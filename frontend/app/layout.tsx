import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { ClientI18nProvider } from "@/components/providers/ClientI18nProvider";

const prompt = Prompt({
  weight: ['300', '400', '500', '700'],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "My LifeOS",
  description: "AI-Powered Personal Operating System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Manual Localization Setup to bypass config issues
  const locale = 'th';
  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.error("Failed to load messages:", error);
    messages = {};
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${prompt.variable} font-sans antialiased bg-background text-foreground transition-colors duration-500`}
      >
        <ClientI18nProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </ClientI18nProvider>
      </body>
    </html>
  );
}
