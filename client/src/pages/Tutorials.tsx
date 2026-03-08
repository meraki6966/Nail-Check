import { useState } from "react";
import { BookOpen, Play, ChevronDown, ChevronUp, Sparkles, Clock, Package, Video, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FAQItem {
  question: string;
  answer: string;
}

interface SupplyCategory {
  title: string;
  emoji: string;
  items: { name: string; note?: string }[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const NAIL_PREP_STEPS = [
  { step: 1, title: "Remove old product", detail: "Use acetone soak or e-file to fully remove any old gel, acrylic, or polish. Never rip or peel." },
  { step: 2, title: "Shape & file natural nail", detail: "File the free edge to your desired shape. Move in one direction to prevent splitting." },
  { step: 3, title: "Push back & trim cuticles", detail: "Use a cuticle pusher to gently push back the cuticle. Nip only the dead skin — never live tissue." },
  { step: 4, title: "Buff the nail plate", detail: "Lightly buff the surface with a 180–220 grit buffer to remove shine and create texture for adhesion." },
  { step: 5, title: "Dust & wipe", detail: "Brush away dust with a clean nail brush, then wipe each nail with a lint-free wipe soaked in 99% isopropyl alcohol." },
  { step: 6, title: "Apply dehydrator", detail: "Swipe a dehydrator (e.g., Young Nails Protein Bond or IBD Desiccant) over every nail. Let it evaporate fully — do NOT wipe off." },
  { step: 7, title: "Apply primer (if needed)", detail: "For acrylics or hard gel: apply a thin coat of acid-based or acid-free primer and let it dry. Skip for builder gel." },
];

const GEL_X_STEPS = [
  { step: 1, title: "Complete full nail prep", detail: "Follow all 7 prep steps above. Gel X lives and dies by prep — it WILL lift if you skip." },
  { step: 2, title: "Apply base gel (slip layer)", detail: "Apply a thin, even coat of Apres Extend Gel or your preferred builder gel to the entire nail plate. Don't cure yet." },
  { step: 3, title: "Size & fit the Gel X tip", detail: "Select the tip that covers the nail sidewall to sidewall with no gaps. File down to size if needed." },
  { step: 4, title: "Apply adhesive to tip (optional)", detail: "Add a small dot of extend gel to the inside apex of the tip for extra bond." },
  { step: 5, title: "Press & hold", detail: "Align the tip at the cuticle area, press down at a 45° angle, then lay flat. Hold with firm pressure for 10–15 seconds." },
  { step: 6, title: "Cure", detail: "Cure under LED/UV lamp for 60 seconds. Wipe the sticky inhibition layer with a lint-free wipe + IPA." },
  { step: 7, title: "Shape & refine", detail: "Use an e-file or hand file to shape the tip, thin out the apex if needed, and refine the sidewalls." },
  { step: 8, title: "Design & top coat", detail: "Apply your nail art, then seal with a top coat. Cure and wipe for a glossy finish." },
];

const ACRYLIC_STEPS = [
  { step: 1, title: "Complete full nail prep", detail: "All 7 prep steps including dehydrator AND primer. With acrylics, primer is non-negotiable." },
  { step: 2, title: "Apply tip or form", detail: "Glue on a nail tip or fit a nail form under the free edge and pinch it to match the natural nail's C-curve." },
  { step: 3, title: "Mix your bead", detail: "Dip your brush into monomer, wipe off the excess on the rim, then pick up acrylic powder. A wet, glossy bead = correct ratio." },
  { step: 4, title: "Place zone 3 first (free edge)", detail: "Place the first bead at zone 3 (tip). Gently pat and press to spread — never wipe or drag." },
  { step: 5, title: "Build zone 2 (apex)", detail: "Pick up a slightly larger bead and place at the stress point (zone 2). Shape the apex for strength — this is the highest point." },
  { step: 6, title: "Blend zone 1 (cuticle area)", detail: "Use a small, wet bead to blend the product at zone 1. Keep it thin — product touching the cuticle will lift." },
  { step: 7, title: "Remove form, shape & file", detail: "Once product has fully hardened (no warmth), remove the form. File the entire nail with a 100/180 grit file to shape and smooth." },
  { step: 8, title: "Buff & finish", detail: "Buff the surface with a 220 buffer until smooth. Apply top coat or gel top, cure, and wipe." },
];

const FAQS: FAQItem[] = [
  {
    question: "Why does my gel keep lifting at the cuticle?",
    answer: "Lifting at the cuticle is almost always a prep issue. Make sure you're pushing back the cuticle completely and wiping that area with IPA before applying any product. Product should never touch live skin. Also check that you're not flooding the cuticle area when applying base coat.",
  },
  {
    question: "What's the difference between Gel X and hard gel extensions?",
    answer: "Gel X uses pre-made soft gel tips bonded with extend/builder gel — they're flexible and soak off with acetone. Hard gel extensions are hand-sculpted with a firmer gel product that must be filed off. Gel X is faster and great for beginners; hard gel gives you more shape control.",
  },
  {
    question: "How do I prevent bubbles in my gel polish?",
    answer: "Bubbles usually happen when the polish is shaken (not rolled), applied too thick, or cured too close to the lamp. Always roll the bottle between your palms, apply thin coats, and flash-cure for 10 seconds before a full cure.",
  },
  {
    question: "My acrylic is yellowing — what's causing it?",
    answer: "Yellowing can come from UV exposure (sunscreen and sunlight break down acrylic), poor-quality monomer, or curing issues. Use a UV-protective top coat, store your products away from direct sunlight, and invest in a reputable monomer brand.",
  },
  {
    question: "How long should I wait between coats?",
    answer: "For gel: cure each layer per the lamp manufacturer's instructions (usually 30–60 sec LED, 2 min UV). For acrylic: wait until the bead has set before adding the next zone — rushing causes lifting and cracking.",
  },
  {
    question: "Can I use regular nail polish over gel base?",
    answer: "Yes! You can apply regular nail polish over a cured gel base coat. Just make sure the base is fully cured and wiped. Finish with a no-wipe gel top coat cured over the regular polish to seal everything.",
  },
  {
    question: "What nail shape is best for short nail beds?",
    answer: "Oval or almond shapes create the illusion of length on shorter nail beds. Avoid square shapes if you want your fingers to look longer — they emphasize width.",
  },
  {
    question: "How do I fix a broken acrylic nail at home?",
    answer: "For a small crack: clean the nail, apply a tiny amount of nail glue, press together, and file smooth. For a full break: soak off the entire nail and redo it. Never try to glue a nail that has broken at or near the stress point — it won't hold.",
  },
];

const TIDBITS = [
  { emoji: "💡", tip: "Less is more. Thin layers = better adhesion. Thick product is the #1 cause of lifting and cracking." },
  { emoji: "🌡️", tip: "Temperature affects acrylic. Cold rooms = slow set; hot rooms = fast set. Adjust your monomer ratio accordingly." },
  { emoji: "🧴", tip: "Apply cuticle oil every single day. Hydrated skin and nails improve retention more than any product." },
  { emoji: "🔆", tip: "Cure time matters. Under-curing is just as problematic as over-curing. Follow your lamp's instructions exactly." },
  { emoji: "✋", tip: "Don't touch the nail plate after IPA wipe. Your skin's natural oils will immediately compromise adhesion." },
  { emoji: "📐", tip: "The apex (zone 2) is your nail's stress point. Build it thicker here — this is where most breaks happen." },
  { emoji: "🧪", tip: "Not all products play well together. Stick to one brand system when possible, especially with gel and top coat." },
  { emoji: "🪮", tip: "Your e-file grit matters. Use 80/100 for product removal, 150/180 for shaping, 220+ for buffing to smooth." },
];

const RETENTION_SUPPLIES: SupplyCategory[] = [
  {
    title: "Step 1 — Nail Prep",
    emoji: "🧹",
    items: [
      { name: "E-file or hand file (100/180 grit)", note: "Remove shine from the natural nail" },
      { name: "Nail brush", note: "Sweep away dust" },
      { name: "Lint-free wipes", note: "For IPA application — never cotton balls" },
      { name: "99% Isopropyl Alcohol (IPA)", note: "Clean and dehydrate nail plate" },
    ],
  },
  {
    title: "Step 2 — Dehydration",
    emoji: "💧",
    items: [
      { name: "Nail dehydrator", note: "Young Nails Protein Bond, IBD Desiccant, or Mia Secret Dehydrator" },
      { name: "Application tip", note: "Apply and let fully evaporate — do NOT wipe off" },
    ],
  },
  {
    title: "Step 3 — Adhesion / Primer",
    emoji: "🔗",
    items: [
      { name: "Acid-free primer", note: "For gel and Gel X — Modelones, Beetles, or Apres Nail" },
      { name: "Acid-based primer", note: "For acrylic only — use sparingly (Young Nails, NSI)" },
      { name: "Key rule", note: "Primer is the #1 retention booster — never skip with acrylics" },
    ],
  },
  {
    title: "Step 4 — Base / Build Product",
    emoji: "🏗️",
    items: [
      { name: "Builder gel / Base gel", note: "Apres Extend Gel, Modelones Builder Gel, or Beetles Builder" },
      { name: "Bond-strengthening base coat", note: "For natural nails — OPI Bond-Aid or Orly Bonder" },
    ],
  },
  {
    title: "Step 5 — Seal & Protect",
    emoji: "✨",
    items: [
      { name: "No-wipe top coat (gel)", note: "Prevents chipping and adds durability" },
      { name: "UV-protective top coat", note: "Reduces yellowing from sun exposure" },
      { name: "Cuticle oil", note: "Apply daily — hydrated skin = better retention at the cuticle" },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">{emoji}</span>
        <h2 className="text-2xl font-serif text-gray-800">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-500 ml-11">{subtitle}</p>}
    </div>
  );
}

function StepList({ steps }: { steps: { step: number; title: string; detail: string }[] }) {
  return (
    <div className="space-y-4">
      {steps.map((s) => (
        <div key={s.step} className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#9B5DE5] to-[#FF6B9D] flex items-center justify-center text-white text-sm font-bold">
            {s.step}
          </div>
          <div className="flex-1 pt-0.5">
            <p className="font-semibold text-gray-800 text-sm mb-0.5">{s.title}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{s.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-[#F0D6F5] rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-[#FFF5F8] transition-colors"
          >
            <span className="font-medium text-gray-800 text-sm pr-4">{item.question}</span>
            {openIndex === i ? (
              <ChevronUp className="h-4 w-4 text-[#9B5DE5] flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#9B5DE5] flex-shrink-0" />
            )}
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-[#F0D6F5] pt-3">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TidbitCard({ emoji, tip }: { emoji: string; tip: string }) {
  return (
    <div className="flex gap-3 p-4 bg-white border border-[#F0D6F5] rounded-xl">
      <span className="text-xl flex-shrink-0">{emoji}</span>
      <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
    </div>
  );
}

function SupplySection({ category }: { category: SupplyCategory }) {
  return (
    <div className="bg-white border border-[#F0D6F5] rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#9B5DE5]/10 to-[#FF6B9D]/10 px-4 py-3 flex items-center gap-2">
        <span className="text-lg">{category.emoji}</span>
        <span className="font-semibold text-gray-800 text-sm">{category.title}</span>
      </div>
      <ul className="divide-y divide-[#F0D6F5]">
        {category.items.map((item, i) => (
          <li key={i} className="px-4 py-3 flex items-start gap-2">
            <span className="text-[#FF6B9D] font-bold mt-0.5">•</span>
            <div>
              <span className="text-sm font-medium text-gray-800">{item.name}</span>
              {item.note && <span className="text-sm text-gray-500"> — {item.note}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VideoComingSoonCard() {
  return (
    <div className="bg-white border-2 border-dashed border-[#D6A9F0] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9B5DE5]/20 to-[#FF6B9D]/20 flex items-center justify-center">
        <Video className="h-8 w-8 text-[#9B5DE5]/60" />
      </div>
      <p className="text-sm font-medium text-gray-500">Coming Soon</p>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "stepbystep", label: "Step-by-Step", emoji: "📋" },
  { id: "faq", label: "FAQ & Tidbits", emoji: "💬" },
  { id: "supplies", label: "Supplies & Retention", emoji: "📦" },
  { id: "videos", label: "Video Tutorials", emoji: "🎬" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Tutorials() {
  const [activeTab, setActiveTab] = useState<TabId>("stepbystep");
  const [activeGuide, setActiveGuide] = useState<"prep" | "gelx" | "acrylic">("prep");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBFC] to-[#FFF5F8]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <BookOpen className="h-4 w-4" />
            <span>Nail Education Hub</span>
          </div>
          <h1 className="text-4xl font-serif mb-3">Tutorial Library</h1>
          <p className="text-white/90 max-w-xl">
            Everything you need to level up — from your very first set to flawless retention. 
            Step-by-steps, tips, product guides, and video collabs coming soon.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-[#9B5DE5]"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* TAB 1 — Step-by-Step Guides */}
        {activeTab === "stepbystep" && (
          <div>
            <SectionHeader
              emoji="📋"
              title="Basic Step-by-Steps"
              subtitle="Follow these guides in order for every single set. Shortcuts = lifting."
            />
            <div className="flex gap-2 mb-8 flex-wrap">
              {(["prep", "gelx", "acrylic"] as const).map((g) => (
                <Button
                  key={g}
                  variant={activeGuide === g ? "default" : "outline"}
                  onClick={() => setActiveGuide(g)}
                  className={`rounded-full text-sm ${
                    activeGuide === g ? "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] text-white border-0" : ""
                  }`}
                >
                  {g === "prep" && "🧹 Nail Prep"}
                  {g === "gelx" && "💅 Gel X Extensions"}
                  {g === "acrylic" && "💎 Acrylic Extensions"}
                </Button>
              ))}
            </div>

            {activeGuide === "prep" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F0D6F5]">
                <h3 className="text-lg font-serif text-gray-800 mb-1">Nail Prep — The Foundation of Everything</h3>
                <p className="text-sm text-gray-500 mb-6">This prep sequence applies to <strong>all</strong> services — gel polish, Gel X, builder gel, acrylic. Skipping any step is the leading cause of lifting and peeling.</p>
                <StepList steps={NAIL_PREP_STEPS} />
                <div className="mt-8 p-4 bg-[#FFF5F8] rounded-xl border border-[#FFDDE8]">
                  <h4 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#FF6B9D]" /> What You'll Need for Prep
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li>• Cuticle pusher + nippers</li>
                    <li>• 180 or 220 grit buffer block</li>
                    <li>• Clean nail brush</li>
                    <li>• Lint-free wipes</li>
                    <li>• 99% Isopropyl Alcohol</li>
                    <li>• Dehydrator (Young Nails Protein Bond, IBD Desiccant, or similar)</li>
                    <li>• Primer — acid-free for gel/Gel X; acid-based for acrylics</li>
                  </ul>
                </div>
              </div>
            )}

            {activeGuide === "gelx" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F0D6F5]">
                <h3 className="text-lg font-serif text-gray-800 mb-1">Gel X Extensions</h3>
                <p className="text-sm text-gray-500 mb-6">Gel X (soft gel tips) are the fastest way to add length. They soak off with acetone and are beginner-friendly. Always complete full nail prep before starting.</p>
                <StepList steps={GEL_X_STEPS} />
                <div className="mt-8 p-4 bg-[#FFF5F8] rounded-xl border border-[#FFDDE8]">
                  <h4 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#FF6B9D]" /> Gel X Product List
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li>• <strong>All nail prep products</strong> (see Prep guide)</li>
                    <li>• Gel X tips kit (Apres, Beetles, or Modelones tip boxes)</li>
                    <li>• Builder / Extend Gel (Apres Extend Gel, Modelones Builder Gel)</li>
                    <li>• UV/LED nail lamp (36W+ recommended)</li>
                    <li>• Gel brush (flat or oval)</li>
                    <li>• Lint-free wipes + IPA (to wipe inhibition layer)</li>
                    <li>• E-file or hand file (180 grit for shaping)</li>
                    <li>• No-wipe gel top coat</li>
                  </ul>
                </div>
              </div>
            )}

            {activeGuide === "acrylic" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F0D6F5]">
                <h3 className="text-lg font-serif text-gray-800 mb-1">Acrylic Extensions</h3>
                <p className="text-sm text-gray-500 mb-6">Acrylics give you maximum control over shape and structure. They require more practice but deliver unmatched durability. Full nail prep (all 7 steps, including acid primer) is required.</p>
                <StepList steps={ACRYLIC_STEPS} />
                <div className="mt-8 p-4 bg-[#FFF5F8] rounded-xl border border-[#FFDDE8]">
                  <h4 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#FF6B9D]" /> Acrylic Product List
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li>• <strong>All nail prep products</strong> (see Prep guide)</li>
                    <li>• <strong>Acid-based primer</strong> — Young Nails, NSI, or Mia Secret</li>
                    <li>• Acrylic monomer (liquid) — matching brand to powder</li>
                    <li>• Acrylic powder (clear, pink, or white)</li>
                    <li>• Kolinsky acrylic brush (size 8–12)</li>
                    <li>• Nail tips or nail forms</li>
                    <li>• Nail glue (if using tips)</li>
                    <li>• 100/180 grit nail file</li>
                    <li>• 220 grit buffer</li>
                    <li>• Top coat (gel or regular)</li>
                    <li>• Dappen dish for monomer</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2 — FAQ & Tidbits */}
        {activeTab === "faq" && (
          <div className="space-y-10">
            <div>
              <SectionHeader emoji="💬" title="Frequently Asked Questions" subtitle="Real questions, real answers — no fluff." />
              <FAQAccordion items={FAQS} />
            </div>
            <div>
              <SectionHeader emoji="✨" title="Tricks & Tidbits" subtitle="The things nobody tells you until you've made the mistake." />
              <div className="grid sm:grid-cols-2 gap-3">
                {TIDBITS.map((t, i) => (
                  <TidbitCard key={i} emoji={t.emoji} tip={t.tip} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3 — Supplies & Retention */}
        {activeTab === "supplies" && (
          <div>
            <SectionHeader emoji="📦" title="Supplies & Retention Guide" subtitle="Products in the exact order they should be applied — from bare nail to finished set." />
            <p className="text-sm text-gray-500 mb-6 -mt-2">Retention = longevity. Every product in this list serves a specific purpose in the adhesion chain. Use them in order, let each step fully do its job, and your sets will last.</p>
            <div className="space-y-4">
              {RETENTION_SUPPLIES.map((cat, i) => (
                <SupplySection key={i} category={cat} />
              ))}
            </div>
            <div className="mt-8 p-5 bg-gradient-to-r from-[#9B5DE5]/10 to-[#FF6B9D]/10 rounded-2xl border border-[#F0D6F5]">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-[#FF6B9D]" />
                <span className="font-semibold text-gray-800 text-sm">Top Retention Boosters</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✅ <strong>Dehydrator</strong> — removes moisture & oils from the nail plate (apply and let evaporate, never wipe)</li>
                <li>✅ <strong>Primer</strong> — creates a chemical bond between nail plate and product (essential for acrylics)</li>
                <li>✅ <strong>Cuticle oil daily</strong> — keeps skin flexible and prevents micro-lifting at the cuticle</li>
                <li>✅ <strong>Thin layers</strong> — thick product = more points of failure</li>
                <li>✅ <strong>Cap the free edge</strong> — seal the tip with every coat to prevent chipping and moisture entry</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4 — Videos Coming Soon */}
        {activeTab === "videos" && (
          <div>
            <div className="bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] text-white rounded-2xl p-8 mb-10 text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Video className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-serif mb-2">Video Tutorials Coming Soon</h2>
              <p className="text-white/90 max-w-md mx-auto text-sm leading-relaxed">
                We're working with some incredible nail artists and educators to bring you step-by-step video collabs. 
                Check back soon — it's going to be worth the wait. 💅
              </p>
            </div>
            <SectionHeader emoji="🎬" title="What's Coming" subtitle="A preview of the tutorial categories we're filming" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Nail Prep Masterclass",
                "Gel X Start to Finish",
                "Acrylic for Beginners",
                "Ombre & Gradient Techniques",
                "Chrome & Mirror Powder",
                "Nail Art Design Walk-Throughs",
                "How to Fix Common Mistakes",
                "Client Consultation Tips",
                "Press-On Application",
              ].map((title) => (
                <div key={title} className="bg-white rounded-2xl overflow-hidden border border-[#F0D6F5] shadow-sm">
                  <VideoComingSoonCard />
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-700">{title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}