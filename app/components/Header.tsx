"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-black/30 border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* লোগো */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
            <span className="text-white font-bold text-lg">QED</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* সব স্ক্রিনে button দেখাবে */}
          <Link
            href="https://qedlearning.com/"
            target="_blank"
            className="text-sm font-medium px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Visit Main Site
          </Link>
        </div>
      </div>
    </header>
  );
}
