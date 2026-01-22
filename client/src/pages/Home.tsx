import { useState } from "react";
import { useTutorials } from "@/hooks/use-tutorials";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { TutorialCard } from "@/components/TutorialCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
const NAIL_ART_DATA = [
  { id: 1, title: "Staten Island Main", styleCategory: "Masterpiece Tutorials", imageSource: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-andrea-staten-island.jpg", difficultyLevel: "Advanced", creatorCredit: "@andrea", toolsRequired: [], tutorialContent: "", createdAt: null },
  { id: 2, title: "Brooklyn Series", styleCategory: "Masterpiece Tutorials", imageSource: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-andrea-brooklyn.jpg", difficultyLevel: "Advanced", creatorCredit: "@andrea", toolsRequired: [], tutorialContent: "", createdAt: null },
  { id: 3, title: "Manhattan High-End", styleCategory: "Masterpiece Tutorials", imageSource: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-andrea-staten-island-manhattan.jpg", difficultyLevel: "Advanced", creatorCredit: "@andrea", toolsRequired: [], tutorialContent: "", createdAt: null },
  { id: 4, title: "Tri-State Masterclass", styleCategory: "Masterpiece Tutorials", imageSource: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-tri-state.jpg", difficultyLevel: "Advanced", creatorCredit: "@andrea", toolsRequired: [], tutorialContent: "", createdAt: null },
  { id: 5, title: "Signature Style", styleCategory: "Masterpiece Tutorials", imageSource: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-my-style.jpg", difficultyLevel: "Advanced", creatorCredit: "@andrea", toolsRequired: [], tutorialContent: "", createdAt: null },
  { id: 6, title: "The Masterpiece Guide", styleCategory: "Masterpiece Tutorials", imageSource: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial.jpg", difficultyLevel: "Advanced", creatorCredit: "@andrea", toolsRequired: [], tutorialContent: "", createdAt: null },
  { id: 7, title: "Amazon Essentials", styleCategory: "Supply Hub", imageSource: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-andrea-staten-island-amazon.jpeg", difficultyLevel: "N/A", creatorCredit: "@andrea", toolsRequired: [], tutorialContent: "", createdAt: null },
  { id: 8, title: "App Store Special", styleCategory: "Quick Sets", imageSource: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-andrea-staten-island-appstore.jpeg", difficultyLevel: "Beginner", creatorCredit: "@andrea", toolsRequired: [], tutorialContent: "", createdAt: null },
  { id: 9, title: "League City/Texas (Regional)", styleCategory: "Quick Sets", imageSource: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-texas-league-city.jpg", difficultyLevel: "Beginner", creatorCredit: "@andrea", toolsRequired: [], tutorialContent: "", createdAt: null },
  { id: 10, title: "Modern Trends", styleCategory: "Quick Sets", imageSource: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-trends.jpg", difficultyLevel: "Intermediate", creatorCredit: "@andrea", toolsRequired: [], tutorialContent: "", createdAt: null },
  { id: 11, title: "Hillside Quick Set", styleCategory: "Quick Sets", imageSource: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-hillside.jpg", difficultyLevel: "Intermediate", creatorCredit: "@andrea", toolsRequired: [], tutorialContent: "", createdAt: null }
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);

  const GENERATION_RULES = "Luxe aesthetic, high-gloss finish, NYC borough influence, and professional lighting.";

  const handleGenerate = async () => {
    if (generationCount >= 1) return;

    setIsGenerating(true);
    // Placeholder for AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedImage("https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=1000");
      setGenerationCount(prev => prev + 1);
    }, 2000);
  };

  // Construct filters
  const filters = {
    search: search || undefined,
    style: activeCategory === "all" ? undefined : activeCategory,
    difficulty: difficulty === "all" ? undefined : difficulty,
  };

  // const { data: tutorials, isLoading, error } = useTutorials(filters);
  const tutorials = NAIL_ART_DATA.filter(t => {
    const matchesSearch = !filters.search || 
      t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.styleCategory.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStyle = !filters.style || t.styleCategory === filters.style;
    const matchesDifficulty = !filters.difficulty || t.difficultyLevel === filters.difficulty;
    return matchesSearch && matchesStyle && matchesDifficulty;
  });
  const isLoading = false;
  const error = null;

  // Update style options
  const styleOptions = [
    "Masterpiece Tutorials", "Supply Hub", "Quick Sets"
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4"
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground">
            Discover Your Next Look
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated collection of nail art tutorials and find the perfect style for your next manicure.
          </p>
        </div>

        {/* AI Generator Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Nail Set Designer
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Input
                  placeholder="Describe your dream NYC nail set..."
                  className="h-12 rounded-2xl border-border/60 focus:border-primary focus:ring-primary/20 bg-background"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !aiPrompt || generationCount >= 1}
                className="h-12 px-8 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Designing...
                  </>
                ) : (
                  "Generate with AI"
                )}
              </Button>
            </div>
            
            {/* Paywall Message */}
            {generationCount >= 1 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center"
              >
                <p className="text-foreground font-medium mb-4">
                  You've unlocked your first NYC design! To continue creating, join the Elite Membership for $8.99/mo.
                </p>
                <Link href="/membership">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                    Upgrade to Elite Membership
                  </Button>
                </Link>
              </motion.div>
            )}
            
            {/* AI Result Area */}
            {(isGenerating || generatedImage) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-3xl overflow-hidden border border-border/50 aspect-video bg-muted/30 flex items-center justify-center relative"
              >
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Designing your masterpiece...</p>
                  </div>
                ) : generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="Generated Nail Set" 
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </motion.div>
            )}
          </div>
        </div>

        {/* Filters & Search */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur py-4 -mx-4 px-4 border-b border-border/40 md:static md:bg-transparent md:border-none md:p-0">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search styles, techniques..."
                className="pl-10 h-11 rounded-full border-border/60 focus:border-primary focus:ring-primary/20 bg-card"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={activeCategory} onValueChange={setActiveCategory}>
              <SelectTrigger className="w-full md:w-[220px] h-11 rounded-full bg-card border-border/60">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                {styleOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-full md:w-[180px] h-11 rounded-full bg-card border-border/60">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Level</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">
            <p>Error loading tutorials. Please try again later.</p>
          </div>
        ) : tutorials && tutorials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
            <h3 className="text-xl font-display font-medium text-muted-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        )}
      <footer className="mt-auto py-8 border-t border-border/40">
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-6 text-sm text-muted-foreground/60">
            <a href="https://nail-check.com/terms-of-service/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="https://nail-check.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </div>
          <p className="text-xs text-muted-foreground/40">© 2026 Nail Check New York City</p>
        </div>
      </footer></div>
    </Layout>
  );
}
