import { cn } from "@/lib/utils";
import { Html, Head, Main, NextScript } from "next/document";
import { SEOElements } from "@/components/SEO";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        {/* iOS Safari: allow full-screen web app & status bar styling */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Fight&Flight" />
        {/* Theme color for browser chrome on mobile */}
        <meta name="theme-color" content="#050505" />
        <meta name="msapplication-TileColor" content="#050505" />
        {/* Prevent phone number auto-detection from breaking layout */}
        <meta name="format-detection" content="telephone=no" />
        <SEOElements />
        {/*
          CRITICAL: DO NOT REMOVE THIS SCRIPT
          The Softgen AI monitoring script is essential for core app functionality.
          The application will not function without it.
        */}
        <script
          src={process.env.NEXT_PUBLIC_SOFTGEN_SCRIPT_URL || "https://cdn.softgen.ai/script.js"}
          async
          data-softgen-monitoring="true"
        />
      </Head>
      <body
        className={cn(
          "min-h-screen w-full scroll-smooth bg-background text-foreground antialiased"
        )}
      >
        <Main />
        <NextScript />

        {/* Visual Editor Script */}
        {process.env.NODE_ENV === "development" && (
          <script
            src={process.env.NEXT_PUBLIC_SOFTGEN_EDITOR_URL || "https://cdn.softgen.dev/visual-editor.min.js"}
            async
            data-softgen-visual-editor="true"
          />
        )}
      </body>
    </Html>
  );
}
