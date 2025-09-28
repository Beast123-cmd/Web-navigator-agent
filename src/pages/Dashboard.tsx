import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import QueryInput from "@/components/QueryInput";
import SearchResults from "@/components/SearchResults";
import AgentFlow from "@/components/AgentFlow";
import { useAgentState } from "@/context/AgentState";
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Zap,
  ArrowRight,
  CheckCircle,
  Search
} from "lucide-react";

// Mock data for dashboard stats
const stats = [
  {
    title: "Queries Processed",
    value: "2,847",
    change: "+12.5%",
    icon: Zap,
    trend: "up"
  },
  {
    title: "Data Sources",
    value: "156",
    change: "+3.2%", 
    icon: Globe,
    trend: "up"
  },
  {
    title: "Active Users",
    value: "847",
    change: "+8.1%",
    icon: Users,
    trend: "up"
  },
  {
    title: "Success Rate",
    value: "98.2%",
    change: "+0.3%",
    icon: TrendingUp,
    trend: "up"
  }
];

const recentQueries = [
  {
    query: "Compare top 5 laptops under ₹80,000",
    status: "completed",
    results: 127,
    timestamp: "2 hours ago"
  },
  {
    query: "Best wireless headphones for gaming",
    status: "completed", 
    results: 89,
    timestamp: "4 hours ago"
  },
  {
    query: "Electric vehicle comparison 2024",
    status: "processing",
    results: 0,
    timestamp: "6 hours ago"
  }
];

// Mock search results data
const mockSearchResults = [
  {
    name: "Dell Inspiron 15 3000",
    price: "45,000",
    rating: 4.2,
    specifications: ["Intel i5", "8GB RAM", "512GB SSD"],
    link: "#",
    image: ""
  },
  {
    name: "HP Pavilion 14",
    price: "48,500",
    rating: 4.5,
    specifications: ["AMD Ryzen 5", "16GB RAM", "512GB SSD"],
    link: "#",
    image: ""
  },
  {
    name: "Lenovo IdeaPad 3",
    price: "42,000",
    rating: 4.1,
    specifications: ["Intel i5", "8GB RAM", "1TB HDD"],
    link: "#",
    image: ""
  },
  {
    name: "Acer Aspire 5",
    price: "49,000",
    rating: 4.3,
    specifications: ["Intel i7", "12GB RAM", "512GB SSD"],
    link: "#",
    image: ""
  },
  {
    name: "ASUS VivoBook 15",
    price: "46,500",
    rating: 4.4,
    specifications: ["AMD Ryzen 7", "16GB RAM", "512GB SSD"],
    link: "#",
    image: ""
  },
  {
    name: "MSI Modern 14",
    price: "47,800",
    rating: 4.0,
    specifications: ["Intel i5", "8GB RAM", "256GB SSD"],
    link: "#",
    image: ""
  }
];

const Dashboard = () => {
  const { query, mode, isProcessing, agentStep, results, submit } = useAgentState();
  const [hasSearched, setHasSearched] = useState(false);

  const handleQuerySubmit = async (q: string, m: 'search' | 'compare' | 'summarize' = 'search') => {
    setHasSearched(true);
    submit(q, m);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content - Top Section */}
      <div className="container mx-auto px-4 sm:px-6 py-6 pb-32">
        {/* Hero Section */}
        <div className="relative overflow-hidden mb-8">
          <div className="bg-gradient-hero rounded-2xl p-6 sm:p-8 text-center shadow-strong">
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Web Navigator AI Agent
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                Intelligent data analysis and comparison platform powered by AI
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm sm:text-base">Real-time Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm sm:text-base">Smart Comparisons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm sm:text-base">Data Insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Flow */}
        <div className="mb-6">
          <AgentFlow isActive={isProcessing} currentStep={agentStep} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="animate-card-hover animate-fade-in-up shadow-soft" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-lg sm:text-2xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-success mt-1">{stat.change}</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-lg animate-pulse-slow">
                    <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Results Display */}
        {hasSearched && (
          <div className="mb-8 animate-fade-in-up">
            <SearchResults 
              query={`${mode.toUpperCase()}: ${query}`}
              isLoading={isProcessing}
              results={results as any}
            />
          </div>
        )}

        {/* Recent Activity - Only show if no search has been made */}
        {!hasSearched && (
          <div className="space-y-8">
            {/* Empty State */}
            <Card className="shadow-medium animate-fade-in-up">
              <CardContent className="p-12">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-bounce-gentle">
                    <Search className="h-10 w-10 text-primary-foreground" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-foreground">Start Your First Query</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Discover insights and compare data across multiple sources with our intelligent AI agents.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="group">
                      <Zap className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Try a Search
                    </Button>
                    <Button variant="outline" size="lg">
                      <Globe className="mr-2 h-4 w-4" />
                      Explore Features
                    </Button>
                  </div>
                  
                  <div className="pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-4">Popular search examples:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["laptops under 50k", "best smartphones 2024", "compare headphones", "electric vehicles"].map((example, index) => (
                        <Button
                          key={index}
                          variant="secondary"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleQuerySubmit(example)}
                        >
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-medium animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary animate-bounce-gentle" />
                  <span className="text-lg sm:text-xl">Recent Query Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQueries.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card-header rounded-lg space-y-2 sm:space-y-0 animate-slide-in-right hover:bg-muted/50 transition-colors" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.query}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.timestamp}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {item.status === "completed" && (
                          <div className="text-center">
                            <p className="text-sm font-medium text-foreground">
                              {item.results} results
                            </p>
                            <Badge variant="default" className="bg-success">
                              Completed
                            </Badge>
                          </div>
                        )}
                        {item.status === "processing" && (
                          <Badge variant="secondary">Processing</Badge>
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Fixed Bottom Query Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-strong z-50">
      <div className="container mx-auto px-4 sm:px-6 py-2">
          <QueryInput 
            onSubmit={handleQuerySubmit}
            isLoading={isProcessing}
            placeholder="Type your search query here... e.g., 'find laptop under 50k'"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;