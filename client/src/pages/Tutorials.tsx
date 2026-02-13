import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const GOLD_TEXT = "text-[#B08D57]";

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

export default function Tutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    fetch("https://nail-check.com/wp-json/nail-check/v1/tutorials")
      .then(res => res.json())
      .then(data => {
        setTutorials(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch tutorials:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredTutorials = selectedFilter === "all" 
    ? tutorials 
    : tutorials.filter(t => t.styleCategory === selectedFilter);

  const categories = ["all", ...Array.from(new Set(tutorials.map(t => t.styleCategory)))];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-[#B08D57]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        <header className="text-center mb-12">
          <h1 className="text-5xl font-serif tracking-widest uppercase mb-4">
            The Collection
          </h1>
          <p className={`text-xs uppercase tracking-[0.3em] ${GOLD_TEXT}`}>
            {tutorials.length} Curated Designs
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-4 mb-12 pb-6 border-b border-gray-200">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`
                px-6 py-2 text-xs uppercase tracking-widest transition-all
                ${selectedFilter === category 
                  ? `${GOLD_TEXT} border-b-2 border-[#B08D57]` 
                  : "text-gray-500 hover:text-gray-900"
                }
              `}
            >
              {category === "all" ? "View All" : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/tutorial/${tutorial.id}`}>
                <a className="block">
                  <div className="bg-white transition-all duration-300 hover:shadow-2xl cursor-pointer">
                    {tutorial.imageSource && (
                      <div className="relative h-[400px] overflow-hidden">
                        <img
                          src={tutorial.imageSource as string}
                          alt={tutorial.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="p-6 border-l-2 border-[#B08D57]">
                      <span className={`text-[10px] uppercase tracking-wider ${GOLD_TEXT} font-bold block mb-2`}>
                        {tutorial.styleCategory}
                      </span>
                      <h3 className="text-lg font-serif mb-2 tracking-wide">
                        {tutorial.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {tutorial.tutorialContent.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredTutorials.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No tutorials found in this category</p>
          </div>
        )}
      </div>
    </Layout>
  );
}