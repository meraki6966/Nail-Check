import { Link, useLocation } from "wouter";
import { Sparkles, Heart, Home, PlusCircle, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Gallery", icon: Home },
    { href: "/upload", label: "Upload", icon: PlusCircle },
    { href: "/saved", label: "Saved", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background font-body text-foreground pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">Nail Check</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === item.href ? "text-primary font-bold" : "text-muted-foreground"
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
              <Link href="/api/login">
                <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Creator Login
                </Button>
              </Link>
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
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", location === item.href && "fill-current")} />
              {item.label}
            </Link>
          ))}
          {/* Mobile Login if not logged in */}
          {!user && (
            <a
              href="/api/login"
              className="flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="h-5 w-5" />
              Login
            </a>
          )}
        </nav>
      </div>
    </div>
  );
}
