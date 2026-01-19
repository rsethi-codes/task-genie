"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/core";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-error/10 border border-error/20 mb-8"
        >
          <AlertTriangle className="w-12 h-12 text-error" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
          System <span className="text-error">Error</span>
        </h1>

        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text-secondary">
          Something went wrong
        </h2>

        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          We encountered an unexpected error. Our AI is working to fix this issue.
        </p>

        {error.digest && (
          <p className="text-xs text-text-secondary/50 mb-8 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="ai"
            onClick={reset}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
