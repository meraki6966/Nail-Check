import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Play, MapPin, Calendar, Crown, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// NAIL CHECK COLOR PALETTE
// ============================================
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";

// ============================================
// COMMUNITY GALLERY - 12 images
// ============================================
const COMMUNITY_GALLERY = [
  { id: 1, image: "http://nail-check.com/wp-content/uploads/2026/02/Chrome.png", style: "Chrome Coffin" },
  { id: 2, image: "http://nail-check.com/wp-content/uploads/2026/02/3D-Character.png", style: "3D Character" },
  { id: 3, image: "http://nail-check.com/wp-content/uploads/2026/02/Glass-Nails.png", style: "Glass Effect" },
  { id: 4, image: "http://nail-check.com/wp-content/uploads/2026/02/Bridal-1.png", style: "Bridal" },
  { id: 5, image: "http://nail-check.com/wp-content/uploads/2026/02/Junk.png", style: "Junk Nails" },
  { id: 6, image: "http://nail-check.com/wp-content/uploads/2026/02/Cat-eye.png", style: "Cat Eye" },
  { id: 7, image: "http://nail-check.com/wp-content/uploads/2026/02/Editorial.png", style: "Editorial" },
  { id: 8, image: "http://nail-check.com/wp-content/uploads/2026/02/Classy.png", style: "Classy Minimal" },
  { id: 9, image: "http://nail-check.com/wp-content/uploads/2026/02/Birthday.png", style: "Birthday Set" },
  { id: 10, image: "http://nail-check.com/wp-content/uploads/2026/02/Matte-Sugar.png", style: "Matte Sugar" },
  { id: 11, image: "http://nail-check.com/wp-content/uploads/2026/02/Vacation.jpg", style: "Vacation Set" },
  { id: 12, image: "http://nail-check.com/wp-content/uploads/2026/02/Matching-Set.png", style: "Matching Set" },
];

// ============================================
// TUTORIALS - Learning Lab
// ============================================
const TUTORIALS = [
  { id: 1, title: "Perfect Apex Placement", duration: "12 min", level: "Beginner", image: "http://nail-check.com/wp-content/uploads/2026/02/Apex-Present.png" },
  { id: 2, title: "Chrome Application Secrets", duration: "18 min", level: "Intermediate", image: "http://nail-check.com/wp-content/uploads/2026/02/Chrome.png" },
  { id: 3, title: "3D Flower Sculpting", duration: "25 min", level: "Advanced", image: "http://nail-check.com/wp-content/uploads/2026/02/3D-Character.png" },
  { id: 4, title: "Competition-Ready C-Curve", duration: "20 min", level: "Competition", image: "http://nail-check.com/wp-content/uploads/2026/02/Deep-C-Curve.png" },
];

