import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, X, Download, UploadCloud, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth"; 

// --- BRAND CONSTANTS ---
const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]";
const GOLD_TEXT = "text-[#B08D57]";
const GOLD_BORDER = "border-[#B08D57]";

const LOADING_MESSAGES = [
  "Analyzing Your Canvas...",
  "Applying Founder's Precision...",
  "Refining Architecture...",
  "Finalizing NYC High-Gloss..."
];

// --- DATA FOR VAULTS & SUPPLIES ---
const STYLE_VAULT_DATA = [
  { id: "v1", title: "Architectural Stiletto", description: "Proprietary structural silhouettes with reinforced apex positioning.", category: "Sculpted" },
  { id: "v2", title: "Manhattan Minimalist", description: "Precision cuticle work using NYC-inspired buffer ratios.", category: "Minimal" },
];

const SUPPLY_SUITE_DATA = [
  { id: "s1", name: "High-Gloss Structural Gel", brand: "Founder's Choice", utility: "Essential for 3D sculpting." },
  { id: "s2", name: "Precision Detail Brush", brand: "Technical Hub", utility: "Custom bristles for surgical linework." },
];

const SEASONAL_DATA = [
  { id: "1", title: "French Chrome", category: "Spring", url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800" },
  { id: "2", title: "Technical Gold", category: "Summer", url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800" }
];

export default function Home() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // --- NANO BANANA / AI STATE ---
  const [aiPrompt, setAiPrompt] = useState("");
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // --- LOCAL GALLERY STATE (Save Option) ---
  const [localVault, setLocalVault] = useState<{url: string, id: string}[]>(() => {
    const saved = localStorage.getItem("nailCheckGallery");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("nailCheckGallery", JSON.stringify(localVault));
  }, [localVault]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // --- HANDLERS ---
  const handleCanvasUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCanvasImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: aiPrompt,
          image: canvasImage, 
          type: canvasImage ? "image-to-image" : "text-to-image"
        }),
      });
      const data = await response.json();
      setGeneratedImage(`data:${data.mimeType};base64,${data.b64_json}`);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!generatedImage) return;
    
    setIsSaving(true);
    try {
      // Save to database via API
      const response = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: generatedImage,
          prompt: aiPrompt,
          canvasImageUrl: canvasImage,
          tags: [],
          userId: user?.id,
        }),
      });
      
      if (response.ok) {
        const savedDesign = await response.json();
        // Also save to local vault for instant UI update
        const newEntry = { url: generatedImage, id: savedDesign.id.toString() };
        setLocalVault(prev => [newEntry, ...prev]);
        
        // Success feedback
        alert("🔥 Saved to Fire Vault!");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving to vault:", error);
      alert("❌ Failed to save design. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-32">

        {/* --- SECTION 1: THE DESIGN LAB (AI Upload & Save) --- */}
        <section id="design-lab" className="space-y-12">
          <header className="text-center space-y-4">
            <span className="text-[10px] tracking-[0.8em] text-gray-400 uppercase">The Technical Hub</span>
            <h1 className={cn("text-6xl font-serif tracking-widest uppercase", GOLD_TEXT)}>Design Lab</h1>
          </header>

          <div className="bg-white border border-gray-100 p-10 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#B08D57] to-transparent opacity-50"></div>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left: Upload & Input */}
              <div className="space-y-8">
                <div className={cn("border rounded-none p-2 min-h-[300px] flex items-center justify-center bg-gray-50/50", canvasImage ? GOLD_BORDER : "border-gray-200")}>
                  {canvasImage ? (
                    <div className="relative w-full h-full p-2">
                      <img src={canvasImage} className="object-cover w-full h-[280px]" alt="Canvas" />
                      <Button size="icon" variant="ghost" className="absolute top-4 right-4 bg-white/80" onClick={() => setCanvasImage(null)}><X className="h-4 w-4 text-red-800" /></Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-4">
                      <UploadCloud className="h-8 w-8 text-gray-300" />
                      <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Upload Canvas</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleCanvasUpload} />
                    </label>
                  )}
                </div>
                <Input placeholder="Vision Instruction..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="h-14 rounded-none border-gray-200 focus:border-[#B08D57]" />
                <Button onClick={handleGenerate} disabled={isGenerating || (!aiPrompt && !canvasImage)} className={cn("w-full h-16 rounded-none font-bold tracking-widest text-[11px] uppercase", GOLD_GRADIENT, "text-white")}>
                  {isGenerating ? <Loader2 className="animate-spin h-4 w-4" /> : "Render Vision 🔥"}
                </Button>
              </div>

              {/* Right: Output */}
              <div className="border border-gray-100 bg-gray-50/30 flex flex-col items-center justify-center relative aspect-square h-full">
                {isGenerating ? (
                  <div className="text-center p-10 space-y-4">
                    <Loader2 className={cn("h-8 w-8 animate-spin mx-auto", GOLD_TEXT)} />
                    <p className="text-[10px] uppercase tracking-widest text-[#B08D57] animate-pulse">{LOADING_MESSAGES[loadingMsgIdx]}</p>
                  </div>
                ) : generatedImage ? (
                  <div className="w-full h-full relative group">
                    <img src={generatedImage} className="w-full h-full object-cover" alt="Result" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button 
                        onClick={handleSaveToVault} 
                        disabled={isSaving}
                        className="bg-white text-black rounded-none px-6 text-[10px] uppercase font-bold hover:bg-[#B08D57] hover:text-white transition-colors"
                      >
                        {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : "🔥 Save to Fire Vault"}
                      </Button>
                      <Button variant="outline" size="icon" className="bg-white/10 text-white border-white/20 rounded-none"><Download className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center opacity-30"><Sparkles className="h-8 w-8 mx-auto text-gray-300" /><p className="text-[10px] uppercase italic">Waiting for Vision...</p></div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: RECENTLY AUTHORED (The AI Saved Gallery) --- */}
        <AnimatePresence>
          {localVault.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pt-12 border-t border-gray-100">
              <h3 className="text-[10px] tracking-[0.5em] uppercase font-bold text-gray-500">Recently Authored</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {localVault.slice(0, 5).map(item => (
                  <img key={item.id} src={item.url} className="aspect-square object-cover grayscale hover:grayscale-0 transition-all border border-gray-200" />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SECTION 3: FLAVOR OF THE MONTH --- */}
        <section className="py-12 border-y border-gray-100">
          <h2 className="text-[10px] tracking-[0.5em] uppercase font-bold text-[#B08D57] mb-8">Flavor of the Month</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center bg-gray-50/50 p-8">
             <img src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=1000" className="w-full h-[400px] object-cover border border-gray-200" alt="Flavor" />
             <div className="space-y-6">
                <h3 className="text-3xl font-serif uppercase tracking-wider text-black">Ruby Architecture</h3>
                <p className="text-sm text-gray-500 italic leading-relaxed">"February focus: High-gloss chrome over structural red sculpting."</p>
                <Button variant="outline" className="rounded-none border-black uppercase text-[10px] tracking-widest">Explore the Look</Button>
             </div>
          </div>
        </section>

        {/* --- SECTION 4: SEASONAL VAULT (The Archive Gallery) --- */}
        <section className="space-y-12">
          <h2 className="text-2xl font-serif tracking-widest uppercase text-center">Seasonal Vault</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SEASONAL_DATA.map((nail) => (
              <div key={nail.id} className="group relative aspect-square overflow-hidden border border-gray-200">
                <img src={nail.url} alt={nail.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                  <span className="text-[9px] text-[#B08D57] uppercase tracking-widest mb-2">{nail.category}</span>
                  <h4 className="text-white text-[10px] uppercase tracking-widest font-bold">{nail.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 5: STYLE VAULT (The Technical Styles) --- */}
        <section className="py-20 border-t border-gray-100">
          <h2 className="text-3xl font-serif tracking-widest uppercase mb-16 text-center">The Style Vault</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {STYLE_VAULT_DATA.map((style) => (
              <div key={style.id} className="group border border-gray-200 p-8 relative overflow-hidden">
                <span className="text-[9px] text-[#B08D57] font-bold tracking-widest uppercase mb-2 block">{style.category}</span>
                <h3 className="text-xl font-serif mb-4 uppercase">{style.title}</h3>
                <div className={cn("transition-all", !isAuthenticated && "blur-md opacity-20")}>
                  <p className="text-sm text-gray-500 italic">{style.description}</p>
                </div>
                {!isAuthenticated && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button variant="outline" className="rounded-none border-black text-[10px] bg-white"><Lock className="h-3 w-3 mr-2" /> Members Only</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 6: SUPPLY SUITE (Curated Vendors) --- */}
        <section className="py-20 bg-gray-50/50 -mx-4 px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            <h2 className="text-2xl font-serif tracking-widest uppercase">The Supply Suite</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUPPLY_SUITE_DATA.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 p-6 flex justify-between items-center group">
                  <div className={cn(!isAuthenticated && "blur-[2px] opacity-40")}>
                    <p className="text-[10px] text-gray-400 uppercase">{item.brand}</p>
                    <h4 className="font-bold text-sm uppercase">{item.name}</h4>
                  </div>
                  <div className="text-right">
                    {isAuthenticated ? <Button size="sm" className={cn("text-[10px] uppercase", GOLD_GRADIENT)}>Get Link</Button> : <Lock className="h-4 w-4 text-gray-300" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}