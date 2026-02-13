import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Target, Lightbulb, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const GOLD_TEXT = "text-[#B08D57]";
const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]";

export default function About() {
  return (
    <Layout>
      <div className="bg-white">
        
        {/* HERO */}
        <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-[10px] tracking-[0.8em] text-gray-400 uppercase block mb-4">
                About Us
              </span>
              <h1 className="text-6xl md:text-7xl font-serif uppercase tracking-widest mb-6">
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
                <h2 className="text-5xl font-serif uppercase tracking-widest mb-8">Our Mission</h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    Nail Check was born from a simple observation: the nail industry deserved 
                    better tools. Professional technicians were limited by traditional design methods, 
                    struggling to visualize concepts before execution.
                  </p>
                  <p>
                    We built the Technical Hub to bridge that gap. By combining AI-powered design 
                    generation with curated seasonal collections and professional-grade supplier access, 
                    we've created the ultimate platform for nail artistry.
                  </p>
                  <p>
                    Every feature—from the Fire Vault to the Supply Suite—is engineered with 
                    precision and purpose. Because great nails start with great tools.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 p-12 border border-gray-200"
              >
                <blockquote className="space-y-4">
                  <p className="text-2xl font-serif italic text-gray-700 leading-relaxed">
                    "Architecture isn't just for buildings. It's the foundation of every great design—
                    including nails."
                  </p>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm uppercase tracking-widest text-gray-500">
                      The Nail Check Philosophy
                    </p>
                  </div>
                </blockquote>
              </motion.div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="py-32 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif uppercase tracking-widest mb-4">Our Values</h2>
              <p className="text-gray-500 italic">What drives the Technical Hub</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <ValueCard
                icon={<Target className="h-12 w-12" />}
                title="Precision"
                description="Every pixel, every feature, every product recommendation is carefully engineered for technical excellence."
              />
              <ValueCard
                icon={<Lightbulb className="h-12 w-12" />}
                title="Innovation"
                description="We push boundaries. AI-powered design generation was just the beginning—we're constantly evolving."
              />
              <ValueCard
                icon={<Users className="h-12 w-12" />}
                title="Community"
                description="Built by nail enthusiasts, for nail enthusiasts. Your feedback shapes our roadmap."
              />
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="py-32 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-serif uppercase tracking-widest mb-16 text-center">Our Story</h2>
            
            <div className="space-y-12">
              <TimelineItem
                year="2025"
                title="The Technical Hub Launches"
                description="Nail Check goes live with AI Design Lab, Fire Vault, Seasonal Vault, and Supply Suite. Over 1,000 designs generated in the first month."
              />
              <TimelineItem
                year="2024"
                title="Development Begins"
                description="After months of research with professional nail technicians, we begin building the platform. Focus: precision, speed, and professional-grade tools."
              />
              <TimelineItem
                year="2024"
                title="The Idea"
                description="Founder Andrea identifies a gap in the market: nail artists need better visualization tools before committing to expensive products and time-intensive techniques."
              />
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="py-32 px-4 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div>
              <h2 className="text-5xl font-serif uppercase tracking-widest mb-4">Meet the Founder</h2>
              <p className="text-gray-300 italic">The vision behind Nail Check</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-12">
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#B08D57] to-[#D4AF37] mb-6"></div>
                <h3 className="text-3xl font-serif uppercase tracking-wider mb-2">Andrea</h3>
                <p className={cn("text-sm uppercase tracking-widest", GOLD_TEXT)}>Founder & Visionary</p>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
                With a background in design and a passion for precision engineering, Andrea created 
                Nail Check to solve a problem she experienced firsthand: the inability to visualize 
                nail designs before execution. Today, the Technical Hub serves thousands of artists worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-5xl font-serif uppercase tracking-widest">Join the Movement</h2>
            <p className="text-xl text-gray-600">
              Become part of the technical elite. Start creating today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/membership">
                <Button className={cn("h-16 px-12 text-[11px] uppercase tracking-widest", GOLD_GRADIENT, "text-white")}>
                  Become a Member
                </Button>
              </a>
              <a href="/">
                <Button variant="outline" className="h-16 px-12 text-[11px] uppercase tracking-widest border-black">
                  Try the Design Lab
                </Button>
              </a>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}

function ValueCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center space-y-6">
      <div className={cn("mx-auto w-fit p-4 border-2 border-[#B08D57]", GOLD_TEXT)}>
        {icon}
      </div>
      <h3 className="text-2xl font-serif uppercase tracking-wider">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function TimelineItem({ year, title, description }: {
  year: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-8 items-start">
      <div className="flex-shrink-0 w-24 pt-1">
        <span className={cn("text-3xl font-bold", GOLD_TEXT)}>{year}</span>
      </div>
      <div className="flex-1 border-l-2 border-gray-200 pl-8 pb-8">
        <h3 className="text-2xl font-serif uppercase tracking-wide mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}