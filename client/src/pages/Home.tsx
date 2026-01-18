import { useState } from "react";
import { useTutorials } from "@/hooks/use-tutorials";
import { Layout } from "@/components/Layout";
import { TutorialCard } from "@/components/TutorialCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState("");
  const [style, setStyle] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");

  // Construct filters
  const filters = {
    search: search || undefined,
    style: style === "all" ? undefined : style,
    difficulty: difficulty === "all" ? undefined : difficulty,
  };

  const { data: tutorials, isLoading, error } = useTutorials(filters);

  // Derive unique styles from data if available, or static list
  const styleOptions = [
    "French", "Chrome", "Abstract", "Floral", "Geometric", "Minimalist", "3D Art", "Ombre"
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

        {/* Filters & Search */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur py-4 -mx-4 px-4 border-b border-border/40 md:static md:bg-transparent md:border-none md:p-0">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search styles, techniques..."
                className="pl-10 h-11 rounded-xl border-border/60 focus:border-primary focus:ring-primary/20 bg-card"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="w-full md:w-[180px] h-11 rounded-xl bg-card border-border/60">
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
              <SelectTrigger className="w-full md:w-[180px] h-11 rounded-xl bg-card border-border/60">
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
      </div>
    </Layout>
  );
}
