import { useState, useRef, useEffect } from "react";
import { Sparkles, Search, Menu, X, Crown, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { HamburgerMenu } from "@/components/HamburgerMenu";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when search bar opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  // Close search on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background font-body text-foreground pb-safe">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/90 backdrop-blur-md">
        <div className="container flex h-16 items-center px-4 gap-3">

          {/* Logo — always left */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#9B5DE5]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">
              Nail Check
            </span>
          </Link>

          {/* Expanding search bar — takes up remaining space when open */}
          <div
            className={cn(
              "flex-1 transition-all duration-300 ease-in-out overflow-hidden",
              searchOpen ? "max-w-full opacity-100" : "max-w-0 opacity-0"
            )}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search designs, tutorials, supplies…"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-background/80 focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/40 focus:border-[#FF6B9D]/60 placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* Spacer — pushes right-side icons to the right when search is closed */}
          {!searchOpen && <div className="flex-1" />}

          {/* Right-side controls */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                searchOpen
                  ? "bg-[#FF6B9D]/10 text-[#FF6B9D]"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              aria-label={searchOpen ? "Close search" : "Open search"}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            {/* Auth buttons — visible when search is closed */}
            {!searchOpen && (
              <>
                {user ? (
                  <button
                    onClick={() => logout()}
                    className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    title="Sign out"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                ) : (
                  <>
                    <a
                      href="https://nail-check.com/member-hub/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="hidden sm:inline-flex bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] hover:opacity-90 text-white text-xs font-bold px-4"
                      >
                        <Crown className="h-3.5 w-3.5 mr-1.5" />
                        Join
                      </Button>
                    </a>
                    <a href="/login">
                      <Button variant="outline" size="sm" className="text-xs hidden sm:inline-flex">
                        Login
                      </Button>
                    </a>
                  </>
                )}
              </>
            )}

            {/* Hamburger button */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                menuOpen
                  ? "bg-[#9B5DE5]/10 text-[#9B5DE5]"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="hamburger-menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hamburger Menu ──────────────────────────────────────── */}
      <HamburgerMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLogout={logout}
      />

      {/* ── Page Content ────────────────────────────────────────── */}
      <main className="container px-4 py-8 mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 bg-background/80 mt-8">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#9B5DE5]">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-muted-foreground">
                Nail Check
              </span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-[#FF6B9D] transition-colors">About</Link>
              <Link href="/contact" className="hover:text-[#FF6B9D] transition-colors">Contact</Link>
              <Link href="/privacy-policy" className="hover:text-[#9B5DE5] transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-[#9B5DE5] transition-colors">Terms of Service</Link>
            </nav>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Nail Check. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
