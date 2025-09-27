import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QueryInputProps {
  onSubmit: (query: string, mode?: 'search' | 'compare' | 'summarize', preference?: 'default' | 'best_camera' | 'best_battery' | 'best_value') => void;
  isLoading?: boolean;
  placeholder?: string;
}

const QueryInput = ({ 
  onSubmit, 
  isLoading = false,
  placeholder = "Enter your research query here... e.g., 'Compare top 5 wireless headphones under $200'"
}: QueryInputProps) => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<'search' | 'compare' | 'summarize'>("search");
  const [preference, setPreference] = useState<'default' | 'best_camera' | 'best_battery' | 'best_value'>("default");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a search query before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(query.trim(), mode, preference);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="shadow-strong shadow-glow bg-card/90 backdrop-blur-md border-2 border-primary/40 max-w-lg mx-auto rounded-xl">
      <div className="p-3 sm:p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm sm:text-base font-semibold text-foreground">Chatbot</h3>
          <span className="ml-auto hidden sm:block text-xs text-muted-foreground">Mode</span>
          <div className="flex items-center gap-1">
            <button
              className={`px-2 py-1 rounded text-[11px] border ${mode === 'search' ? 'bg-primary text-white' : 'bg-muted'} `}
              onClick={() => setMode('search')}
              disabled={isLoading}
            >
              Search
            </button>
            <button
              className={`px-2 py-1 rounded text-[11px] border ${mode === 'compare' ? 'bg-primary text-white' : 'bg-muted'} `}
              onClick={() => setMode('compare')}
              disabled={isLoading}
            >
              Compare
            </button>
            <button
              className={`px-2 py-1 rounded text-[11px] border ${mode === 'summarize' ? 'bg-primary text-white' : 'bg-muted'} `}
              onClick={() => setMode('summarize')}
              disabled={isLoading}
            >
              Summarize
            </button>
          </div>
        </div>
        
        
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[56px] sm:min-h-[72px] resize-none border-2 focus:border-primary transition-colors text-xs sm:text-sm"
          disabled={isLoading}
        />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            Press <kbd className="px-2 py-1 text-xs bg-muted rounded">Ctrl + Enter</kbd> to submit
          </p>
          
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !query.trim()}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 w-full sm:w-auto"
            size="sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                <span className="hidden sm:inline">Processing...</span>
                <span className="sm:hidden">Processing</span>
              </>
            ) : (
              <>
                <Search className="h-3.5 w-3.5 mr-2" />
                <span className="hidden sm:inline">Analyze Query</span>
                <span className="sm:hidden">Search</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QueryInput;