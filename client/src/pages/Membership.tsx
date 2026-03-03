import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Lock, Star, Zap, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const GOLD_TEXT = "text-[#B08D57]";
const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]";
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF]";

const FOUNDER_BENEFITS = [
  "Unlimited AI design generations",
  "Unlimited AI Nail Critiques with personalized feedback",
  "Access to all 4 seasonal vaults (Winter, Spring, Summer, Fall)",
  "Premium product links in Supply Suite",
  "Save unlimited designs to Fire Vault",
  "Early access to new features",
  "Priority support",
  "Member-only tutorials and content",
  "Exclusive vendor discounts",
];

const FREE_TIER = [
  "1 free AI generation",
  "1 free AI critique",
  "Browse seasonal collections (view-only)",
  "Limited Fire Vault (5 saves)",
  "Supply Suite (no product links)",
];

export default function Membership() {
  return (
    <Layout>
      <div className="bg-white">
        
        {/* HERO */}
        <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Crown className={cn("h-20 w-20 mx-auto mb-6", GOLD_TEXT)} />
              <h1 className="text-6xl md:text-7xl font-serif uppercase tracking-widest mb-6">
                The Founder
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Join the technical elite. Unlock unlimited AI designs, exclusive collections, 
                and premium supplier access.
              </p>
            </motion.div>
          </div>
        </section>

        {/* NEW FEATURE HIGHLIGHT - AI CRITIQUE */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#F8F0FF] to-[#F0FFFF]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left: Feature Info */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-4">
                    <Zap className="h-3 w-3" /> New Feature
                  </div>
                  <h2 className="text-4xl font-serif uppercase tracking-wider mb-4">
                    AI Nail Critique
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Upload your nail work and get instant professional feedback from our AI nail tech expert. 
                    Receive a score out of 10, detailed analysis of what's working and areas to improve, 
                    plus personalized tutorial and supply recommendations.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-sm">
                      <Star className="h-5 w-5 text-[#9B5DE5]" />
                      <span>Professional score (1-10) with detailed breakdown</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>What's working well in your design</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      <span>Areas to improve with specific tips</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <Camera className="h-5 w-5 text-[#FF6B9D]" />
                      <span>Upload, paste URL, or select from Fire Vault</span>
                    </li>
                  </ul>
                  <a href="/critique">
                    <Button className={cn("w-full md:w-auto h-12 px-8 rounded-full", PURPLE_GRADIENT, "text-white")}>
                      Try AI Critique →
                    </Button>
                  </a>
                </div>
                
                {/* Right: Visual */}
                <div className="bg-gradient-to-br from-[#9B5DE5] to-[#00D9FF] p-8 md:p-12 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur rounded-2xl p-6 w-full max-w-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/80 text-sm uppercase tracking-wider">Your Score</span>
                      <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                    </div>
                    <div className="text-6xl font-bold text-white mb-2">8.5/10</div>
                    <div className="text-white/80 text-sm mb-4">Chrome • Coffin • Advanced</div>
                    <div className="space-y-2">
                      <div className="bg-white/20 rounded-lg p-3">
                        <p className="text-white text-xs">✓ Excellent apex placement and structure</p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <p className="text-white text-xs">→ Work on sidewall consistency</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PRICING COMPARISON */}
        <section className="py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* FREE TIER */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="border border-gray-200 p-8 relative"
              >
                <div className="mb-8">
                  <h3 className="text-3xl font-serif uppercase tracking-wider mb-2">Guest Access</h3>
                  <p className="text-gray-500 italic mb-6">Try before you commit</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-gray-500">/forever</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {FREE_TIER.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>

                <a href="/">
                  <Button variant="outline" className="w-full h-14 uppercase text-[10px] tracking-widest border-gray-300">
                    Start as Guest
                  </Button>
                </a>
              </motion.div>

              {/* FOUNDER TIER */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="border-2 border-[#B08D57] p-8 relative shadow-2xl"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]"></div>
                
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                
                <div className="mb-8 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-serif uppercase tracking-wider">Founder Member</h3>
                    <Crown className={cn("h-8 w-8", GOLD_TEXT)} />
                  </div>
                  <p className={cn("italic mb-6", GOLD_TEXT)}>Full technical access</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">$8.99</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {FOUNDER_BENEFITS.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className={cn("h-5 w-5 flex-shrink-0 mt-0.5", GOLD_TEXT)} />
                      <span className={cn(
                        "text-sm",
                        benefit.includes("AI Nail Critiques") && "font-semibold text-[#9B5DE5]"
                      )}>
                        {benefit}
                        {benefit.includes("AI Nail Critiques") && (
                          <span className="ml-2 text-[9px] bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] text-white px-1.5 py-0.5 rounded-full font-bold uppercase">
                            New
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <a href="https://nail-check.com/membership/" target="_blank" rel="noopener noreferrer">
                  <Button className={cn("w-full h-14 uppercase text-[10px] tracking-widest", GOLD_GRADIENT, "text-white")}>
                    Become a Founder Member
                  </Button>
                </a>
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  Cancel anytime • No hidden fees
                </p>
              </motion.div>

            </div>
          </div>
        </section>

        {/* BENEFITS SHOWCASE */}
        <section className="py-32 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif uppercase tracking-widest mb-4">Why Join?</h2>
              <p className="text-gray-500 italic">Precision tools for technical excellence</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <BenefitCard
                icon={<Sparkles className="h-10 w-10" />}
                title="Unlimited Creation"
                description="Generate as many AI designs as you want. No daily limits, no restrictions."
              />
              <BenefitCard
                icon={<Star className="h-10 w-10" />}
                title="AI Critique"
                description="Get professional feedback on your work with scores, tips, and personalized recommendations."
                isNew
              />
              <BenefitCard
                icon={<Crown className="h-10 w-10" />}
                title="Exclusive Access"
                description="Members-only product links, tutorials, and seasonal collections unavailable to guests."
              />
              <BenefitCard
                icon={<Lock className="h-10 w-10" />}
                title="Professional Tools"
                description="Access to premium suppliers, insider pricing, and technical resources."
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-32 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-serif uppercase tracking-widest mb-16 text-center">FAQ</h2>
            
            <div className="space-y-8">
              <FAQItem
                question="Can I try it for free first?"
                answer="Yes! All guests get 1 free AI generation and 1 free AI critique to test our features. You can browse the seasonal collections and Supply Suite (without product links) before committing to membership."
              />
              <FAQItem
                question="What is AI Nail Critique?"
                answer="AI Nail Critique is our newest feature that analyzes your nail work and provides professional feedback. Upload any nail image and receive a score out of 10, detailed analysis of technique, shape, and finish, plus personalized recommendations for tutorials and supplies to help you improve."
              />
              <FAQItem
                question="What payment methods do you accept?"
                answer="We accept all major credit cards (Visa, Mastercard, Amex, Discover) and digital wallets. Payments are processed securely through our WordPress membership system."
              />
              <FAQItem
                question="Can I cancel anytime?"
                answer="Absolutely. You can cancel your membership at any time from your account settings. You'll retain access until the end of your current billing period."
              />
              <FAQItem
                question="Do you offer refunds?"
                answer="We offer a 7-day money-back guarantee. If you're not satisfied within the first week, contact us for a full refund."
              />
              <FAQItem
                question="How does the membership work?"
                answer="Sign up through our WordPress membership page. Once your payment is confirmed, you'll gain instant access to all premium features including unlimited AI generations, unlimited AI critiques, seasonal vaults, and supplier links."
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 px-4 bg-black text-white">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-5xl font-serif uppercase tracking-widest">Ready to Join?</h2>
            <p className="text-xl text-gray-300">
              Unlock the full Technical Hub experience today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://nail-check.com/membership/" target="_blank" rel="noopener noreferrer">
                <Button className={cn("h-16 px-12 text-[11px] uppercase tracking-widest", GOLD_GRADIENT, "text-white")}>
                  Start Your Founder Membership
                </Button>
              </a>
              <a href="/critique">
                <Button variant="outline" className="h-16 px-12 text-[11px] uppercase tracking-widest border-white text-white hover:bg-white hover:text-black">
                  Try AI Critique Free
                </Button>
              </a>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}

function BenefitCard({ icon, title, description, isNew }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isNew?: boolean;
}) {
  return (
    <div className="text-center space-y-4 relative">
      {isNew && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            New
          </span>
        </div>
      )}
      <div className={cn("mx-auto w-fit", isNew ? "text-[#9B5DE5]" : GOLD_TEXT)}>
        {icon}
      </div>
      <h3 className="text-xl font-serif uppercase tracking-wider">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-gray-100 pb-8">
      <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">{question}</h3>
      <p className="text-gray-600 leading-relaxed">{answer}</p>
    </div>
  );
}