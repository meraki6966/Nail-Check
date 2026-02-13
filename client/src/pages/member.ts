import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const GOLD_TEXT = "text-[#B08D57]";
const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]";

const FOUNDER_BENEFITS = [
  "Unlimited AI design generations",
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
                
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-serif uppercase tracking-wider">Founder Member</h3>
                    <Crown className={cn("h-8 w-8", GOLD_TEXT)} />
                  </div>
                  <p className={cn("italic mb-6", GOLD_TEXT)}>Full technical access</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">$29</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">or $290/year (save $58)</p>
                </div>

                <div className="space-y-4 mb-8">
                  {FOUNDER_BENEFITS.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className={cn("h-5 w-5 flex-shrink-0 mt-0.5", GOLD_TEXT)} />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button className={cn("w-full h-14 uppercase text-[10px] tracking-widest", GOLD_GRADIENT, "text-white")}>
                  Become a Founder Member
                </Button>
                
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

            <div className="grid md:grid-cols-3 gap-12">
              <BenefitCard
                icon={<Sparkles className="h-10 w-10" />}
                title="Unlimited Creation"
                description="Generate as many AI designs as you want. No daily limits, no restrictions."
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
                answer="Yes! All guests get 1 free AI generation to test the Design Lab. You can browse the seasonal collections and Supply Suite (without product links) before committing to membership."
              />
              <FAQItem
                question="What payment methods do you accept?"
                answer="We accept all major credit cards (Visa, Mastercard, Amex, Discover) and digital wallets. Payments are processed securely through Stripe."
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
                question="What's the difference between monthly and yearly?"
                answer="Both plans include all features. Yearly members save $58 (equivalent to 2 months free) and lock in the current price for the year."
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
            <Button className={cn("h-16 px-12 text-[11px] uppercase tracking-widest", GOLD_GRADIENT, "text-white")}>
              Start Your Founder Membership
            </Button>
          </div>
        </section>

      </div>
    </Layout>
  );
}

function BenefitCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center space-y-4">
      <div className={cn("mx-auto w-fit", GOLD_TEXT)}>
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