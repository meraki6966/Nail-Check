import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  X, Home, Image, Palette, Package, BookOpen, Calendar,
  MapPin, Heart, Crown, User, Settings, Info, Mail,
  LogOut, Sparkles, Shield, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
  isNew?: boolean;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

// Accepts the useAuth User shape (or null/undefined while loading)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyUser = any;

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: AnyUser;
  onLogout: () => void;
}

const GUEST_SECTIONS: MenuSection[] = [
  {
    title: "Create",
    items: [
      { href: "/", label: "Design Lab", icon: Home },
      { href: "/gallery", label: "Gallery", icon: Image },
      { href: "/ai-critique", label: "AI Critique", icon: Palette, isNew: true },
    ],
  },
  {
    title: "Explore",
    items: [
      { href: "/tutorials", label: "Tutorials", icon: BookOpen },
      { href: "/supplies", label: "Supply Hub", icon: Package },
      { href: "/seasonal", label: "Seasonal Vault", icon: Calendar },
      { href: "/find-tech", label: "Find a Tech", icon: MapPin },
      { href: "/creators", label: "Creators", icon: Crown },
    ],
  },
  {
    title: "More",
    items: [
      { href: "/about", label: "About", icon: Info },
      { href: "/contact", label: "Contact", icon: Mail },
      { href: "/subscribe", label: "Subscribe", icon: Crown },
    ],
  },
];

const AUTH_SECTIONS: MenuSection[] = [
  {
    title: "Create",
    items: [
      { href: "/", label: "Design Lab", icon: Home },
      { href: "/gallery", label: "Gallery", icon: Image },
      { href: "/ai-critique", label: "AI Critique", icon: Palette, isNew: true },
    ],
  },
  {
    title: "Explore",
    items: [
      { href: "/tutorials", label: "Tutorials", icon: BookOpen },
      { href: "/supplies", label: "Supply Hub", icon: Package },
      { href: "/seasonal", label: "Seasonal Vault", icon: Calendar },
      { href: "/find-tech", label: "Find a Tech", icon: MapPin },
      { href: "/creators", label: "Creators", icon: Crown },
    ],
  },
  {
    title: "My Space",
    items: [
      { href: "/saved", label: "Fire Vault", icon: Heart },
      { href: "/portal", label: "Account", icon: User },
      { href: "/upload", label: "Upload Design", icon: Image },
    ],
  },
  {
    title: "More",
    items: [
      { href: "/about", label: "About", icon: Info },
      { href: "/contact", label: "Contact", icon: Mail },
    ],
  },
];

export function HamburgerMenu({ isOpen, onClose, user, onLogout }: HamburgerMenuProps) {
  const [location] = useLocation();

  // Close on ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const sections = user ? AUTH_SECTIONS : GUEST_SECTIONS;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel — slides in from right */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-80 max-w-[90vw]",
          "bg-background border-l border-border/60 shadow-2xl",
          "flex flex-col",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border/40 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#9B5DE5]">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-base">Nail Check</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable nav content */}
        <div className="flex-1 overflow-y-auto py-4">

          {/* Logged-in user greeting */}
          {user && (
            <div className="mx-4 mb-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#FF6B9D]/10 to-[#9B5DE5]/10 border border-[#FF6B9D]/20">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-0.5">Signed in as</p>
              <p className="font-semibold text-sm truncate">{user.firstName || user.email || "Creator"}</p>
            </div>
          )}

          {/* Nav sections */}
          {sections.map((section) => (
            <div key={section.title} className="mb-2">
              <p className="px-5 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">
                {section.title}
              </p>
              <div className="space-y-0.5 px-2">
                {section.items.map((item) => {
                  const isActive = location === item.href;
                  const inner = (
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-gradient-to-r from-[#FF6B9D]/15 to-[#9B5DE5]/15 text-[#FF6B9D] border border-[#FF6B9D]/20"
                          : "text-foreground/80 hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          isActive ? "text-[#FF6B9D]" : "text-muted-foreground"
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.isNew && (
                        <span className="text-[9px] bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] text-white px-1.5 py-0.5 rounded-full font-bold uppercase">
                          New
                        </span>
                      )}
                      {item.badge && (
                        <span className="text-[10px] bg-[#FF6B9D] text-white px-1.5 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  );

                  return item.external ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link key={item.href} href={item.href} onClick={onClose}>
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer footer */}
        <div className="flex-shrink-0 border-t border-border/40 px-4 py-4 space-y-2">
          {user ? (
            <button
              onClick={() => { onLogout(); onClose(); }}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/subscribe"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] hover:opacity-90 transition-opacity"
              >
                <Crown className="h-4 w-4" />
                Join
              </Link>
              <Link
                href="/login"
                onClick={onClose}
                className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-accent transition-colors"
              >
                Login
              </Link>
            </div>
          )}
          <div className="flex items-center justify-center gap-4 pt-1">
            <Link
              href="/privacy-policy"
              onClick={onClose}
              className="flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <Shield className="h-3 w-3" />
              Privacy
            </Link>
            <span className="text-muted-foreground/30 text-[10px]">·</span>
            <Link
              href="/terms-of-service"
              onClick={onClose}
              className="flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <FileText className="h-3 w-3" />
              Terms
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
