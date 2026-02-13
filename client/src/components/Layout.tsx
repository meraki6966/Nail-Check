import { Sparkles, Heart, Home, Calendar, Package, LogOut, Crown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
  { href: "/", label: "Design Lab", icon: Home },
  { href: "/saved", label: "Fire Vault", icon: Heart },
  { href: "/seasonal", label: "Seasonal", icon: Calendar },
  { href: "/supplies", label: "Supplies", icon: Package },
  { href: "/tutorials", label: "Tutorials", icon: Sparkles }, // ADD THIS LINE
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#B08D57] to-[#D4AF37]">
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
                  "text-sm font-medium transition-colors hover:text-[#B08D57]",
                  location === item.href ? "text-[#B08D57] font-bold" : "text-muted-foreground"
                )}
              >
                {item.label}
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
                  "text-sm font-medium transition-colors hover:text-[#B08D57]",
                  location === item.href ? "text-[#B08D57] font-bold" : "text-muted-foreground"
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
                  <Button size="sm" className="bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57] hover:opacity-90 text-white hidden md:inline-flex">
                    <Crown className="h-4 w-4 mr-2" />
                    Join
                  </Button>
                </a>
                <a href="/api/login">
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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                location === item.href
                  ? "text-[#B08D57]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", location === item.href && "fill-current")} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}