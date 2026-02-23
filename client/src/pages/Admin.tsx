import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Lock, Image, BookOpen, Sparkles, ShoppingBag, Users, 
  Plus, Trash2, Check, X, LogOut, Upload, Eye, EyeOff,
  ChevronDown, Save, Loader2, RefreshCw, Star, Globe, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  syncGalleryToWordPress,
  syncTutorialToWordPress,
  syncSeasonalToWordPress,
  syncSupplyToWordPress,
  syncTechToWordPress,
  updateFlavorOfMonth,
  getFlavorOfMonth
} from "@/lib/wordpressSync";

const ADMIN_PASSWORD = "merakigoldblooded26";

const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";
const CYAN_GRADIENT = "bg-gradient-to-r from-[#00D9FF] to-[#9B5DE5]";
const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] to-[#D4AF37]";

// Tabs for different upload types
const TABS = [
  { id: "gallery", label: "Gallery", icon: Image, color: "text-[#FF6B9D]" },
  { id: "tutorials", label: "Tutorials", icon: BookOpen, color: "text-[#9B5DE5]" },
  { id: "seasonal", label: "Seasonal", icon: Sparkles, color: "text-[#00D9FF]" },
  { id: "supplies", label: "Supplies", icon: ShoppingBag, color: "text-[#D4AF37]" },
  { id: "techs", label: "Nail Techs", icon: Users, color: "text-[#10B981]" },
  { id: "flavor", label: "Flavor of Month", icon: Star, color: "text-[#FF6B9D]" },
];

// Category options
const GALLERY_CATEGORIES = ["Chrome", "3D / Character", "Junk Nails", "Bridal", "Cat Eye", "Glass Nails", "Coffin", "Stiletto", "Almond", "Editorial"];
const SEASONS = ["Winter", "Spring", "Summer", "Fall", "Holiday"];
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Competition"];
const SUPPLY_CATEGORIES = ["Base Coat", "Top Coat", "Color - Red", "Color - Nude", "Tool - Brush", "Tool - Dotting", "Equipment - Lamp", "Equipment - File", "Specialty - Chrome", "Specialty - Gel", "Nail Care"];

export default function Admin() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");

  // Data states
  const [pendingTechs, setPendingTechs] = useState<any[]>([]);
  const [approvedTechs, setApprovedTechs] = useState<any[]>([]);
  const [existingGallery, setExistingGallery] = useState<any[]>([]);
  const [existingTutorials, setExistingTutorials] = useState<any[]>([]);
  const [existingSeasonals, setExistingSeasonals] = useState<any[]>([]);
  const [existingSupplies, setExistingSupplies] = useState<any[]>([]);

  // Form states
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    imageUrl: "",
    category: "",
    tags: "",
    description: "",
    memberOnly: false,
  });

  const [tutorialForm, setTutorialForm] = useState({
    title: "",
    imageSource: "",
    styleCategory: "",
    difficultyLevel: "",
    toolsRequired: "",
    tutorialContent: "",
    creatorCredit: "",
  });

  const [seasonalForm, setSeasonalForm] = useState({
    title: "",
    imageUrl: "",
    season: "",
    category: "",
    description: "",
    tags: "",
    featured: false,
  });

  const [supplyForm, setSupplyForm] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    imageUrl: "",
    productUrl: "",
    price: "",
    utility: "",
    tags: "",
    featured: false,
    memberOnly: true,
  });

  // Flavor of Month state
  const [flavorForm, setFlavorForm] = useState({
    title: "",
    description: "",
    image: "",
  });

  // Check for saved auth
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("nailcheck_admin");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, activeTab]);

  // Fetch Flavor of Month on load
  useEffect(() => {
    if (isAuthenticated && activeTab === "flavor") {
      fetchFlavorOfMonth();
    }
  }, [isAuthenticated, activeTab]);

  const fetchFlavorOfMonth = async () => {
    try {
      const data = await getFlavorOfMonth();
      if (data) {
        setFlavorForm({
          title: data.title || "",
          description: data.description || "",
          image: data.image || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch flavor of month:", error);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch pending techs
      const techsRes = await fetch("/api/admin/techs/pending");
      if (techsRes.ok) {
        const techs = await techsRes.json();
        setPendingTechs(techs);
      }

      // Fetch approved techs
      const approvedRes = await fetch("/api/techs");
      if (approvedRes.ok) {
        const techs = await approvedRes.json();
        setApprovedTechs(techs.filter((t: any) => t.approved));
      }

      // Fetch existing content based on active tab
      if (activeTab === "gallery") {
        const res = await fetch("/api/gallery");
        if (res.ok) setExistingGallery(await res.json());
      }
      if (activeTab === "tutorials") {
        const res = await fetch("/api/tutorials");
        if (res.ok) setExistingTutorials(await res.json());
      }
      if (activeTab === "seasonal") {
        const res = await fetch("/api/seasonal");
        if (res.ok) setExistingSeasonals(await res.json());
      }
      if (activeTab === "supplies") {
        const res = await fetch("/api/supplies");
        if (res.ok) setExistingSupplies(await res.json());
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("nailcheck_admin", "true");
      toast({ title: "Welcome, Andrea! 💅", description: "You're now logged in to the admin dashboard." });
    } else {
      toast({ title: "Wrong Password", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("nailcheck_admin");
    setPassword("");
  };

  // GALLERY SUBMIT (with WordPress sync)
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSyncStatus("syncing");
    
    try {
      // Save to Railway
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...galleryForm,
          tags: galleryForm.tags.split(",").map(t => t.trim()),
        }),
      });
      
      if (!res.ok) throw new Error("Failed to save to Railway");
      
      const railwayData = await res.json();
      
      // Sync to WordPress
      const wpResult = await syncGalleryToWordPress({
        title: galleryForm.title,
        imageUrl: galleryForm.imageUrl,
        category: galleryForm.category,
        tags: galleryForm.tags.split(",").map(t => t.trim()),
        description: galleryForm.description,
        memberOnly: galleryForm.memberOnly,
        railwayId: railwayData.id,
      });
      
      if (wpResult.success) {
        setSyncStatus("success");
        toast({ 
          title: "Gallery Image Added! 🎉", 
          description: `${galleryForm.title} - Synced to both platforms!` 
        });
      } else {
        setSyncStatus("error");
        toast({ 
          title: "Saved to App", 
          description: "WordPress sync failed - content visible on app only.",
          variant: "destructive"
        });
      }
      
      setGalleryForm({ title: "", imageUrl: "", category: "", tags: "", description: "", memberOnly: false });
      fetchAllData();
    } catch (error) {
      setSyncStatus("error");
      toast({ title: "Error", description: "Failed to save. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSyncStatus("idle"), 3000);
    }
  };

  // TUTORIAL SUBMIT (with WordPress sync)
  const handleTutorialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSyncStatus("syncing");
    
    try {
      const res = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...tutorialForm,
          toolsRequired: tutorialForm.toolsRequired.split(",").map(t => t.trim()),
        }),
      });
      
      if (!res.ok) throw new Error("Failed to save");
      
      const railwayData = await res.json();
      
      // Sync to WordPress
      const wpResult = await syncTutorialToWordPress({
        title: tutorialForm.title,
        imageSource: tutorialForm.imageSource,
        styleCategory: tutorialForm.styleCategory,
        difficultyLevel: tutorialForm.difficultyLevel,
        toolsRequired: tutorialForm.toolsRequired.split(",").map(t => t.trim()),
        tutorialContent: tutorialForm.tutorialContent,
        creatorCredit: tutorialForm.creatorCredit,
        railwayId: railwayData.id,
      });
      
      if (wpResult.success) {
        setSyncStatus("success");
        toast({ title: "Tutorial Added! 📚", description: `${tutorialForm.title} - Synced to both platforms!` });
      } else {
        setSyncStatus("error");
        toast({ title: "Saved to App", description: "WordPress sync failed.", variant: "destructive" });
      }
      
      setTutorialForm({ title: "", imageSource: "", styleCategory: "", difficultyLevel: "", toolsRequired: "", tutorialContent: "", creatorCredit: "" });
      fetchAllData();
    } catch (error) {
      setSyncStatus("error");
      toast({ title: "Error", description: "Failed to save. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSyncStatus("idle"), 3000);
    }
  };

  // SEASONAL SUBMIT (with WordPress sync)
  const handleSeasonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSyncStatus("syncing");
    
    try {
      const res = await fetch("/api/seasonal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...seasonalForm,
          tags: seasonalForm.tags.split(",").map(t => t.trim()),
        }),
      });
      
      if (!res.ok) throw new Error("Failed to save");
      
      const railwayData = await res.json();
      
      // Sync to WordPress
      const wpResult = await syncSeasonalToWordPress({
        title: seasonalForm.title,
        imageUrl: seasonalForm.imageUrl,
        season: seasonalForm.season,
        category: seasonalForm.category,
        description: seasonalForm.description,
        tags: seasonalForm.tags.split(",").map(t => t.trim()),
        featured: seasonalForm.featured,
        railwayId: railwayData.id,
      });
      
      if (wpResult.success) {
        setSyncStatus("success");
        toast({ title: "Seasonal Design Added! ✨", description: `${seasonalForm.title} - Synced to both platforms!` });
      } else {
        setSyncStatus("error");
        toast({ title: "Saved to App", description: "WordPress sync failed.", variant: "destructive" });
      }
      
      setSeasonalForm({ title: "", imageUrl: "", season: "", category: "", description: "", tags: "", featured: false });
      fetchAllData();
    } catch (error) {
      setSyncStatus("error");
      toast({ title: "Error", description: "Failed to save. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSyncStatus("idle"), 3000);
    }
  };

  // SUPPLY SUBMIT (with WordPress sync)
  const handleSupplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSyncStatus("syncing");
    
    try {
      const res = await fetch("/api/supplies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...supplyForm,
          tags: supplyForm.tags.split(",").map(t => t.trim()),
        }),
      });
      
      if (!res.ok) throw new Error("Failed to save");
      
      const railwayData = await res.json();
      
      // Sync to WordPress
      const wpResult = await syncSupplyToWordPress({
        name: supplyForm.name,
        brand: supplyForm.brand,
        category: supplyForm.category,
        description: supplyForm.description,
        imageUrl: supplyForm.imageUrl,
        productUrl: supplyForm.productUrl,
        price: supplyForm.price,
        utility: supplyForm.utility,
        tags: supplyForm.tags.split(",").map(t => t.trim()),
        featured: supplyForm.featured,
        memberOnly: supplyForm.memberOnly,
        railwayId: railwayData.id,
      });
      
      if (wpResult.success) {
        setSyncStatus("success");
        toast({ title: "Supply Product Added! 🛍️", description: `${supplyForm.name} - Synced to both platforms!` });
      } else {
        setSyncStatus("error");
        toast({ title: "Saved to App", description: "WordPress sync failed.", variant: "destructive" });
      }
      
      setSupplyForm({ name: "", brand: "", category: "", description: "", imageUrl: "", productUrl: "", price: "", utility: "", tags: "", featured: false, memberOnly: true });
      fetchAllData();
    } catch (error) {
      setSyncStatus("error");
      toast({ title: "Error", description: "Failed to save. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSyncStatus("idle"), 3000);
    }
  };

  // FLAVOR OF MONTH SUBMIT
  const handleFlavorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSyncStatus("syncing");
    
    try {
      const wpResult = await updateFlavorOfMonth({
        title: flavorForm.title,
        description: flavorForm.description,
        image: flavorForm.image,
      });
      
      if (wpResult.success) {
        setSyncStatus("success");
        toast({ title: "Flavor of the Month Updated! 🌟", description: "Shows on both platforms instantly!" });
      } else {
        setSyncStatus("error");
        toast({ title: "Error", description: "Failed to update.", variant: "destructive" });
      }
    } catch (error) {
      setSyncStatus("error");
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSyncStatus("idle"), 3000);
    }
  };

  // APPROVE TECH (with WordPress sync)
  const handleApproveTech = async (tech: any) => {
    try {
      const res = await fetch(`/api/techs/${tech.id}/approve`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to approve");
      
      // Sync to WordPress
      await syncTechToWordPress({
        name: tech.name,
        email: tech.email,
        phone: tech.phone,
        businessName: tech.businessName,
        city: tech.city,
        state: tech.state,
        zipCode: tech.zipCode,
        bio: tech.bio,
        imageUrl: tech.imageUrl,
        bookingUrl: tech.bookingUrl,
        instagram: tech.instagram,
        website: tech.website,
        skillLevel: tech.skillLevel,
        specialties: tech.specialties,
        approved: true,
        railwayId: tech.id,
      });
      
      toast({ title: "Nail Tech Approved! ✅", description: "They now appear on both platforms." });
      fetchAllData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve.", variant: "destructive" });
    }
  };

  // REJECT/DELETE TECH
  const handleRejectTech = async (id: number) => {
    try {
      const res = await fetch(`/api/techs/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Removed", description: "Nail tech application removed." });
        fetchAllData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove.", variant: "destructive" });
    }
  };

  // Sync Status Badge
  const SyncStatusBadge = () => {
    if (syncStatus === "idle") return null;
    
    return (
      <div className={cn(
        "fixed bottom-4 right-4 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg z-50 transition-all",
        syncStatus === "syncing" && "bg-blue-500 text-white",
        syncStatus === "success" && "bg-green-500 text-white",
        syncStatus === "error" && "bg-red-500 text-white",
      )}>
        {syncStatus === "syncing" && <><Loader2 className="h-4 w-4 animate-spin" /> Syncing to WordPress...</>}
        {syncStatus === "success" && <><Check className="h-4 w-4" /> Synced to Both Platforms!</>}
        {syncStatus === "error" && <><AlertCircle className="h-4 w-4" /> WordPress Sync Failed</>}
      </div>
    );
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFFBFC] to-[#FFF5F8] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] flex items-center justify-center">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-serif bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-2">Enter password to continue</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="relative mb-6">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-12 pr-12 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <Button type="submit" className={cn("w-full h-12 rounded-xl", PINK_GRADIENT, "text-white")}>
              <Lock className="h-4 w-4 mr-2" />
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBFC] to-[#FFF5F8]">
      <SyncStatusBadge />
      
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-xl bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
                Nail Check Admin
              </h1>
              <p className="text-xs text-gray-400">Welcome, Andrea!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full">
              <Globe className="h-3 w-3" />
              Syncs to WordPress
            </div>
            <Button variant="outline" size="sm" onClick={fetchAllData} className="rounded-full">
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border"
              )}
            >
              <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-white" : tab.color)} />
              {tab.label}
              {tab.id === "techs" && pendingTechs.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingTechs.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
              <Image className="h-5 w-5 text-[#FF6B9D]" />
              Add Gallery Image
            </h2>
            <form onSubmit={handleGallerySubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
                  <Input
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    placeholder="e.g., Chrome Dreams"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-gray-200"
                    required
                  >
                    <option value="">Select category...</option>
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Image URL *</label>
                <Input
                  value={galleryForm.imageUrl}
                  onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                  placeholder="https://nail-check.com/wp-content/uploads/..."
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Upload image to WordPress Media Library first, then paste URL here</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tags (comma separated)</label>
                <Input
                  value={galleryForm.tags}
                  onChange={(e) => setGalleryForm({ ...galleryForm, tags: e.target.value })}
                  placeholder="e.g., Chrome, Coffin, Sparkle"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <Textarea
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  placeholder="Brief description of this design..."
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="galleryMemberOnly"
                  checked={galleryForm.memberOnly}
                  onChange={(e) => setGalleryForm({ ...galleryForm, memberOnly: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="galleryMemberOnly" className="text-sm cursor-pointer">Members Only (blurred for non-members)</label>
              </div>
              <Button type="submit" disabled={isSaving} className={cn("rounded-full", PINK_GRADIENT, "text-white")}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add to Gallery (Syncs to WordPress)
              </Button>
            </form>

            {/* Existing Gallery */}
            {existingGallery.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-medium text-gray-700 mb-4">Existing Gallery ({existingGallery.length})</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {existingGallery.slice(0, 12).map((item: any) => (
                    <div key={item.id} className="relative group">
                      <img src={item.imageUrl} alt={item.title} className="w-full aspect-square object-cover rounded-lg" />
                      {item.memberOnly && (
                        <span className="absolute top-1 right-1 bg-[#9B5DE5] text-white text-[10px] px-1 rounded">🔒</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TUTORIALS TAB */}
        {activeTab === "tutorials" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-serif mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#9B5DE5]" />
              Add Tutorial
            </h2>
            <p className="text-sm text-[#9B5DE5] mb-6">📌 All tutorials are members-only content</p>
            <form onSubmit={handleTutorialSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
                  <Input
                    value={tutorialForm.title}
                    onChange={(e) => setTutorialForm({ ...tutorialForm, title: e.target.value })}
                    placeholder="e.g., Perfect Chrome Application"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Style Category *</label>
                  <select
                    value={tutorialForm.styleCategory}
                    onChange={(e) => setTutorialForm({ ...tutorialForm, styleCategory: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-gray-200"
                    required
                  >
                    <option value="">Select style...</option>
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Difficulty Level *</label>
                  <select
                    value={tutorialForm.difficultyLevel}
                    onChange={(e) => setTutorialForm({ ...tutorialForm, difficultyLevel: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-gray-200"
                    required
                  >
                    <option value="">Select level...</option>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Creator Credit</label>
                  <Input
                    value={tutorialForm.creatorCredit}
                    onChange={(e) => setTutorialForm({ ...tutorialForm, creatorCredit: e.target.value })}
                    placeholder="@instagram_handle"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Thumbnail Image URL *</label>
                <Input
                  value={tutorialForm.imageSource}
                  onChange={(e) => setTutorialForm({ ...tutorialForm, imageSource: e.target.value })}
                  placeholder="https://nail-check.com/wp-content/uploads/..."
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tools Required (comma separated) *</label>
                <Input
                  value={tutorialForm.toolsRequired}
                  onChange={(e) => setTutorialForm({ ...tutorialForm, toolsRequired: e.target.value })}
                  placeholder="e.g., Base Coat, Chrome Powder, No-Wipe Top Coat"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tutorial Content *</label>
                <Textarea
                  value={tutorialForm.tutorialContent}
                  onChange={(e) => setTutorialForm({ ...tutorialForm, tutorialContent: e.target.value })}
                  placeholder="Step 1: Apply base coat...&#10;Step 2: Cure for 60 seconds..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" disabled={isSaving} className={cn("rounded-full", PURPLE_GRADIENT, "text-white")}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Tutorial (Syncs to WordPress)
              </Button>
            </form>

            {existingTutorials.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-medium text-gray-700 mb-4">Existing Tutorials ({existingTutorials.length})</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {existingTutorials.slice(0, 6).map((tut: any) => (
                    <div key={tut.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <img src={tut.imageSource} alt={tut.title} className="w-16 h-16 object-cover rounded-lg" />
                      <div>
                        <p className="font-medium text-sm">{tut.title}</p>
                        <p className="text-xs text-gray-500">{tut.difficultyLevel} • {tut.styleCategory}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SEASONAL TAB */}
        {activeTab === "seasonal" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-serif mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#00D9FF]" />
              Add Seasonal Design
            </h2>
            <p className="text-sm text-[#00D9FF] mb-6">📌 All seasonal designs are members-only content</p>
            <form onSubmit={handleSeasonalSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
                  <Input
                    value={seasonalForm.title}
                    onChange={(e) => setSeasonalForm({ ...seasonalForm, title: e.target.value })}
                    placeholder="e.g., Valentine Hearts"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Season *</label>
                  <select
                    value={seasonalForm.season}
                    onChange={(e) => setSeasonalForm({ ...seasonalForm, season: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-gray-200"
                    required
                  >
                    <option value="">Select season...</option>
                    {SEASONS.map((season) => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                  <Input
                    value={seasonalForm.category}
                    onChange={(e) => setSeasonalForm({ ...seasonalForm, category: e.target.value })}
                    placeholder="e.g., Valentine's Day, Christmas"
                  />
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seasonalForm.featured}
                      onChange={(e) => setSeasonalForm({ ...seasonalForm, featured: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Featured Design</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Image URL *</label>
                <Input
                  value={seasonalForm.imageUrl}
                  onChange={(e) => setSeasonalForm({ ...seasonalForm, imageUrl: e.target.value })}
                  placeholder="https://nail-check.com/wp-content/uploads/..."
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tags (comma separated)</label>
                <Input
                  value={seasonalForm.tags}
                  onChange={(e) => setSeasonalForm({ ...seasonalForm, tags: e.target.value })}
                  placeholder="e.g., red, hearts, love"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <Textarea
                  value={seasonalForm.description}
                  onChange={(e) => setSeasonalForm({ ...seasonalForm, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={2}
                />
              </div>
              <Button type="submit" disabled={isSaving} className={cn("rounded-full", CYAN_GRADIENT, "text-white")}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Seasonal Design (Syncs to WordPress)
              </Button>
            </form>
          </div>
        )}

        {/* SUPPLIES TAB */}
        {activeTab === "supplies" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
              Add Supply Product
            </h2>
            <form onSubmit={handleSupplySubmit} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name *</label>
                  <Input
                    value={supplyForm.name}
                    onChange={(e) => setSupplyForm({ ...supplyForm, name: e.target.value })}
                    placeholder="e.g., Chrome Powder Set"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Brand *</label>
                  <Input
                    value={supplyForm.brand}
                    onChange={(e) => setSupplyForm({ ...supplyForm, brand: e.target.value })}
                    placeholder="e.g., Born Pretty"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Price</label>
                  <Input
                    value={supplyForm.price}
                    onChange={(e) => setSupplyForm({ ...supplyForm, price: e.target.value })}
                    placeholder="e.g., $12.99"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
                  <select
                    value={supplyForm.category}
                    onChange={(e) => setSupplyForm({ ...supplyForm, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-gray-200"
                    required
                  >
                    <option value="">Select category...</option>
                    {SUPPLY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Product URL (affiliate link)</label>
                  <Input
                    value={supplyForm.productUrl}
                    onChange={(e) => setSupplyForm({ ...supplyForm, productUrl: e.target.value })}
                    placeholder="https://amazon.com/..."
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Image URL</label>
                <Input
                  value={supplyForm.imageUrl}
                  onChange={(e) => setSupplyForm({ ...supplyForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <Textarea
                  value={supplyForm.description}
                  onChange={(e) => setSupplyForm({ ...supplyForm, description: e.target.value })}
                  placeholder="What is this product for?"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">What It's Used For</label>
                <Input
                  value={supplyForm.utility}
                  onChange={(e) => setSupplyForm({ ...supplyForm, utility: e.target.value })}
                  placeholder="e.g., Creates mirror chrome effect"
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supplyForm.featured}
                    onChange={(e) => setSupplyForm({ ...supplyForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supplyForm.memberOnly}
                    onChange={(e) => setSupplyForm({ ...supplyForm, memberOnly: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Members Only</span>
                </label>
              </div>
              <Button type="submit" disabled={isSaving} className={cn("rounded-full", GOLD_GRADIENT, "text-white")}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Product (Syncs to WordPress)
              </Button>
            </form>
          </div>
        )}

        {/* NAIL TECHS TAB */}
        {activeTab === "techs" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#10B981]" />
              Pending Nail Tech Applications
              {pendingTechs.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                  {pendingTechs.length} pending
                </span>
              )}
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 mx-auto text-[#9B5DE5] animate-spin" />
              </div>
            ) : pendingTechs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No pending applications</p>
                <p className="text-sm">New registrations will appear here for your approval</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTechs.map((tech) => (
                  <div key={tech.id} className="border rounded-xl p-5 hover:border-[#FF6B9D]/50 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-gray-800">{tech.name}</h3>
                        {tech.businessName && (
                          <p className="text-sm text-[#9B5DE5]">{tech.businessName}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          📍 {tech.city}, {tech.state} {tech.zipCode}
                        </p>
                        <p className="text-sm text-gray-500">
                          📧 {tech.email} {tech.phone && `• 📞 ${tech.phone}`}
                        </p>
                        {tech.instagram && (
                          <p className="text-sm text-gray-500">📸 {tech.instagram}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg">
                          {tech.bio}
                        </p>
                        {tech.specialties && tech.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {tech.specialties.map((s: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 bg-[#FFF5F8] text-[#FF6B9D] text-xs rounded-full">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => handleApproveTech(tech)}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectTech(tech.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Approved Techs */}
            {approvedTechs.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-medium text-gray-700 mb-4">Approved Techs ({approvedTechs.length})</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {approvedTechs.map((tech: any) => (
                    <div key={tech.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tech.name}</p>
                        <p className="text-xs text-gray-500">{tech.city}, {tech.state}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FLAVOR OF MONTH TAB */}
        {activeTab === "flavor" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-serif mb-2 flex items-center gap-2">
              <Star className="h-5 w-5 text-[#FF6B9D]" />
              Flavor of the Month
            </h2>
            <p className="text-sm text-gray-500 mb-6">This appears on both the app homepage and WordPress site</p>
            
            <form onSubmit={handleFlavorSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
                <Input
                  value={flavorForm.title}
                  onChange={(e) => setFlavorForm({ ...flavorForm, title: e.target.value })}
                  placeholder="e.g., Ruby Architecture"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
                <Textarea
                  value={flavorForm.description}
                  onChange={(e) => setFlavorForm({ ...flavorForm, description: e.target.value })}
                  placeholder="e.g., February focus: High-gloss chrome over structural red sculpting."
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Image URL *</label>
                <Input
                  value={flavorForm.image}
                  onChange={(e) => setFlavorForm({ ...flavorForm, image: e.target.value })}
                  placeholder="https://nail-check.com/wp-content/uploads/..."
                  required
                />
              </div>
              
              {/* Preview */}
              {flavorForm.image && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <div className="relative h-48 rounded-xl overflow-hidden">
                    <img src={flavorForm.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                      <div className="text-white">
                        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Flavor of the Month</span>
                        <h3 className="text-xl font-serif">{flavorForm.title || "Title"}</h3>
                        <p className="text-sm text-gray-300">{flavorForm.description || "Description"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <Button type="submit" disabled={isSaving} className={cn("rounded-full", PINK_GRADIENT, "text-white")}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Update Flavor of the Month
              </Button>
            </form>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] rounded-2xl p-6">
          <h3 className="font-serif text-lg mb-3 text-[#9B5DE5]">💡 Quick Tips</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• <strong>Images:</strong> Upload to WordPress Media Library first, then copy the URL</li>
            <li>• <strong>Sync:</strong> All content automatically syncs to both the app AND WordPress site</li>
            <li>• <strong>Members Only:</strong> Checked items are blurred/locked for non-members on BOTH platforms</li>
            <li>• <strong>Flavor of Month:</strong> Updates instantly on both platforms</li>
            <li>• <strong>Nail Techs:</strong> Approved techs appear in the directory on both platforms</li>
          </ul>
        </div>
      </div>
    </div>
  );
}