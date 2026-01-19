"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/core";
import { Brain, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 mb-8"
        >
          <Brain className="w-12 h-12 text-primary" />
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold font-display mb-4">
          <span className="ai-text-gradient">404</span>
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Neural Pathway Not Found
        </h2>

        <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to another dimension.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" variant="ai" className="w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
