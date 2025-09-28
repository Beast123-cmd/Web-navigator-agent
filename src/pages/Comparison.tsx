import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  GitCompareArrows, 
  Download, 
  Filter,
  Search,
  Star,
  ExternalLink,
  SortAsc,
  SortDesc
} from "lucide-react";
import { useAgentState } from "@/context/AgentState";

// Default comparison data
const defaultComparisonData = [
  {
    id: 1,
    name: "Sony WH-1000XM5",
    price: "₹31033.61",
    rating: 4.8,
    features: ["Noise Cancelling", "30h Battery", "Touch Controls"],
    link: "https://example.com/sony",
    category: "Premium"
  },
  {
    id: 2,
    name: "Bose QuietComfort 45",
    price: "₹29260.21", 
    rating: 4.7,
    features: ["Noise Cancelling", "24h Battery", "Voice Assistant"],
    link: "https://example.com/bose",
    category: "Premium"
  },
  {
    id: 3,
    name: "Apple AirPods Max",
    price: "₹48767.61",
    rating: 4.6,
    features: ["Spatial Audio", "20h Battery", "Digital Crown"],
    link: "https://example.com/apple",
    category: "Luxury"
  },
  {
    id: 4,
    name: "Sennheiser HD 660S",
    price: "₹44334.11",
    rating: 4.9,
    features: ["Open-back", "Audiophile", "Replaceable Cable"],
    link: "https://example.com/sennheiser",
    category: "Audiophile"
  },
  {
    id: 5,
    name: "Audio-Technica ATH-M50x",
    price: "₹13299.61",
    rating: 4.5,
    features: ["Studio Monitor", "Foldable", "Detachable Cable"],
    link: "https://example.com/audiotechnica",
    category: "Professional"
  }
];

type SortField = 'name' | 'price' | 'rating';
type SortDirection = 'asc' | 'desc';

const Comparison = () => {
  const { results, query } = useAgentState();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('rating');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterCategory, setFilterCategory] = useState("");

  const comparisonData = useMemo(() => {
    if (!results || results.length === 0) return defaultComparisonData;
    return results.map((r, idx) => ({
      id: idx + 1,
      name: r.name,
      price: `₹${r.price}`,
      rating: r.rating || 0,
      features: r.specifications.slice(0, 3),
      link: r.link || "#",
      category: Number(String(r.price).replace(/[^0-9.]/g, "")) > 50000 ? "Premium" : "Value",
    }));
  }, [results]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedAndFilteredData = comparisonData
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "" || item.category === filterCategory)
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = parseFloat(a.price.replace('$', ''));
          bValue = parseFloat(b.price.replace('$', ''));
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const categories = [...new Set(comparisonData.map(item => item.category))];

  const exportToCsv = () => {
    const headers = ['Name', 'Price', 'Rating', 'Features', 'Category', 'Link'];
    const csvData = [
      headers,
      ...sortedAndFilteredData.map(item => [
        item.name,
        item.price,
        item.rating.toString(),
        item.features.join('; '),
        item.category,
        item.link
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comparison-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <GitCompareArrows className="h-8 w-8 text-primary" />
            <span>Product Comparison</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Compare products side by side with detailed analysis
          </p>
        </div>
        
        <Button 
          onClick={exportToCsv}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Controls */}
      <Card className="shadow-medium">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>
            Comparison Results ({sortedAndFilteredData.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Product Name</span>
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? 
                          <SortAsc className="h-4 w-4" /> : 
                          <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Price</span>
                      {sortField === 'price' && (
                        sortDirection === 'asc' ? 
                          <SortAsc className="h-4 w-4" /> : 
                          <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Rating</span>
                      {sortField === 'rating' && (
                        sortDirection === 'asc' ? 
                          <SortAsc className="h-4 w-4" /> : 
                          <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-lg font-semibold text-primary">
                      {item.price}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-medium">{item.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(item.link, '_blank')}
                        className="flex items-center space-x-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Comparison;