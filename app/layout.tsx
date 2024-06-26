import { type Metadata } from "next";
import React from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

import "@/styles/global.css";

export const metadata: Metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="zh-CN"
      className="scroll-smooth dark"
      style={{ colorScheme: "dark" }}
    >
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/images/fuxiaochen-dark.svg"
        />
        {/* Google Search Console 验证 */}
        <meta
          name="google-site-verification"
          content="DTiRVawomypV2iRoz9UUw2P0wAxnPs-kffJl6MNevdM"
        />
      </head>
      <body className="debug-screens scroll-smooth overflow-x-clip">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
