import { useMemo } from "react";
import { useAgentState } from "@/context/AgentState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Activity,
  DollarSign,
  Users,
  Star
} from "lucide-react";

// Default analytics data (fallback)
const defaultPriceDistribution = [
  { range: "$0-100", count: 45, percentage: 23 },
  { range: "$100-200", count: 78, percentage: 39 },
  { range: "$200-300", count: 42, percentage: 21 },
  { range: "$300-400", count: 23, percentage: 12 },
  { range: "$400+", count: 12, percentage: 6 }
];

const defaultBrandAnalysis = [
  { name: "Sony", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Apple", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Bose", value: 22, color: "hsl(var(--chart-3))" },
  { name: "Samsung", value: 15, color: "hsl(var(--chart-4))" }
];

const ratingTrends = [
  { month: "Jan", avgRating: 4.2, reviews: 1200 },
  { month: "Feb", avgRating: 4.3, reviews: 1350 },
  { month: "Mar", avgRating: 4.4, reviews: 1100 },
  { month: "Apr", avgRating: 4.6, reviews: 1600 },
  { month: "May", avgRating: 4.5, reviews: 1400 },
  { month: "Jun", avgRating: 4.7, reviews: 1800 }
];

const defaultTopInsights = [
  {
    title: "Average Price Trend",
    value: "$289.50",
    change: "-5.2%",
    trend: "down",
    icon: DollarSign,
    description: "Compared to last month"
  },
  {
    title: "Total Products Analyzed",
    value: "2,847",
    change: "+12.3%",
    trend: "up", 
    icon: BarChart3,
    description: "This month"
  },
  {
    title: "Average Rating",
    value: "4.5",
    change: "+0.2",
    trend: "up",
    icon: Star,
    description: "Out of 5 stars"
  },
  {
    title: "User Engagement",
    value: "89.2%",
    change: "+3.1%",
    trend: "up",
    icon: Users,
    description: "Query completion rate"
  }
];

const Analytics = () => {
  const { query, results, isProcessing } = useAgentState();

  // Compute analytics from current results
  const { priceDistribution, brandAnalysis, topInsights } = useMemo(() => {
    if (!results || results.length === 0) {
      return {
        priceDistribution: defaultPriceDistribution,
        brandAnalysis: defaultBrandAnalysis,
        topInsights: defaultTopInsights,
      };
    }

    // Price buckets in thousands for INR-like pricing
    const buckets = [
      { range: "₹0-25k", min: 0, max: 25000, count: 0 },
      { range: "₹25k-40k", min: 25000, max: 40000, count: 0 },
      { range: "₹40k-50k", min: 40000, max: 50000, count: 0 },
      { range: "₹50k-80k", min: 50000, max: 80000, count: 0 },
      { range: "₹80k+", min: 80000, max: Number.MAX_SAFE_INTEGER, count: 0 },
    ];

    const priceNums = results.map(r => Number(r.price.replace(/[^0-9.]/g, "")) || 0);
    priceNums.forEach(p => {
      const bucket = buckets.find(b => p >= b.min && p < b.max);
      if (bucket) bucket.count += 1;
    });
    const total = Math.max(1, results.length);
    const priceDistribution = buckets.map(b => ({ range: b.range, count: b.count, percentage: Math.round((b.count / total) * 100) }));

    // Fake brand breakdown from names for demo purposes
    const nameStr = results.map(r => r.name).join(" ").toLowerCase();
    const brands = ["dell", "hp", "lenovo", "acer", "asus", "msi", "samsung", "apple"] as const;
    const brandCounts = brands.map(brand => ({ name: brand[0].toUpperCase() + brand.slice(1), value: (nameStr.match(new RegExp(brand, 'g')) || []).length }));
    const sumBrands = brandCounts.reduce((a, b) => a + b.value, 0) || 1;
    const palette = ["hsl(var(--chart-1))","hsl(var(--chart-2))","hsl(var(--chart-3))","hsl(var(--chart-4))","hsl(var(--chart-5))","hsl(var(--primary))","hsl(var(--secondary))","hsl(var(--muted))"];
    const brandAnalysis = brandCounts
      .filter(b => b.value > 0)
      .map((b, i) => ({ name: b.name, value: Math.round((b.value / sumBrands) * 100), color: palette[i % palette.length] }))
      .slice(0, 5);
    if (brandAnalysis.length === 0) brandAnalysis.push({ name: "Other", value: 100, color: "hsl(var(--chart-1))" });

    const avgPrice = Math.round(priceNums.reduce((a, b) => a + b, 0) / total);
    const avgRating = (results.reduce((a, r) => a + (r.rating || 0), 0) / total).toFixed(1);

    const topInsights = [
      { title: "Average Price", value: `₹${avgPrice.toLocaleString()}`, change: "—", trend: "up", icon: DollarSign, description: query ? `Based on "${query}"` : "Current results" },
      { title: "Items Analyzed", value: String(total), change: "+", trend: "up", icon: BarChart3, description: "Current session" },
      { title: "Average Rating", value: String(avgRating), change: "±", trend: "up", icon: Star, description: "Out of 5" },
      { title: "Processing", value: isProcessing ? "Running" : "Idle", change: "—", trend: "up", icon: Activity, description: "Agent status" },
    ];

    return { priceDistribution, brandAnalysis, topInsights };
  }, [results, query, isProcessing]);
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <span>Analytics & Insights</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Data-driven insights from your research queries and comparisons
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topInsights.map((insight, index) => (
      <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{insight.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {insight.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <Badge 
                      variant={insight.trend === "up" ? "default" : "secondary"}
                      className={insight.trend === "up" ? "bg-success" : "bg-warning"}
                    >
                      {insight.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">
                      {insight.description}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <insight.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price Distribution */}
    <Card className="shadow-medium transition-all duration-300 hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Price Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Brand Analysis */}
    <Card className="shadow-medium transition-all duration-300 hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              <span>Brand Market Share</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={brandAnalysis}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {brandAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {brandAnalysis.map((brand, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: brand.color }}
                  />
                  <span className="text-sm text-foreground">
                    {brand.name} ({brand.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Trends */}
  <Card className="shadow-medium transition-all duration-300 hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Rating Trends Over Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={ratingTrends}>
              <defs>
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                domain={[4.0, 5.0]}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="avgRating"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorRating)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;