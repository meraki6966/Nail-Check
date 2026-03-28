import { motion } from "framer-motion";
import { CreditCard, Sparkles, RefreshCw, ImageIcon, AlertTriangle, UserX, Scale, Mail } from "lucide-react";

const SECTION_FADE = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function SectionHeader({ icon: Icon, title, color }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  color: "pink" | "purple" | "cyan";
}) {
  const colorMap = {
    pink:   { text: "text-[#FF6B9D]", bg: "bg-[#FF6B9D]/10", border: "border-[#FF6B9D]/20" },
    purple: { text: "text-[#9B5DE5]", bg: "bg-[#9B5DE5]/10", border: "border-[#9B5DE5]/20" },
    cyan:   { text: "text-[#00D9FF]", bg: "bg-[#00D9FF]/10", border: "border-[#00D9FF]/20" },
  }[color];

  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`p-2.5 rounded-xl ${colorMap.bg} border ${colorMap.border}`}>
        <Icon className={`h-5 w-5 ${colorMap.text}`} />
      </div>
      <h2 className={`text-2xl font-serif uppercase tracking-widest ${colorMap.text}`}>{title}</h2>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 mt-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#9B5DE5] flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function TierCard({ tier, price, description, features, color }: {
  tier: string;
  price: string;
  description: string;
  features: string[];
  color: "pink" | "purple";
}) {
  const colorMap = {
    pink:   { border: "border-[#FF6B9D]/30", bg: "bg-[#FFF5F8]", badge: "bg-[#FF6B9D] text-white", text: "text-[#FF6B9D]" },
    purple: { border: "border-[#9B5DE5]/30", bg: "bg-[#F8F0FF]", badge: "bg-[#9B5DE5] text-white", text: "text-[#9B5DE5]" },
  }[color];

  return (
    <div className={`border-2 ${colorMap.border} ${colorMap.bg} rounded-2xl p-6`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className={`inline-block text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${colorMap.badge} mb-2`}>
            {tier}
          </span>
          <p className={`text-3xl font-bold ${colorMap.text}`}>{price}<span className="text-sm font-normal text-gray-500">/month</span></p>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${color === "pink" ? "bg-[#FF6B9D]" : "bg-[#9B5DE5]"}`} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TermsOfService() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#FFF5F8] via-[#F8F0FF] to-white px-4 py-20 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#9B5DE5]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#FF6B9D]/8 rounded-full blur-3xl" />

        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <motion.div {...SECTION_FADE}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-[#FF6B9D]" />
              <span className="text-[10px] tracking-[0.8em] text-[#9B5DE5] uppercase font-medium">Legal</span>
              <Sparkles className="h-4 w-4 text-[#FF6B9D]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif uppercase tracking-widest bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-500 text-lg">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto leading-relaxed">
              By using Nail Check, you agree to these terms. Please read them carefully —
              they cover your subscription, AI generation rights, and how we work together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* 1. Subscription Terms */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.1 }}>
            <Card>
              <SectionHeader icon={CreditCard} title="Subscription Terms" color="pink" />
              <p className="text-gray-600 leading-relaxed mb-6">
                Nail Check offers two subscription tiers, both managed through Apple App Store or Google Play Store.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <TierCard
                  tier="Base"
                  price="$8.99"
                  description="Perfect for enthusiasts building their nail design library."
                  color="pink"
                  features={[
                    "20 AI-generated designs per month",
                    "Full access to Design Lab",
                    "Fire Vault (saved designs)",
                    "Seasonal Vault access",
                    "Supply Suite access",
                    "Tutorial library",
                  ]}
                />
                <TierCard
                  tier="Premium"
                  price="$19.99"
                  description="For serious creators who need unlimited creative power."
                  color="purple"
                  features={[
                    "Unlimited AI-generated designs",
                    "Everything in Base",
                    "Priority AI processing",
                    "Early access to new features",
                    "Premium design templates",
                    "Exclusive creator content",
                  ]}
                />
              </div>

              <BulletList items={[
                "Subscriptions are billed monthly starting from your sign-up date",
                "Subscriptions automatically renew each month unless cancelled at least 24 hours before the renewal date",
                "Cancellation must be done through your Apple App Store or Google Play Store subscription settings",
                "Cancelling stops future billing but your access continues until the end of the current billing period",
                "Nail Check does not have direct access to cancel subscriptions on your behalf — all billing is managed by Apple or Google",
                "Subscription pricing may change with reasonable advance notice to subscribers",
              ]} />
            </Card>
          </motion.div>

          {/* 2. AI Generation Limits */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.15 }}>
            <Card>
              <SectionHeader icon={Sparkles} title="AI Generation Limits & Fair Use" color="purple" />
              <div className="space-y-4">
                <div className="bg-[#FFF5F8] border border-[#FF6B9D]/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold uppercase tracking-widest text-[#FF6B9D]">Base Plan</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    20 AI-generated images per calendar month. The counter resets on your monthly renewal date.
                    Unused generations do not roll over to the next month.
                  </p>
                </div>
                <div className="bg-[#F8F0FF] border border-[#9B5DE5]/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold uppercase tracking-widest text-[#9B5DE5]">Premium Plan</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Unlimited AI-generated images, subject to fair use. Automated bulk generation,
                    API scraping, or usage that negatively impacts other users is prohibited.
                  </p>
                </div>
              </div>
              <BulletList items={[
                "AI generations are for personal and professional nail design use only",
                "We reserve the right to apply rate limiting to prevent system abuse",
                "Attempting to circumvent generation limits (e.g., creating multiple accounts) may result in account termination",
                "AI generation quality may vary — results depend on the prompts and reference images provided",
              ]} />
            </Card>
          </motion.div>

          {/* 3. Refund Policy */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.2 }}>
            <Card>
              <SectionHeader icon={RefreshCw} title="Refund Policy" color="cyan" />
              <BulletList items={[
                "All refund requests are processed through Apple App Store or Google Play Store according to their respective refund policies",
                "To request a refund, contact Apple Support (Apple devices) or Google Play Support (Android devices) directly",
                "Nail Check does not issue direct refunds — all billing occurs through Apple or Google",
                "Unused AI generation credits are non-refundable; they expire at the end of each billing period",
                "If you experience a technical issue that prevents you from using the app, contact our support team — we will work with you to find a resolution",
                "Downgrading from Premium to Base takes effect at the start of your next billing cycle",
              ]} />
              <div className="mt-5 p-4 bg-[#FFF5F8] border border-[#FF6B9D]/20 rounded-xl">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-[#FF6B9D]">Having an issue?</span> Contact us at{" "}
                  <a href="mailto:support@nail-check.com" className="text-[#9B5DE5] underline">support@nail-check.com</a>{" "}
                  before seeking a refund — we're happy to help resolve technical problems directly.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* 4. User Content */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.25 }}>
            <Card>
              <SectionHeader icon={ImageIcon} title="User Content & AI Designs" color="pink" />
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Your Uploaded Images</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    You retain full ownership of any images you upload to Nail Check. We do not claim ownership of your photos.
                    By uploading, you grant us a limited license to display and process your images solely to provide the service to you.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">AI-Generated Designs</h3>
                  <BulletList items={[
                    "You have the right to use AI-generated designs you create for personal and professional nail services",
                    "AI designs may not be completely unique — the same prompt submitted by multiple users could produce similar results",
                    "Nail Check does not guarantee that AI-generated designs are free from similarity to existing works",
                    "We do not claim ownership of AI-generated designs you create",
                  ]} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Community Gallery</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    If you choose to submit a design to the public gallery, you grant Nail Check a non-exclusive license to display
                    that design within the app and marketing materials. You can withdraw gallery submissions by contacting support.
                    Gallery participation is always optional and requires your explicit permission.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 5. Prohibited Uses */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.3 }}>
            <Card>
              <SectionHeader icon={AlertTriangle} title="Prohibited Uses" color="purple" />
              <p className="text-gray-600 leading-relaxed mb-2">The following are not permitted on Nail Check:</p>
              <BulletList items={[
                "Generating content that infringes on copyrights, trademarks, or other intellectual property rights",
                "Creating offensive, explicit, hateful, or inappropriate content of any kind",
                "Using AI generation to commercially resell designs in bulk without explicit written permission from Nail Check",
                "Attempting to abuse, overload, or reverse-engineer the AI generation system",
                "Creating multiple accounts to circumvent AI generation limits",
                "Sharing or distributing login credentials with non-subscribers",
                "Using the app to collect data about other users or conduct unauthorized research",
                "Uploading content you do not have the rights to use",
              ]} />
            </Card>
          </motion.div>

          {/* 6. Account Termination */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.35 }}>
            <Card>
              <SectionHeader icon={UserX} title="Account Termination" color="cyan" />
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Your Right to Cancel</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    You may cancel your subscription or delete your account at any time. Cancellation stops future billing.
                    Account deletion removes your data from our systems within a reasonable timeframe,
                    subject to legal retention requirements.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Our Right to Terminate</h3>
                  <BulletList items={[
                    "We reserve the right to suspend or terminate accounts that violate these Terms of Service",
                    "Serious violations (e.g., abuse of AI systems, prohibited content) may result in immediate termination without refund",
                    "We will provide reasonable notice for non-emergency terminations where possible",
                    "Terminated accounts may be permanently banned from re-registering",
                  ]} />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 7. Limitation of Liability */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.4 }}>
            <Card>
              <SectionHeader icon={Scale} title="Limitation of Liability" color="pink" />
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  <span className="font-semibold text-gray-800">App provided "as is": </span>
                  Nail Check is provided without warranties of any kind, express or implied. We do not guarantee uninterrupted access,
                  error-free operation, or that the app will meet your specific requirements.
                </p>
                <p>
                  <span className="font-semibold text-gray-800">No guarantee of results: </span>
                  AI-generated nail designs are creative suggestions only. We do not guarantee any specific aesthetic result,
                  and the quality of AI outputs may vary based on prompts, reference images, and AI model updates.
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Tutorial disclaimer: </span>
                  Nail Check tutorials are for educational purposes only. We are not responsible for any outcomes resulting from
                  following tutorial techniques, including but not limited to damage to nails, skin, or property.
                  Always follow safe practices and consult a professional when in doubt.
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Liability cap: </span>
                  To the maximum extent permitted by law, Nail Check's total liability for any claim shall not exceed
                  the amount you paid for the subscription in the 3 months prior to the claim.
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Governing law: </span>
                  These Terms are governed by applicable laws. Any disputes will be resolved through good-faith negotiation
                  before pursuing other legal remedies.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* 8. Contact */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.45 }}>
            <Card>
              <SectionHeader icon={Mail} title="Contact Us" color="cyan" />
              <p className="text-gray-600 leading-relaxed">
                Questions about these Terms? Need help with your subscription or account? We're here to help.
              </p>
              <div className="mt-5 p-5 bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] rounded-xl border border-[#FF6B9D]/20">
                <p className="font-semibold text-gray-800 mb-1">Nail Check Support</p>
                <p className="text-[#9B5DE5] font-medium">
                  📧 <a href="mailto:support@nail-check.com" className="underline hover:text-[#FF6B9D] transition-colors">
                    support@nail-check.com
                  </a>
                </p>
                <p className="text-sm text-gray-500 mt-2">We typically respond within 2–3 business days.</p>
              </div>
            </Card>
          </motion.div>

          {/* Footer note */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.5 }}>
            <p className="text-center text-sm text-gray-400 pb-8">
              These Terms of Service may be updated periodically. We will notify you of material changes via the app or email.
              Continued use of Nail Check after updates constitutes your acceptance of the revised Terms.
            </p>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
