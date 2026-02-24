import { cn } from "@/lib/utils";
import { Html, Head, Main, NextScript } from "next/document";
import { SEOElements } from "@/components/SEO";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
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
