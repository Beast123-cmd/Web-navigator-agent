import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Brain, 
  Zap, 
  Search, 
  BarChart3, 
  GitCompareArrows,
  Sparkles,
  CheckCircle,
  Users,
  Globe,
  TrendingUp
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Search,
      title: "Intelligent Search",
      description: "AI-powered search across multiple data sources with natural language processing"
    },
    {
      icon: GitCompareArrows,
      title: "Smart Comparisons",
      description: "Compare products, services, and data points with intelligent analysis"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Get instant insights and visualizations from your data queries"
    },
    {
      icon: Brain,
      title: "AI Agent Pipeline",
      description: "Advanced AI agents process and analyze your requests automatically"
    }
  ];

  const stats = [
    { label: "Queries Processed", value: "10K+" },
    { label: "Data Sources", value: "500+" },
    { label: "Active Users", value: "2K+" },
    { label: "Success Rate", value: "99.2%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="relative container mx-auto px-4 sm:px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 animate-fade-in-up">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Data Intelligence
            </Badge>
            
            <h1 className="mb-6 animate-fade-in-up">
              Navigate the Web with
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                Intelligent AI Agents
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up">
              Transform your data discovery experience with our advanced AI-powered platform. 
              Search, compare, and analyze information across multiple sources with unprecedented intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up">
              <Button size="lg" className="group" asChild>
                <Link to="/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/dashboard">
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in-up">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4">Powerful Features for Modern Data Discovery</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI agents work tirelessly to provide you with the most relevant and accurate information
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="animate-card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-gradient-primary rounded-2xl p-8 lg:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="mb-4">Ready to Transform Your Data Experience?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of users who are already discovering insights faster with our AI-powered platform
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="secondary" className="group" asChild>
                  <Link to="/login">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
