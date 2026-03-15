import { Sparkles, Heart, Home, Calendar, Package, LogOut, Crown, MapPin, BookOpen, Star } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isNew?: boolean;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

 const navItems: NavItem[] = [
  { href: "/", label: "Design Lab", icon: Home },
  { href: "/critique", label: "AI Critique", icon: Star, isNew: true },
  { href: "/find-tech", label: "Find a Tech", icon: MapPin },
  { href: "/creators", label: "Creators", icon: Crown }, // ADD THIS LINE
  { href: "/saved", label: "Fire Vault", icon: Heart },
  { href: "/seasonal", label: "Seasonal", icon: Calendar },
  { href: "/supplies", label: "Supplies", icon: Package },
  { href: "/tutorials", label: "Tutorials", icon: BookOpen },
];
  // Mobile nav items (limit to 5 for bottom bar)
  const mobileNavItems: NavItem[] = [
    { href: "/", label: "Create", icon: Home },
    { href: "/critique", label: "Critique", icon: Star, isNew: true },
    { href: "/saved", label: "Vault", icon: Heart },
    { href: "/find-tech", label: "Techs", icon: MapPin },
    { href: "/supplies", label: "Shop", icon: Package },
  ];

  const portalLinks = [
    { href: "/about", label: "About" },
    { href: "/membership", label: "Membership" },
  ];

  return (
    <div className="min-h-screen bg-background font-body text-foreground pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#9B5DE5]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">Nail Check</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#FF6B9D] flex items-center gap-1.5",
                  location === item.href ? "text-[#FF6B9D] font-bold" : "text-muted-foreground",
                  item.isNew && "text-[#9B5DE5] hover:text-[#9B5DE5]",
                  item.isNew && location === item.href && "text-[#9B5DE5] font-bold"
                )}
              >
                {item.isNew && <Star className="h-3.5 w-3.5 fill-current" />}
                {item.label}
                {item.isNew && (
                  <span className="text-[9px] bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] text-white px-1.5 py-0.5 rounded-full font-bold uppercase">
                    New
                  </span>
                )}
              </Link>
            ))}
            
            {/* Divider */}
            <div className="h-4 w-px bg-gray-300"></div>
            
            {/* Portal Links */}
            {portalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#9B5DE5]",
                  location === item.href ? "text-[#9B5DE5] font-bold" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                 <span className="text-sm hidden md:inline-block text-muted-foreground">Hi, {user.firstName || 'Creator'}</span>
                 <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                   <LogOut className="h-5 w-5" />
                 </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a href="https://nail-check.com/membership/" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] hover:opacity-90 text-white hidden md:inline-flex">
                    <Crown className="h-4 w-4 mr-2" />
                    Join
                  </Button>
                </a>
                <a href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <nav className="flex h-16 items-center justify-around px-2">
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors relative",
                location === item.href
                  ? item.isNew ? "text-[#9B5DE5]" : "text-[#FF6B9D]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.isNew && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#9B5DE5] rounded-full"></span>
              )}
              <item.icon className={cn(
                "h-5 w-5", 
                location === item.href && "fill-current"
              )} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}