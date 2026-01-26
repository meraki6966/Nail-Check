import { Link } from "wouter";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";
import type { Tutorial } from "@shared/schema";
import { motion } from "framer-motion";

interface TutorialCardProps {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(tutorial.id);

  const difficultyColors = {
    Beginner: "bg-green-100 text-green-700 hover:bg-green-200",
    Intermediate: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    Pro: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-card">
        <div className="relative aspect-[4/5] overflow-hidden group">
          <Link href={`/tutorial/${tutorial.id}`}>
            <div className="w-full h-full cursor-pointer">
              <img
                src={tutorial.imageSource}
                alt={tutorial.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:bg-white hover:scale-110",
              liked && "text-primary bg-white"
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(tutorial.id);
            }}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-current")} />
          </Button>
        </div>

        <CardContent className="p-4 flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {tutorial.styleCategory}
            </span>
            <Badge 
              variant="secondary" 
              className={cn("font-normal border-none", difficultyColors[tutorial.difficultyLevel as keyof typeof difficultyColors] || "bg-secondary")}
            >
              {tutorial.difficultyLevel}
            </Badge>
          </div>
          {tutorial.tutorialContent && tutorial.tutorialContent.trim().length > 0 && (
            <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/20 text-[10px] py-0 px-2 h-5 font-bold uppercase tracking-widest">
              Tutorial
            </Badge>
          )}
          <Link href={`/tutorial/${tutorial.id}`}>
            <h3 className="font-display text-lg font-bold leading-tight hover:text-primary transition-colors cursor-pointer">
              {tutorial.title}
            </h3>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
