"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/mode-toggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { motion } from "framer-motion";
import { Github, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-32 h-8"
            >
              <Image
                src="/images/axiomlogo.png"
                alt="AxiomText"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Button variant="outline" size="icon" asChild>
            <Link
              href="https://github.com/dmx1254/axiomtext-api-docs"
              target="_blank"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <ThemeToggle />
          <div className="pl-1">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-14 bg-background border-b border-border p-4 space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Button variant="outline" size="icon" asChild className="w-full">
                <Link
                  href="https://github.com/dmx1254/axiomtext-api-docs"
                  target="_blank"
                  className="flex items-center justify-center space-x-2"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Link>
              </Button>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
