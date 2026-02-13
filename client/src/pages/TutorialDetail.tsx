import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { useFavorites } from "@/hooks/use-favorites";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, Share2, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Tutorial {
  id: number;
  title: string;
  imageSource: string | false;
  styleCategory: string;
  difficultyLevel: string;
  toolsRequired: string[];
  tutorialContent: string;
  creatorCredit: string;
  createdAt: string;
}

export default function TutorialDetail() {
  const { id } = useParams();
  const tutorialId = parseInt(id || "0");
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkedTools, setCheckedTools] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Fetch all tutorials from WordPress and find the one we need
    fetch("https://nail-check.com/wp-json/nail-check/v1/tutorials")
      .then(res => res.json())
      .then((data: Tutorial[]) => {
        const foundTutorial = data.find(t => t.id === tutorialId);
        if (foundTutorial) {
          setTutorial(foundTutorial);
        } else {
          setError(true);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch tutorial:", err);
        setError(true);
        setIsLoading(false);
      });
  }, [tutorialId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse px-4">
          <Skeleton className="h-[400px] w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !tutorial) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-display font-bold text-destructive">Tutorial not found</h2>
          <Link href="/tutorials">
            <Button variant="link" className="mt-4">Back to Gallery</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isLiked = isFavorite(tutorial.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Tutorial link copied to clipboard.",
    });
  };

  const toggleTool = (tool: string) => {
    setCheckedTools(prev => ({
      ...prev,
      [tool]: !prev[tool]
    }));
  };

  // Clean HTML from tutorialContent
  const cleanContent = tutorial.tutorialContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-12 px-4">
        <Link href="/tutorials" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Left Column: Image */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              {tutorial.imageSource ? (
                <img
                  src={tutorial.imageSource as string}
                  alt={tutorial.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-400">No image available</p>
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  className="rounded-full bg-white/90 backdrop-blur text-foreground shadow-lg hover:bg-white hover:scale-105 transition-all"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  className={cn(
                    "rounded-full bg-white/90 backdrop-blur shadow-lg hover:bg-white hover:scale-105 transition-all",
                    isLiked ? "text-primary" : "text-foreground"
                  )}
                  onClick={() => toggleFavorite(tutorial.id)}
                >
                  <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                </Button>
              </div>
            </div>

            {/* Mobile-only tools visible under image for context */}
            {tutorial.toolsRequired && tutorial.toolsRequired.length > 0 && (
              <div className="md:hidden bg-secondary/30 rounded-2xl p-6 border border-border/50">
                <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Required Tools
                </h3>
                <ul className="space-y-3">
                  {tutorial.toolsRequired.map((tool, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <Checkbox 
                        id={`mobile-tool-${idx}`} 
                        checked={checkedTools[tool]}
                        onCheckedChange={() => toggleTool(tool)}
                        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                      <label
                        htmlFor={`mobile-tool-${idx}`}
                        className={cn(
                          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer transition-all",
                          checkedTools[tool] && "text-muted-foreground line-through decoration-primary/50"
                        )}
                      >
                        {tool}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Content */}
          <div className="space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-primary/20 text-primary-foreground hover:bg-primary/30 text-sm px-3 py-1">
                  {tutorial.styleCategory}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {tutorial.difficultyLevel}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 20-30 min
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                {tutorial.title}
              </h1>
              
              {tutorial.creatorCredit && (
                <p className="text-lg text-muted-foreground border-l-2 border-primary/50 pl-4 italic">
                  Designed by <span className="font-semibold text-foreground">{tutorial.creatorCredit}</span>
                </p>
              )}
            </div>

            <Separator />

            {/* Desktop Tools List */}
            {tutorial.toolsRequired && tutorial.toolsRequired.length > 0 && (
              <div className="hidden md:block bg-secondary/30 rounded-2xl p-6 border border-border/50">
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Required Tools
                </h3>
                <ul className="grid grid-cols-1 gap-3">
                  {tutorial.toolsRequired.map((tool, idx) => (
                    <li key={idx} className="flex items-center space-x-3 group">
                      <Checkbox 
                        id={`tool-${idx}`} 
                        checked={checkedTools[tool]}
                        onCheckedChange={() => toggleTool(tool)}
                        className="h-5 w-5 border-2 border-muted-foreground/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary rounded-md transition-all"
                      />
                      <label
                        htmlFor={`tool-${idx}`}
                        className={cn(
                          "text-base font-medium cursor-pointer transition-all select-none",
                          checkedTools[tool] ? "text-muted-foreground line-through decoration-primary/50" : "group-hover:text-primary"
                        )}
                      >
                        {tool}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-display text-2xl font-bold mb-4">Instructions</h3>
              <div className="prose prose-stone max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {cleanContent}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}