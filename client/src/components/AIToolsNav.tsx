import { Link, useLocation } from "wouter";
import { Wand2, Search, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

const AI_TOOLS = [
  {
    id: "create",
    label: "Create a Design",
    description: "AI generates nail designs from text prompts",
    icon: Wand2,
    path: "/",
    gradient: "from-[#FF6B9D] to-[#9B5DE5]"
  },
  {
    id: "critique",
    label: "AI Critique",
    description: "Upload your nails for professional feedback",
    icon: Search,
    path: "/ai-critique",
    gradient: "from-[#9B5DE5] to-[#00D9FF]"
  },
  {
    id: "edit",
    label: "Content Editing",
    description: "Edit your nail photos - add props, change colors, backgrounds",
    icon: Pencil,
    path: "/content-editing",
    gradient: "from-[#00D9FF] to-[#FF6B9D]"
  }
];

export function AIToolsNav() {
  const [location] = useLocation();

  return (
    <div className="mb-12">
      <div className="flex items-center justify-center gap-3 mb-6">
        <h2 className="text-3xl font-serif tracking-wider uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
          AI Design Studio
        </h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {AI_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = location === tool.path;
          
          return (
            <Link key={tool.id} href={tool.path}>
              <div className={cn(
                "p-6 rounded-2xl border-2 transition-all cursor-pointer group",
                isActive 
                  ? `bg-gradient-to-r ${tool.gradient} border-transparent shadow-lg` 
                  : "border-gray-200 hover:border-[#FF6B9D] hover:shadow-md"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-xl mb-4 flex items-center justify-center",
                  isActive ? "bg-white/20" : `bg-gradient-to-r ${tool.gradient}`
                )}>
                  <Icon className={cn("h-6 w-6", isActive ? "text-white" : "text-white")} />
                </div>
                
                <h3 className={cn(
                  "text-lg font-semibold mb-2",
                  isActive ? "text-white" : "text-gray-800 group-hover:text-[#FF6B9D]"
                )}>
                  {tool.label}
                </h3>
                
                <p className={cn(
                  "text-sm",
                  isActive ? "text-white/90" : "text-gray-500"
                )}>
                  {tool.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
