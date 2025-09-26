import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type AgentMode = 'search' | 'compare' | 'summarize';
export type Preference = 'default' | 'best_camera' | 'best_battery' | 'best_value';

export interface ProductResult {
  name: string;
  price: string; // e.g., "45,000" or "₹45,000"
  rating: number;
  specifications: string[];
  link: string;
  image: string;
}

interface AgentState {
  query: string;
  mode: AgentMode;
  preference: Preference;
  isProcessing: boolean;
  agentStep: number;
  results: ProductResult[];
  submit: (query: string, mode?: AgentMode, preference?: Preference) => void;
}

const AgentContext = createContext<AgentState | undefined>(undefined);

const mockResults: ProductResult[] = [
  { name: "Dell Inspiron 15 3000", price: "45,000", rating: 4.2, specifications: ["Intel i5", "8GB RAM", "512GB SSD"], link: "#", image: "" },
  { name: "HP Pavilion 14", price: "48,500", rating: 4.5, specifications: ["AMD Ryzen 5", "16GB RAM", "512GB SSD"], link: "#", image: "" },
  { name: "Lenovo IdeaPad 3", price: "42,000", rating: 4.1, specifications: ["Intel i5", "8GB RAM", "1TB HDD"], link: "#", image: "" },
  { name: "Acer Aspire 5", price: "49,000", rating: 4.3, specifications: ["Intel i7", "12GB RAM", "512GB SSD"], link: "#", image: "" },
  { name: "ASUS VivoBook 15", price: "46,500", rating: 4.4, specifications: ["AMD Ryzen 7", "16GB RAM", "512GB SSD"], link: "#", image: "" },
  { name: "MSI Modern 14", price: "47,800", rating: 4.0, specifications: ["Intel i5", "8GB RAM", "256GB SSD"], link: "#", image: "" }
];

function parsePriceToNumber(price: string): number {
  const digits = price.replace(/[^0-9.]/g, "");
  const value = Number(digits);
  return isNaN(value) ? 0 : value;
}

export function AgentStateProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState<string>("");
  const [mode, setMode] = useState<AgentMode>('search');
  const [preference, setPreference] = useState<Preference>('default');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [agentStep, setAgentStep] = useState<number>(0);
  const [results, setResults] = useState<ProductResult[]>([]);

  const submit = (q: string, m: AgentMode = 'search', p: Preference = 'default') => {
    setQuery(q);
    setMode(m);
    setPreference(p);
    setIsProcessing(true);
    setAgentStep(0);

    // Simulate agent pipeline progression
    const timeline = [700, 1200, 900, 800, 600];
    let accumulated = 0;
    timeline.forEach((ms, idx) => {
      accumulated += ms;
      setTimeout(() => setAgentStep(idx), accumulated);
    });

    // Simple query-aware filtering for demo e.g., "laptop under 50k"
    const normalized = q.toLowerCase();
    let final = mockResults;
    if (normalized.includes("under 50k") || normalized.includes("under 50000") || normalized.includes("under ₹50,000")) {
      final = mockResults.filter(r => parsePriceToNumber(r.price) <= 50000);
    }

    // Value-for-money score and preference ranking
    const scored = final.map(r => {
      const price = parsePriceToNumber(r.price) || 1;
      const rating = r.rating || 0;
      const hasCamera = r.specifications.join(" ").toLowerCase().includes("camera");
      const hasBattery = r.specifications.join(" ").toLowerCase().includes("battery");
      // Lower price better: invert scale; simple heuristic
      const normPrice = 1 / price; // smaller price -> larger score
      const baseScore = normPrice * 100000 + rating * 10; // scale price impact to be meaningful
      const cameraBoost = p === 'best_camera' && hasCamera ? 5 : 0;
      const batteryBoost = p === 'best_battery' && hasBattery ? 5 : 0;
      const valueBoost = p === 'best_value' ? rating * 2 - price / 100000 : 0;
      const score = baseScore + cameraBoost + batteryBoost + valueBoost;
      return { ...r, _score: score } as ProductResult & { _score: number };
    }) as (ProductResult & { _score: number })[];
    scored.sort((a, b) => b._score - a._score);
    const ranked = scored.map(({ _score, ...rest }) => rest);

    setTimeout(() => {
      setResults(ranked);
      setIsProcessing(false);
    }, accumulated + 500);
  };

  const value = useMemo<AgentState>(() => ({ query, mode, preference, isProcessing, agentStep, results, submit }), [query, mode, preference, isProcessing, agentStep, results]);

  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  );
}

export function useAgentState(): AgentState {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgentState must be used within AgentStateProvider");
  return ctx;
}


