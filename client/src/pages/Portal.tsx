import { Button } from "@/components/ui/button";
import { Sparkles, Flame, Package, Calendar, Crown, ArrowRight, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const GOLD_TEXT = "text-[#B08D57]";
const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]";

export default function Portal() {
  return (
    <>
      <div className="bg-white">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] tracking-[0.8em] text-gray-400 uppercase block mb-4">
                The Technical Hub
              </span>
              <h1 className="text-7xl md:text-8xl font-serif uppercase tracking-widest text-black mb-6">
                Nail Check
              </h1>
              <p className={cn("text-2xl md:text-3xl font-serif italic mb-8", GOLD_TEXT)}>
                Where Architecture Meets Artistry
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                AI-powered design generation, curated seasonal collections, and professional-grade 
                supplies — all in one precision-engineered platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a href="/subscribe">
                <Button className={cn("h-16 px-12 text-[11px] uppercase tracking-widest", GOLD_GRADIENT, "text-white")}>
                  Subscribe to Unlock Full Access
                </Button>
              </a>
              <a href="/">
                <Button variant="outline" className="h-16 px-12 text-[11px] uppercase tracking-widest border-black">
                  Explore the Lab
                </Button>
              </a>
            </motion.div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-32 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-serif uppercase tracking-widest mb-4">The Vault System</h2>
              <p className="text-gray-500 italic">Four precision tools for technical excellence</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <FeatureCard
                icon={<Sparkles className="h-8 w-8" />}
                title="AI Design Lab"
                description="Generate custom nail designs with our proprietary AI. Upload your canvas, describe your vision, and watch precision engineering create your perfect look."
                link="/"
              />
              <FeatureCard
                icon={<Flame className="h-8 w-8" />}
                title="Fire Vault"
                description="Save and organize your AI-generated masterpieces. Access your personal collection anytime, anywhere."
                link="/saved"
              />
              <FeatureCard
                icon={<Calendar className="h-8 w-8" />}
                title="Seasonal Vault"
                description="Expertly curated collections for every season and occasion. Winter elegance, spring blooms, summer vibes, and fall coziness."
                link="/seasonal"
              />
              <FeatureCard
                icon={<Package className="h-8 w-8" />}
                title="Supply Suite"
                description="Curated professional-grade products, tools, and equipment. Members-only access to premium vendor links and insider pricing."
                link="/supplies"
              />
            </div>
          </div>
        </section>

        {/* SUBSCRIPTION CTA */}
        <section className="py-32 px-4 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Lock className={cn("h-16 w-16 mx-auto", GOLD_TEXT)} />
            <h2 className="text-5xl font-serif uppercase tracking-widest">Unlock Full Access</h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              A subscription is required to use the full Nail Check platform. Choose the plan that fits your needs.
            </p>

            {/* Plan Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
              <div className="border border-white/20 p-8 rounded-2xl space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Base Plan</p>
                <p className={cn("text-4xl font-bold", GOLD_TEXT)}>$8.99<span className="text-lg font-normal text-gray-400">/mo</span></p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#D4AF37]" /> AI design generations</li>
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#D4AF37]" /> Fire Vault access</li>
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#D4AF37]" /> Gallery downloads</li>
                </ul>
                <a href="/subscribe">
                  <Button variant="outline" className="w-full mt-2 border-white/30 text-white hover:bg-white/10 text-[10px] uppercase tracking-widest">
                    Get Base
                  </Button>
                </a>
              </div>

              <div className="border border-[#D4AF37]/60 p-8 rounded-2xl space-y-4 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={cn("px-4 py-1 text-[9px] uppercase tracking-widest text-white rounded-full", GOLD_GRADIENT)}>
                    Best Value
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Premium Plan</p>
                <p className={cn("text-4xl font-bold", GOLD_TEXT)}>$19.99<span className="text-lg font-normal text-gray-400">/mo</span></p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><Crown className="h-4 w-4 text-[#D4AF37]" /> Unlimited AI generations</li>
                  <li className="flex items-center gap-2"><Crown className="h-4 w-4 text-[#D4AF37]" /> Clean downloads (no watermark)</li>
                  <li className="flex items-center gap-2"><Crown className="h-4 w-4 text-[#D4AF37]" /> Exclusive discounts &amp; member deals</li>
                  <li className="flex items-center gap-2"><Crown className="h-4 w-4 text-[#D4AF37]" /> Premium supply links</li>
                </ul>
                <a href="/subscribe">
                  <Button className={cn("w-full mt-2 text-[10px] uppercase tracking-widest", GOLD_GRADIENT, "text-white")}>
                    Get Premium
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 px-4 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400">
              The Technical Hub • Nail Check
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <a href="/about" className="hover:text-[#B08D57] transition-colors">About</a>
              <a href="/subscribe" className="hover:text-[#B08D57] transition-colors">Subscribe</a>
              <a href="/" className="hover:text-[#B08D57] transition-colors">Design Lab</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

function FeatureCard({ icon, title, description, link }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  link: string;
}) {
  return (
    <a href={link}>
      <motion.div
        whileHover={{ y: -8 }}
        className="group p-8 border border-gray-200 hover:border-[#B08D57] transition-all cursor-pointer"
      >
        <div className={cn("mb-4 group-hover:text-[#B08D57] transition-colors", "text-black")}>
          {icon}
        </div>
        <h3 className="text-2xl font-serif uppercase tracking-wider mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        <div className="mt-6 flex items-center gap-2 text-sm uppercase tracking-widest text-[#B08D57]">
          Explore <ArrowRight className="h-4 w-4" />
        </div>
      </motion.div>
    </a>
  );
}