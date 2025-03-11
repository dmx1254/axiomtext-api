"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, GlobeIcon } from "lucide-react";
import { locales, type ValidLocale } from "@/lib/utils";
import Image from "next/image";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const switchLanguage = (locale: ValidLocale) => {
    // Get the path without the locale prefix
    const currentLocale = pathname.split("/")[1];
    const isCurrentLocaleValid = locales.includes(currentLocale as ValidLocale);

    const newPathname = isCurrentLocaleValid
      ? pathname.replace(`/${currentLocale}`, `/${locale}`)
      : `/${locale}${pathname}`;

    router.push(newPathname);
  };

  const currentLocale = pathname.split("/")[1] as ValidLocale;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="group flex items-center gap-2 border-none shadow-none cursor-pointer hover:bg-transparent bg-transparent outline-none focus:border-none focus:outline-none hover:border-none hover:outline-none"
          onMouseEnter={() => setIsOpen(true)}
        >
          <Image
            src={currentLocale === "fr" ? "/flags/frr.png" : "/flags/enn.png"}
            alt={currentLocale}
            width={20}
            height={20}
            className="w-5 h-5 rounded-full"
          />
          <span className="flex items-center gap-0.5 text-base border-none uppercase text-[#646464] outline-none focus:border-none focus:outline-none group-hover:text-[#67B142]">
            {currentLocale}
            <ChevronDown size={16} />
          </span>

          {/* <GlobeIcon className="h-4 w-4" /> */}
          <span className="sr-only">Switch language</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        onMouseLeave={() => setIsOpen(false)}
        className="min-w-[5rem] hover:bg-none z-[99999]"
      >
        <DropdownMenuItem
          onClick={() => switchLanguage(currentLocale === "fr" ? "en" : "fr")}
          className="cursor-pointer"
        >
          {/* {locale === "fr" ? "🇫🇷 Français" : "🇬🇧 English"} */}
          <Image
            src={currentLocale === "fr" ? "/flags/enn.png" : "/flags/frr.png"}
            alt={currentLocale}
            width={20}
            height={20}
            className="w-5 h-5 rounded-full"
          />
          <span className="text-base uppercase text-[#646464] outline-none focus:border-none focus:outline-none">
            {currentLocale === "fr" ? "en" : "fr"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