export default function Home() {
  const [flavorOfMonth, setFlavorOfMonth] = useState({
    title: "Ruby Architecture",
    description: "February focus: High-gloss chrome over structural red sculpting.",
    image: "http://nail-check.com/wp-content/uploads/2026/02/Chrome.png"
  });

  useEffect(() => {
    fetch("https://nail-check.com/wp-json/nail-check/v1/flavor-of-month")
      .then(res => res.json())
      .then(data => setFlavorOfMonth(data))
      .catch(err => console.error("Failed to fetch flavor of month:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-20">

      {/* HERO HEADER */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-5xl md:text-6xl font-serif tracking-widest uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
            Nail Check
          </h1>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Community of nail artists, worldwide
          </p>
        </div>

        {/* 12-IMAGE COMMUNITY GALLERY */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {COMMUNITY_GALLERY.map((item) => (
            <div key={item.id} className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={item.image}
                alt={item.style}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* WELCOME / INTRO */}
      <section className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-serif tracking-wider uppercase bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
          Welcome to Nail Check
        </h2>
        <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
          <p>
            This is a space built for nail artists, by nail artists. Every set in our gallery was created by someone in this community. Real hands, real artistry, real stories from techs around the world.
          </p>
          <p>
            The AI tools, the critique system, the supply suite, they are here to help you imagine, refine, and execute the work you came to do.
          </p>
        </div>
        <div className="pt-4">
          <a href="/styles">
            <Button
              className={cn(
                "px-10 h-14 rounded-full text-sm uppercase tracking-widest text-white",
                PURPLE_GRADIENT,
                "hover:opacity-90"
              )}
            >
              <Wand2 className="mr-2 h-5 w-5" />
              Experience The Design Lab
            </Button>
          </a>
        </div>
      </section>

      {/* LEARNING LAB */}
      <section className="bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-[#9B5DE5]" />
            <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-wider bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
              The Learning Lab
            </h2>
          </div>
          <a href="/the-learning-lab" className="text-sm text-[#9B5DE5] hover:text-[#FF6B9D] font-medium">
            All Tutorials →
          </a>
        </div>
        <p className="text-gray-500 mb-8 max-w-2xl">
          Step-by-step video tutorials from beginner basics to competition-level techniques.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TUTORIALS.map((tutorial) => (
            <div key={tutorial.id} className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer">
              <div className="relative aspect-video">
                <img src={tutorial.image} alt={tutorial.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Play className="h-6 w-6 text-[#FF6B9D] ml-1" />
                  </div>
                </div>
                <span className={cn(
                  "absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white",
                  tutorial.level === "Beginner" && "bg-[#10B981]",
                  tutorial.level === "Intermediate" && "bg-[#F59E0B]",
                  tutorial.level === "Advanced" && "bg-[#EF4444]",
                  tutorial.level === "Competition" && "bg-[#8B5CF6]"
                )}>
                  {tutorial.level}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800">{tutorial.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{tutorial.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLAVOR OF THE MONTH */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-wider bg-gradient-to-r from-[#B08D57] to-[#D4AF37] bg-clip-text text-transparent">
            Flavor of the Month
          </h2>
          <p className="text-sm text-gray-500 italic mt-2">Current focus from the Technical Hub</p>
        </div>
        <div className="relative h-[500px] overflow-hidden rounded-3xl">
          <img src={flavorOfMonth.image} alt={flavorOfMonth.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
            <div className="p-8 text-white">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-2">
                Flavor of the Month
              </span>
              <h3 className="text-3xl font-serif mb-2">{flavorOfMonth.title}</h3>
              <p className="text-sm text-gray-300 italic max-w-md">{flavorOfMonth.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="grid md:grid-cols-4 gap-6">
        <a href="/find-tech" className="group">
          <div className="border border-[#FF6B9D]/20 p-6 rounded-2xl bg-gradient-to-br from-white to-[#FFF5F8]">
            <MapPin className="h-8 w-8 mb-4 text-[#FF6B9D]" />
            <h3 className="text-xl font-serif mb-2 group-hover:text-[#FF6B9D]">Find a Tech</h3>
            <p className="text-sm text-gray-600">Nail techs near you</p>
          </div>
        </a>
        <a href="/saved" className="group">
          <div className="border border-[#9B5DE5]/20 p-6 rounded-2xl bg-gradient-to-br from-white to-[#F8F0FF]">
            <Heart className="h-8 w-8 mb-4 text-[#9B5DE5]" />
            <h3 className="text-xl font-serif mb-2 group-hover:text-[#9B5DE5]">Fire Vault</h3>
            <p className="text-sm text-gray-600">Your saved AI designs</p>
          </div>
        </a>
        <a href="/seasonal" className="group">
          <div className="border border-[#00D9FF]/20 p-6 rounded-2xl bg-gradient-to-br from-white to-[#F0FFFF]">
            <Calendar className="h-8 w-8 mb-4 text-[#00D9FF]" />
            <h3 className="text-xl font-serif mb-2 group-hover:text-[#00D9FF]">Seasonal Vault</h3>
            <p className="text-sm text-gray-600">Curated collections</p>
          </div>
        </a>
        <a href="/supplies" className="group">
          <div className="border border-[#D4AF37]/20 p-6 rounded-2xl bg-gradient-to-br from-white to-[#FFFBF0]">
            <Crown className="h-8 w-8 mb-4 text-[#D4AF37]" />
            <h3 className="text-xl font-serif mb-2 group-hover:text-[#D4AF37]">Supply Suite</h3>
            <p className="text-sm text-gray-600">Professional products</p>
          </div>
        </a>
      </section>
    </div>
  );
}
