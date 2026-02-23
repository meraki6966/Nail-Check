import { useState, useEffect } from "react";
import { BookOpen, Play, Clock, Star, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MemberGate, LockedBadge, useCanAccess } from "@/components/MemberGate";

interface Tutorial {
  id: number;
  title: string;
  imageSource: string;
  styleCategory: string;
  difficultyLevel: string;
  toolsRequired: string[];
  tutorialContent: string;
  creatorCredit?: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  "Beginner": "bg-green-100 text-green-700",
  "Intermediate": "bg-yellow-100 text-yellow-700",
  "Advanced": "bg-orange-100 text-orange-700",
  "Competition": "bg-red-100 text-red-700",
};

export default function Tutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { isMember, canAccess } = useCanAccess();

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const res = await fetch("/api/tutorials");
      if (res.ok) {
        const data = await res.json();
        setTutorials(data);
      }
    } catch (error) {
      console.error("Failed to fetch tutorials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTutorials = filter === "all" 
    ? tutorials 
    : tutorials.filter(t => t.difficultyLevel === filter);

  // Free users see 3 tutorials, members see all
  const FREE_PREVIEW_COUNT = 3;
  const displayTutorials = isMember 
    ? filteredTutorials 
    : filteredTutorials.slice(0, FREE_PREVIEW_COUNT);

  const categories = [...new Set(tutorials.map(t => t.difficultyLevel))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBFC] to-[#FFF5F8]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <BookOpen className="h-4 w-4" />
            <span>Step-by-Step Guides</span>
          </div>
          <h1 className="text-4xl font-serif mb-3">Tutorial Library</h1>
          <p className="text-white/90 max-w-xl">
            Master every technique from beginner basics to competition-level artistry. 
            {!isMember && " Unlock all tutorials with a membership."}
          </p>
          
          {/* Stats */}
          <div className="flex gap-6 mt-6">
            <div>
              <div className="text-3xl font-bold">{tutorials.length}</div>
              <div className="text-sm text-white/70">Tutorials</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{categories.length}</div>
              <div className="text-sm text-white/70">Skill Levels</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-full",
              filter === "all" && "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] text-white"
            )}
          >
            All Levels
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full",
                filter === cat && "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] text-white"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Tutorial Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTutorials.map((tutorial, index) => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  isLocked={!isMember && index >= FREE_PREVIEW_COUNT}
                  onClick={() => isMember && setSelectedTutorial(tutorial)}
                />
              ))}
            </div>

            {/* Show upgrade prompt if not a member */}
            {!isMember && filteredTutorials.length > FREE_PREVIEW_COUNT && (
              <MemberGate
                lockType="preview"
                featureName="tutorials"
                previewCount={{
                  shown: Math.min(FREE_PREVIEW_COUNT, filteredTutorials.length),
                  total: filteredTutorials.length
                }}
              >
                <div /> {/* Empty div since we're using preview mode */}
              </MemberGate>
            )}
          </>
        )}
      </div>

      {/* Tutorial Detail Modal */}
      {selectedTutorial && isMember && (
        <TutorialModal
          tutorial={selectedTutorial}
          onClose={() => setSelectedTutorial(null)}
        />
      )}
    </div>
  );
}

function TutorialCard({ 
  tutorial, 
  isLocked, 
  onClick 
}: { 
  tutorial: Tutorial; 
  isLocked: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={!isLocked ? onClick : undefined}
      className={cn(
        "group bg-white rounded-2xl overflow-hidden shadow-sm transition-all",
        !isLocked && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        isLocked && "opacity-75"
      )}
    >
      {/* Image */}
      <div className="relative aspect-video">
        <img
          src={tutorial.imageSource}
          alt={tutorial.title}
          className={cn(
            "w-full h-full object-cover",
            isLocked && "blur-sm"
          )}
        />
        {isLocked && <LockedBadge />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            DIFFICULTY_COLORS[tutorial.difficultyLevel] || "bg-gray-100 text-gray-700"
          )}>
            {tutorial.difficultyLevel}
          </span>
          {!isLocked && (
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-[#FF6B9D] group-hover:text-white transition-colors">
              <Play className="h-5 w-5 ml-0.5" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-xs text-[#9B5DE5] font-medium mb-1">
          {tutorial.styleCategory}
        </div>
        <h3 className="font-serif text-lg text-gray-800 mb-2 line-clamp-1">
          {tutorial.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{tutorial.toolsRequired.length} tools needed</span>
        </div>
        {tutorial.creatorCredit && (
          <div className="mt-2 text-xs text-gray-400">
            by {tutorial.creatorCredit}
          </div>
        )}
      </div>
    </div>
  );
}

function TutorialModal({ 
  tutorial, 
  onClose 
}: { 
  tutorial: Tutorial; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Image */}
        <div className="relative aspect-video">
          <img
            src={tutorial.imageSource}
            alt={tutorial.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
          >
            ✕
          </button>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium mb-2 inline-block",
              DIFFICULTY_COLORS[tutorial.difficultyLevel] || "bg-gray-100 text-gray-700"
            )}>
              {tutorial.difficultyLevel}
            </span>
            <h2 className="text-2xl font-serif text-white">{tutorial.title}</h2>
            {tutorial.creatorCredit && (
              <p className="text-white/80 text-sm mt-1">by {tutorial.creatorCredit}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tools */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-lg">🛠️</span> Tools Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {tutorial.toolsRequired.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-[#FFF5F8] text-[#FF6B9D] rounded-full text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-lg">📝</span> Tutorial Steps
            </h3>
            <div className="prose prose-sm max-w-none">
              {tutorial.tutorialContent.split('\n').map((line, idx) => (
                <p key={idx} className="text-gray-600 mb-2">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}