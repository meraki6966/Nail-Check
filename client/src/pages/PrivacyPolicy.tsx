import { motion } from "framer-motion";
import { Shield, Database, Eye, Lock, UserCheck, Mail, Sparkles } from "lucide-react";

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

export default function PrivacyPolicy() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#FFF5F8] via-[#F8F0FF] to-white px-4 py-20 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#FF6B9D]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#9B5DE5]/8 rounded-full blur-3xl" />

        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <motion.div {...SECTION_FADE}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-[#FF6B9D]" />
              <span className="text-[10px] tracking-[0.8em] text-[#9B5DE5] uppercase font-medium">Legal</span>
              <Sparkles className="h-4 w-4 text-[#FF6B9D]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif uppercase tracking-widest bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-lg">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto leading-relaxed">
              At Nail Check, we take your privacy seriously. This policy explains exactly what we collect,
              why we collect it, and how it's protected.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* 1. Information We Collect */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.1 }}>
            <Card>
              <SectionHeader icon={Database} title="Information We Collect" color="pink" />
              <p className="text-gray-600 leading-relaxed">
                We collect the minimum information necessary to provide you with a great experience in the Nail Check app.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Account Information</h3>
                  <BulletList items={[
                    "Email address and display name when you create an account",
                    "Profile information you choose to provide",
                    "Authentication credentials (stored securely — passwords are hashed, never stored in plain text)",
                  ]} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Content You Create</h3>
                  <BulletList items={[
                    "AI-generated nail designs you create using the Design Lab",
                    "Images you upload to the app",
                    "Designs you save, favorite, or add to your Fire Vault",
                    "Preferences, settings, and collections you create",
                  ]} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Payment Information</h3>
                  <BulletList items={[
                    "Subscriptions are processed entirely through Apple App Store or Google Play Store",
                    "We do not store your credit card number, billing address, or payment credentials",
                    "We only receive confirmation of subscription status from Apple/Google",
                  ]} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Usage Data</h3>
                  <BulletList items={[
                    "Features you use and how you interact with the app",
                    "Device type and operating system (for compatibility)",
                    "Anonymous analytics to help us improve the experience",
                    "Cookies and local storage for session management and preferences",
                  ]} />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 2. How We Use Your Information */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.15 }}>
            <Card>
              <SectionHeader icon={Eye} title="How We Use Your Information" color="purple" />
              <p className="text-gray-600 leading-relaxed">Your information is used only to power the features you love and improve the platform.</p>
              <BulletList items={[
                "Provide AI nail design generation via the Google Gemini API — your prompts and images are processed to generate your designs",
                "Manage your subscription and verify your access tier (Base or Premium)",
                "Track your monthly AI generation usage (20/month on Base; unlimited on Premium)",
                "Personalize your experience, including saved designs, recommendations, and seasonal collections",
                "Send optional app notifications and product updates (you can opt out at any time)",
                "Improve app features, fix bugs, and develop new tools based on aggregate usage patterns",
                "Respond to your support requests and feedback",
              ]} />
            </Card>
          </motion.div>

          {/* 3. Third-Party Services */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.2 }}>
            <Card>
              <SectionHeader icon={Shield} title="Third-Party Services" color="cyan" />
              <p className="text-gray-600 leading-relaxed mb-5">
                Nail Check integrates with trusted third-party services to deliver core functionality. Each provider has their own privacy policy.
              </p>

              <div className="space-y-5">
                <div className="border border-[#FF6B9D]/20 rounded-xl p-5 bg-[#FFF5F8]">
                  <h3 className="font-semibold text-gray-800 mb-1">Google Gemini API</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Powers all AI image generation in the Design Lab. When you generate a design, your prompt and any reference images are sent to Google's Gemini API for processing. Google's data handling is governed by{" "}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#9B5DE5] underline">
                      Google's Privacy Policy
                    </a>.
                  </p>
                </div>

                <div className="border border-[#9B5DE5]/20 rounded-xl p-5 bg-[#F8F0FF]">
                  <h3 className="font-semibold text-gray-800 mb-1">Apple App Store & Google Play Store</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    All subscription billing is handled by Apple or Google depending on your device. We do not process payments directly. Their billing policies and data practices apply to all payment transactions.
                  </p>
                </div>

                <div className="border border-[#00D9FF]/20 rounded-xl p-5 bg-[#F0FFFE]">
                  <h3 className="font-semibold text-gray-800 mb-1">Analytics Providers</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We use anonymous, aggregate analytics to understand how features are used and where we can improve. We do not sell analytics data or use it to identify individual users.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 4. Data Storage and Security */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.25 }}>
            <Card>
              <SectionHeader icon={Lock} title="Data Storage & Security" color="pink" />
              <BulletList items={[
                "Your data is stored on secure, encrypted servers with access controls and regular security audits",
                "Passwords are hashed using industry-standard bcrypt — we cannot see your password",
                "All data transmitted between your device and our servers is encrypted via HTTPS/TLS",
                "AI-generated designs and uploaded images are stored securely and linked only to your account",
                "You own your uploaded images. AI-generated designs you create are yours to use",
                "We retain your data for as long as your account is active, plus a reasonable period after deletion for legal and safety purposes",
              ]} />
            </Card>
          </motion.div>

          {/* 5. Your Rights */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.3 }}>
            <Card>
              <SectionHeader icon={UserCheck} title="Your Rights" color="purple" />
              <p className="text-gray-600 leading-relaxed mb-4">You are in control of your data. You have the right to:</p>
              <BulletList items={[
                "Access your data — request a copy of the personal information we hold about you",
                "Correct your data — update your account information at any time through your profile settings",
                "Delete your account — permanently remove your account and associated data by contacting us",
                "Opt out of analytics — disable non-essential analytics tracking in your app settings",
                "Opt out of notifications — manage notification preferences at any time",
                "Data portability — request an export of your designs and saved content",
              ]} />
              <p className="text-sm text-gray-500 mt-5 leading-relaxed">
                To exercise any of these rights, contact us at the email address below. We will respond within 30 days.
              </p>
            </Card>
          </motion.div>

          {/* 6. Contact */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.35 }}>
            <Card>
              <SectionHeader icon={Mail} title="Contact Us" color="cyan" />
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, how we handle your data, or to exercise your privacy rights, please contact us:
              </p>
              <div className="mt-5 p-5 bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] rounded-xl border border-[#FF6B9D]/20">
                <p className="font-semibold text-gray-800 mb-1">Nail Check Privacy Team</p>
                <p className="text-[#9B5DE5] font-medium">
                  📧 <a href="mailto:support@nail-check.com" className="underline hover:text-[#FF6B9D] transition-colors">
                    support@nail-check.com
                  </a>
                </p>
                <p className="text-sm text-gray-500 mt-2">We aim to respond to all privacy inquiries within 30 business days.</p>
              </div>
            </Card>
          </motion.div>

          {/* Footer note */}
          <motion.div {...SECTION_FADE} transition={{ delay: 0.4 }}>
            <p className="text-center text-sm text-gray-400 pb-8">
              This Privacy Policy may be updated from time to time. We will notify you of significant changes via the app or email.
              Continued use of Nail Check after changes constitutes acceptance of the updated policy.
            </p>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
