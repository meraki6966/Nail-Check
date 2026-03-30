import { Button } from "@/components/ui/button";
import { Target, Lightbulb, Users, Sparkles, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// NEW PINTEREST COLOR PALETTE
const PINK = "#FF6B9D";
const PURPLE = "#9B5DE5";
const CYAN = "#00D9FF";
const CORAL = "#FF8A5B";

const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";
const CYAN_GRADIENT = "bg-gradient-to-r from-[#00D9FF] to-[#9B5DE5]";
const FULL_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF]";

export default function About() {
  return (
    
      <div className="bg-white">
        
        {/* HERO */}
        <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-[#FFF5F8] via-[#F8F0FF] to-white px-4 py-20 overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#FF6B9D]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#9B5DE5]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-[#00D9FF]/10 rounded-full blur-2xl"></div>
          
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-[#FF6B9D]" />
                <span className="text-[10px] tracking-[0.8em] text-[#9B5DE5] uppercase font-medium">
                  About Us
                </span>
                <Sparkles className="h-5 w-5 text-[#FF6B9D]" />
              </div>
              <h1 className="text-6xl md:text-7xl font-serif uppercase tracking-widest mb-6 bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                The Technical Hub
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Where precision engineering meets creative expression. Built for nail technicians, 
                artists, and enthusiasts who demand excellence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* MISSION */}
        <section className="py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-5xl font-serif uppercase tracking-widest mb-8 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
                  Our Mission
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    Nail Check was born from the realization that while inspiration is everywhere, 
                    clarity is rare. As a self-taught artist, I navigated the gap between seeing a 
                    masterpiece and understanding the technical steps required to create it.
                  </p>
                  <p>
                    This ecosystem exists to bridge that gap—bringing high-tech guidance and product 
                    education into a single, refined sanctuary for the modern artist.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-[#FFF5F8] to-[#F8F0FF] p-12 rounded-3xl border border-[#FF6B9D]/20"
              >
                <blockquote className="space-y-4">
                  <p className="text-2xl font-serif italic text-gray-700 leading-relaxed">
                    "Architecture isn't just for buildings. It's the foundation of every great design—
                    including nails."
                  </p>
                  <div className="pt-4 border-t border-[#9B5DE5]/20">
                    <p className="text-sm uppercase tracking-widest text-[#9B5DE5]">
                      The Nail Check Philosophy
                    </p>
                  </div>
                </blockquote>
              </motion.div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="py-32 px-4 bg-gradient-to-b from-white via-[#F8F0FF]/30 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif uppercase tracking-widest mb-4 bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                Our Values
              </h2>
              <p className="text-gray-500 italic">What drives the Technical Hub</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <ValueCard
                icon={<Target className="h-12 w-12" />}
                title="Precision"
                description="Every pixel, every feature, every product recommendation is carefully engineered for technical excellence."
                color="pink"
              />
              <ValueCard
                icon={<Lightbulb className="h-12 w-12" />}
                title="Innovation"
                description="We push boundaries. AI-powered design generation was just the beginning—we're constantly evolving."
                color="purple"
              />
              <ValueCard
                icon={<Users className="h-12 w-12" />}
                title="Community"
                description="Built by nail enthusiasts, for nail enthusiasts. Your feedback shapes our roadmap."
                color="cyan"
              />
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="py-32 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-serif uppercase tracking-widest mb-16 text-center bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
              Our Story
            </h2>
            
            <div className="space-y-12">
              <TimelineItem
                year="2025"
                title="The Technical Hub Launches"
                description="Nail Check goes live with AI Design Lab, Fire Vault, Seasonal Vault, and Supply Suite. Over 1,000 designs generated in the first month."
                color="pink"
              />
              <TimelineItem
                year="2024"
                title="Development Begins"
                description="After months of research with professional nail technicians, we begin building the platform. Focus: precision, speed, and professional-grade tools."
                color="purple"
              />
              <TimelineItem
                year="2024"
                title="The Idea"
                description="The Founder identifies a gap in the market: nail artists need better visualization tools before committing to expensive products and time-intensive techniques."
                color="cyan"
              />
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="py-32 px-4 bg-gradient-to-b from-[#1a1a2e] to-black text-white">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div>
              <h2 className="text-5xl font-serif uppercase tracking-widest mb-4 bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                Meet the Founder
              </h2>
              <p className="text-gray-400 italic">The vision behind Nail Check</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-12 rounded-3xl backdrop-blur">
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] mb-6 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl font-serif uppercase tracking-wider mb-2">The Founder</h3>
                <p className="text-sm uppercase tracking-widest text-[#FF6B9D]">Visionary & Creator</p>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
                As a self-taught artist who navigated the gap between inspiration and execution, 
                the Founder created Nail Check to bridge clarity with creativity. The Technical Hub 
                now serves thousands of artists worldwide, providing high-tech guidance and product 
                education in one refined sanctuary.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-4 bg-gradient-to-b from-white to-[#FFF5F8]">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-5xl font-serif uppercase tracking-widest bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
              Join the Movement
            </h2>
            <p className="text-xl text-gray-600">
              Become part of the technical elite. Start creating today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/">
                <Button className={cn("h-16 px-12 text-[11px] uppercase tracking-widest rounded-full", PINK_GRADIENT, "text-white hover:shadow-lg hover:shadow-[#FF6B9D]/30 transition-all")}>
                  Try the Design Lab
                </Button>
              </a>
            </div>
          </div>
        </section>

      </div>
    
  );
}

function ValueCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "pink" | "purple" | "cyan";
}) {
  const colorMap = {
    pink: { text: "text-[#FF6B9D]", border: "border-[#FF6B9D]", bg: "bg-[#FF6B9D]/5" },
    purple: { text: "text-[#9B5DE5]", border: "border-[#9B5DE5]", bg: "bg-[#9B5DE5]/5" },
    cyan: { text: "text-[#00D9FF]", border: "border-[#00D9FF]", bg: "bg-[#00D9FF]/5" },
  };
  
  const colors = colorMap[color];
  
  return (
    <div className="text-center space-y-6">
      <div className={cn("mx-auto w-fit p-4 rounded-2xl border-2", colors.border, colors.bg, colors.text)}>
        {icon}
      </div>
      <h3 className="text-2xl font-serif uppercase tracking-wider">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function TimelineItem({ year, title, description, color }: {
  year: string;
  title: string;
  description: string;
  color: "pink" | "purple" | "cyan";
}) {
  const colorMap = {
    pink: "text-[#FF6B9D]",
    purple: "text-[#9B5DE5]",
    cyan: "text-[#00D9FF]",
  };
  
  const borderColorMap = {
    pink: "border-[#FF6B9D]/30",
    purple: "border-[#9B5DE5]/30",
    cyan: "border-[#00D9FF]/30",
  };
  
  return (
    <div className="flex gap-8 items-start">
      <div className="flex-shrink-0 w-24 pt-1">
        <span className={cn("text-3xl font-bold", colorMap[color])}>{year}</span>
      </div>
      <div className={cn("flex-1 border-l-2 pl-8 pb-8", borderColorMap[color])}>
        <h3 className="text-2xl font-serif uppercase tracking-wide mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}