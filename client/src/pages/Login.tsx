import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getRandomMessage } from "@/lib/microcopy";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/login" : "/api/register";
      const body = isLogin 
        ? { email, password }
        : { email, password, firstName, lastName };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh user data
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        
        toast({
          title: data.message || getRandomMessage("LOGIN_SUCCESS"),
          description: isLogin ? "Welcome back!" : "Your account has been created.",
        });
        
        // Redirect to home
        setLocation("/");
      } else {
        toast({
          title: data.message || getRandomMessage("LOGIN_ERROR"),
          description: data.error === "INVALID_PASSWORD" 
            ? "Please check your password and try again."
            : "Please check your details and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: getRandomMessage("GENERIC_ERROR"),
        description: getRandomMessage("RETRY_ACTION"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-[#FF6B9D]" />
              <h1 className="text-3xl font-serif tracking-wider uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                {isLogin ? "Welcome Back" : "Join the Vault"}
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              {isLogin 
                ? "Sign in to access your saved designs and AI generator" 
                : "Create an account to unlock unlimited nail inspiration"}
            </p>
          </div>

          {/* Form */}
          <div className="bg-gradient-to-br from-[#FFF5F8] to-[#F8F0FF] p-8 rounded-3xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name fields (register only) */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your first name"
                      className="rounded-xl border-gray-200 focus:border-[#9B5DE5] focus:ring-[#9B5DE5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Your last name"
                      className="rounded-xl border-gray-200 focus:border-[#9B5DE5] focus:ring-[#9B5DE5]"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="pl-10 rounded-xl border-gray-200 focus:border-[#9B5DE5] focus:ring-[#9B5DE5]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10 rounded-xl border-gray-200 focus:border-[#9B5DE5] focus:ring-[#9B5DE5]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] hover:from-[#FF5A8A] hover:to-[#8A4CD4] text-white font-medium text-sm uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Access the Vault" : "Create Account"
                )}
              </Button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-[#9B5DE5] hover:text-[#FF6B9D] font-medium transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl mb-2">✨</div>
              <p className="text-xs text-gray-500">AI Nail Generator</p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">🔥</div>
              <p className="text-xs text-gray-500">Fire Vault Saves</p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">👑</div>
              <p className="text-xs text-gray-500">Member Exclusives</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}