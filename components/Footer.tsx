"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { useScopedI18n } from "@/locales/client";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const tScope = useScopedI18n("footer");

  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/axiomtext",
      icon: Linkedin,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/axiomtext",
      icon: Facebook,
    },
    {
      name: "Twitter",
      href: "https://twitter.com/axiomtext",
      icon: Twitter,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/axiomtext",
      icon: Instagram,
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/axiomtext",
      icon: Youtube,
    },
  ];

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Logo et Description */}
          <div className="max-w-sm">
            {/* <h3 className="text-xl font-semibold text-primary">AxiomText</h3> */}
            <Image src="/images/axiomlogo.png" alt="AxiomText" width={140} height={140} />
            <p className="mt-2 text-sm text-muted-foreground">
              {tScope("description")}
            </p>
          </div>

          {/* Réseaux sociaux */}
          <div className="flex flex-wrap items-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={`${tScope("followUs")} ${social.name}`}
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {currentYear} AxiomText. {tScope("allRightsReserved")}
          </div>
        </div>
      </div>
    </footer>
  );
}
