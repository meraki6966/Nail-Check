import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Flame, Loader2, Trash2, Star, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const GOLD_TEXT = "text-[#B08D57]";
const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]";

interface SavedDesign {
  id: number;
  imageUrl: string;
  prompt: string;
  canvasImageUrl?: string;
  tags?: string[];
  isFavorite: boolean;
  createdAt: string;
}

export default function Saved() {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);

  // Fetch saved designs from Fire Vault
  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await fetch("/api/designs");
      if (response.ok) {
        const data = await response.json();
        setDesigns(data);
      }
    } catch (error) {
      console.error("Error fetching designs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this design from Fire Vault?")) return;
    
    try {
      const response = await fetch(`/api/designs/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setDesigns(prev => prev.filter(d => d.id !== id));
        setSelectedDesign(null);
        alert("🔥 Design removed from Fire Vault");
      }
    } catch (error) {
      console.error("Error deleting design:", error);
      alert("❌ Failed to delete design");
    }
  };

  const handleToggleFavorite = async (id: number) => {
    try {
      const response = await fetch(`/api/designs/${id}/favorite`, {
        method: "PATCH",
      });
      
      if (response.ok) {
        const updated = await response.json();
        setDesigns(prev => prev.map(d => d.id === id ? updated : d));
        if (selectedDesign?.id === id) {
          setSelectedDesign(updated);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDownload = (imageUrl: string, prompt: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `nail-design-${prompt.slice(0, 20)}.png`;
    link.click();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className={cn("h-8 w-8 animate-spin", GOLD_TEXT)} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Flame className={cn("h-10 w-10", GOLD_TEXT)} />
            <h1 className="text-5xl font-serif tracking-widest uppercase text-black">Fire Vault</h1>
          </div>
          <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400">Your Saved AI Creations</p>
        </header>

        {designs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-gray-50/50 border-2 border-dashed border-gray-200 text-center px-4"
          >
            <Flame className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Fire Vault is Empty</h3>
            <p className="text-gray-500 max-w-sm mb-6">
              Start creating nail designs in the Design Lab and save them to your Fire Vault.
            </p>
            <Link href="/">
              <Button className={cn("uppercase text-[10px] tracking-widest", GOLD_GRADIENT, "text-white")}>
                Go to Design Lab
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Left: Gallery Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm uppercase tracking-widest text-gray-600">
                  {designs.length} Design{designs.length !== 1 ? 's' : ''} Saved
                </h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDesigns(prev => [...prev].sort((a, b) => 
                      a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1
                    ))}
                    className="text-[10px] uppercase"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Favorites First
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AnimatePresence>
                  {designs.map((design) => (
                    <motion.div
                      key={design.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={cn(
                        "relative aspect-square cursor-pointer group border-2 transition-all",
                        selectedDesign?.id === design.id 
                          ? "border-[#B08D57] shadow-lg" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => setSelectedDesign(design)}
                    >
                      <img 
                        src={design.imageUrl} 
                        alt={design.prompt} 
                        className="w-full h-full object-cover"
                      />
                      {design.isFavorite && (
                        <Star 
                          className="absolute top-2 right-2 h-4 w-4 text-yellow-500 fill-yellow-500" 
                        />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-[8px] uppercase px-2 text-center line-clamp-2">
                          {design.prompt}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Detail View */}
            <div className="sticky top-4 h-fit">
              {selectedDesign ? (
                <motion.div
                  key={selectedDesign.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 bg-white border border-gray-200 p-6"
                >
                  {/* Image */}
                  <div className="relative aspect-square border border-gray-100">
                    <img 
                      src={selectedDesign.imageUrl} 
                      alt={selectedDesign.prompt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Prompt */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] tracking-widest uppercase text-gray-400">Original Prompt</h3>
                    <p className="text-sm italic text-gray-700">"{selectedDesign.prompt}"</p>
                  </div>

                  {/* Created Date */}
                  <div className="text-[9px] tracking-wider uppercase text-gray-400">
                    Saved {new Date(selectedDesign.createdAt).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button
                      onClick={() => handleToggleFavorite(selectedDesign.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 uppercase text-[9px]"
                    >
                      <Star 
                        className={cn(
                          "h-3 w-3 mr-1",
                          selectedDesign.isFavorite && "fill-yellow-500 text-yellow-500"
                        )} 
                      />
                      {selectedDesign.isFavorite ? "Unfavorite" : "Favorite"}
                    </Button>
                    
                    <Button
                      onClick={() => handleDownload(selectedDesign.imageUrl, selectedDesign.prompt)}
                      variant="outline"
                      size="sm"
                      className="flex-1 uppercase text-[9px]"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    
                    <Button
                      onClick={() => handleDelete(selectedDesign.id)}
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gray-50/50 border border-gray-200 p-12 text-center h-[400px] flex flex-col items-center justify-center">
                  <Flame className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">
                    Select a design to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}