"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-primary p-6">
          <div className="text-center max-w-2xl">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-error/10 border border-error/20 mb-8">
              <AlertTriangle className="w-12 h-12 text-error" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Global <span className="text-error">Error</span>
            </h1>

            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text-secondary">
              Something went critically wrong
            </h2>

            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              We encountered an unexpected error that affected the entire application. Please try again or return to the homepage.
            </p>

            {error.digest && (
              <p className="text-xs text-text-secondary/50 mb-8 font-mono">
                Error ID: {error.digest}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center h-12 px-6 text-base font-semibold rounded-xl ai-gradient text-white ai-glow hover:opacity-90 transition-all w-full sm:w-auto"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </button>
              <Link href="/">
                <button className="inline-flex items-center justify-center h-12 px-6 text-base font-semibold rounded-xl border border-border bg-transparent hover:bg-surface-hover text-text-primary transition-all w-full sm:w-auto">
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
