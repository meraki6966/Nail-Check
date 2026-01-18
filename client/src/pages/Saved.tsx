import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { TutorialCard } from "@/components/TutorialCard";
import { useFavorites } from "@/hooks/use-favorites";
import { useTutorials } from "@/hooks/use-tutorials";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Saved() {
  const { favorites, isLoaded } = useFavorites();
  
  // We fetch all tutorials then filter. 
  // In a larger app, we would have a specific endpoint /api/tutorials/batch?ids=1,2,3
  const { data: allTutorials, isLoading } = useTutorials();
  
  const savedTutorials = allTutorials?.filter(t => favorites.includes(t.id)) || [];

  if (!isLoaded || isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Heart className="h-6 w-6 text-primary fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Your Saved Looks</h1>
            <p className="text-muted-foreground">Collections you've bookmarked for later.</p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border text-center px-4"
          >
            <Heart className="h-16 w-16 text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">No favorites yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Start exploring the gallery and save your favorite tutorials to build your personal collection.
            </p>
            <Link href="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Explore Gallery
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
