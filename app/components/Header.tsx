"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === "dark";

  // Next-Themes hydration issue fix
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-black/30">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-600/90" />
          </div>
          <div className="w-8 h-8"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-black/30 border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* লোগো */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
            <span className="text-white font-bold text-lg">QED</span>
          </div>
          {/* নাম লুকানো */}
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            href="https://qedlearning.com/" 
             target="_blank"
            className="hidden sm:inline-flex text-sm font-medium px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Visit Main Site
          </Link>
          
          {/* <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="text-sm font-medium px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors inline-flex items-center gap-2"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
          </button> */}
        </div>
      </div>
    </header>
  );
}