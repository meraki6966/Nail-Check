import { Layout } from "@/components/Layout";
import { BookOpen, Sparkles, Play, Lock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";

export default function Tutorials() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = async () => {
    if (email) {
      try {
        await fetch("https://script.google.com/macros/s/AKfycbymz2-QPYcX_pZ0B4wcxAvyKRSAjPmVcH4QFQKTBfh-2-3kLOuqxBeT1H5qXV1gJ3gz/exec", {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, source: "Tutorials Page" })
        });
        setSubscribed(true);
      } catch (error) {
        console.error("Failed to subscribe:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F8] via-[#F8F0FF] to-[#F0FFFF]">
        <div className="max-w-4xl mx-auto px-4 py-16">
          
          {/* Animated Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              {/* Floating sparkles */}
              <Sparkles className="absolute -top-4 -left-8 h-6 w-6 text-[#FF6B9D] animate-pulse" />
              <Sparkles className="absolute -top-2 -right-6 h-4 w-4 text-[#9B5DE5] animate-pulse delay-300" />
              <Sparkles className="absolute -bottom-2 -left-4 h-5 w-5 text-[#00D9FF] animate-pulse delay-500" />
              
              <BookOpen className="h-20 w-20 mx-auto mb-6 text-[#9B5DE5]" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-serif uppercase tracking-wider mb-4 bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
              The Learning Lab
            </h1>
            
            <p className="text-xl text-gray-500 italic">
              Level up your nail game
            </p>
          </div>

          {/* Coming Soon Card */}
          <div className="relative">
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] rounded-3xl blur-lg opacity-30 animate-pulse"></div>
            
            <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl">
              
              {/* Lock Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#9B5DE5] flex items-center justify-center animate-bounce">
                    <Lock className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#00D9FF] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🔥</span>
                  </div>
                </div>
              </div>

              {/* Main Message */}
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-serif mb-4 text-gray-800">
                  Something <span className="bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">Amazing</span> is Cooking
                </h2>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                  We're crafting exclusive video tutorials, pro tips, FAQs, and step-by-step guides to take your nail artistry to the next level.
                </p>
              </div>

              {/* What's Coming */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { icon: "🎬", label: "Video Lessons", color: "from-[#FF6B9D] to-[#FF8A5B]" },
                  { icon: "💡", label: "Pro Tips", color: "from-[#9B5DE5] to-[#FF6B9D]" },
                  { icon: "❓", label: "FAQs", color: "from-[#00D9FF] to-[#9B5DE5]" },
                  { icon: "📚", label: "Guides", color: "from-[#10B981] to-[#00D9FF]" },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="group p-4 rounded-2xl bg-gradient-to-br from-[#FFF5F8] to-[#F8F0FF] hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-r mx-auto mb-3 flex items-center justify-center text-2xl",
                      item.color
                    )}>
                      {item.icon}
                    </div>
                    <p className="text-sm font-medium text-gray-700 text-center group-hover:text-[#9B5DE5] transition-colors">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Notify Me Form */}
              {!subscribed ? (
                <div className="max-w-md mx-auto">
                  <p className="text-center text-sm text-gray-500 mb-4">
                    <Bell className="inline h-4 w-4 mr-1" />
                    Get notified when we launch
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:border-[#9B5DE5] focus:ring-2 focus:ring-[#9B5DE5]/20 outline-none transition-all"
                    />
                    <Button
                      onClick={handleNotify}
                      className={cn("rounded-full px-6", PURPLE_GRADIENT, "text-white hover:shadow-lg hover:shadow-[#9B5DE5]/30 transition-all")}
                    >
                      Notify Me
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-[#10B981]/10 to-[#00D9FF]/10 border border-[#10B981]/20">
                  <span className="text-4xl mb-3 block">🎉</span>
                  <p className="text-[#10B981] font-medium">You're on the list!</p>
                  <p className="text-sm text-gray-500">We'll notify you when tutorials drop.</p>
                </div>
              )}

              {/* Teaser Preview */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-6">Sneak Peek</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { title: "Apex Mastery", level: "Beginner", image: "http://nail-check.com/wp-content/uploads/2026/02/Apex-Present.png" },
                    { title: "Chrome Secrets", level: "Intermediate", image: "http://nail-check.com/wp-content/uploads/2026/02/Chrome.png" },
                    { title: "Competition Prep", level: "Advanced", image: "http://nail-check.com/wp-content/uploads/2026/02/Competition.png" },
                  ].map((item, idx) => (
                    <div key={idx} className="relative group cursor-pointer">
                      <div className="aspect-video rounded-xl overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Play className="h-4 w-4 text-white ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs font-medium truncate">{item.title}</p>
                          <p className="text-white/60 text-[10px]">{item.level}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">Already a member?</p>
            <a href="https://nail-check.com/membership/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full border-[#9B5DE5] text-[#9B5DE5] hover:bg-[#9B5DE5] hover:text-white">
                Check Membership Benefits
              </Button>
            </a>
          </div>

        </div>
      </div>
    </Layout>
  );
}