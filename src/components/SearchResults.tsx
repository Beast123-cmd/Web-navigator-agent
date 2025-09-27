import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Laptop, 
  Star, 
  ExternalLink, 
  Download,
  Filter,
  SortAsc,
  Loader2,
  Bot,
  Search,
  Zap
} from "lucide-react";

interface SearchResult {
  name: string;
  price: string;
  rating: number;
  specifications: string[];
  link: string;
  image: string;
}

interface SearchResultsProps {
  query: string;
  isLoading: boolean;
  results: SearchResult[];
}

const SearchResults = ({ query, isLoading, results }: SearchResultsProps) => {
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('rating');
  const [showAll, setShowAll] = useState(false);

  const aiAgentSteps = [
    { icon: Search, text: "Scanning web sources...", delay: 0 },
    { icon: Bot, text: "AI analyzing products...", delay: 1000 },
    { icon: Filter, text: "Filtering best matches...", delay: 2000 },
    { icon: Zap, text: "Generating insights...", delay: 3000 }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  // AI Agent Animation Effect
  useEffect(() => {
    if (isLoading) {
      setCurrentStep(0);
      aiAgentSteps.forEach((step, index) => {
        setTimeout(() => setCurrentStep(index), step.delay);
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Card className="shadow-medium">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-bounce">
                <Loader2 className="h-4 w-4 text-white animate-spin mt-1 ml-1" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">AI Agents Working</h3>
              <div className="space-y-3">
                {aiAgentSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-center space-x-3 transition-all duration-500 ${
                      index <= currentStep ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    <step.icon className={`h-5 w-5 ${index === currentStep ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                    <span className={`text-sm ${index === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {step.text}
                    </span>
                    {index === currentStep && (
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results.length) {
    return (
      <Card className="shadow-medium animate-fade-in-up">
        <CardContent className="p-12">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <Search className="h-10 w-10 text-primary-foreground" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">No Results Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any products matching "{query}". Try adjusting your search terms or filters.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Try Different Keywords
              </Button>
              <Button variant="ghost">
                <Filter className="mr-2 h-4 w-4" />
                Adjust Filters
              </Button>
            </div>
            
            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Suggested searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["laptops under 50k", "gaming laptops", "ultrabooks", "workstation laptops"].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      // This would trigger a new search
                      console.log(`Searching for: ${suggestion}`);
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayResults = showAll ? results : results.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Laptop className="h-5 w-5 text-primary" />
                <span>Search Results: "{query}"</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Found {results.length} products matching your criteria
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayResults.map((result, index) => (
          <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Product Image Placeholder */}
                <div className="w-full h-48 bg-gradient-subtle rounded-lg flex items-center justify-center">
                  <Laptop className="h-16 w-16 text-muted-foreground" />
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {result.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ₹{result.price}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{result.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {result.specifications.slice(0, 3).map((spec, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full" variant="outline" asChild>
                  <a href={result.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Product
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {results.length > 6 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(!showAll)}
            className="px-8"
          >
            {showAll ? 'Show Less' : `Show ${results.length - 6} More Results`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;