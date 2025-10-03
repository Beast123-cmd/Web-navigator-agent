// frontend/src/context/AgentState.tsx

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type AgentMode = "search" | "compare" | "summarize";
export type Preference = "default" | "best_camera" | "best_battery" | "best_value";

export interface ProductResult {
  name: string;
  price: string;
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

export function AgentStateProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState<string>("");
  const [mode, setMode] = useState<AgentMode>("search");
  const [preference, setPreference] = useState<Preference>("default");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [agentStep, setAgentStep] = useState<number>(0);
  const [results, setResults] = useState<ProductResult[]>([]);

  const submit = async (
    q: string,
    m: AgentMode = "search",
    p: Preference = "default"
  ) => {
    setQuery(q);
    setMode(m);
    setPreference(p);
    setIsProcessing(true);
    setAgentStep(0);

    // fake step animation (progression of agents: parser -> navigator -> extractor -> ranking -> summarizer)
    const timeline = [500, 900, 800, 700, 600];
    let accumulated = 0;
    timeline.forEach((ms, idx) => {
      accumulated += ms;
      setTimeout(() => setAgentStep(idx + 1), accumulated);
    });

    try {
      // ✅ call FastAPI backend
      const res = await fetch("http://127.0.0.1:8000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, mode: m, preference: p }),
      });

      if (!res.ok) {
        throw new Error("Backend request failed");
      }

      const data = await res.json();
      // expected structure: { products: [...], summary: "..." }
      setResults(data.products || []);
    } catch (err) {
      console.error("Error in agents pipeline:", err);
      setResults([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const value = useMemo<AgentState>(
    () => ({
      query,
      mode,
      preference,
      isProcessing,
      agentStep,
      results,
      submit,
    }),
    [query, mode, preference, isProcessing, agentStep, results]
  );

  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  );
}

export function useAgentState(): AgentState {
  const ctx = useContext(AgentContext);
  if (!ctx)
    throw new Error("useAgentState must be used within AgentStateProvider");
  return ctx;
}
