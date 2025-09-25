import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snapptale",
  description: "AI-powered storybook generator for children.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-display">
      <body className="antialiased min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        {children}
      </body>
    </html>
  );
}