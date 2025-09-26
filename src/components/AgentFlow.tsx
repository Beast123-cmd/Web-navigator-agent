import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, ListChecks, MousePointerClick, Database, BarChart3, MessageSquare } from "lucide-react";

interface AgentFlowProps {
  isActive: boolean;
  currentStep: number; // 0..4
}

const steps = [
  { name: "Instruction Parser", desc: "Convert query to steps", icon: ListChecks },
  { name: "Navigator", desc: "Control browser & search", icon: MousePointerClick },
  { name: "Extractor", desc: "Scrape products & details", icon: Database },
  { name: "Comparator / Ranking", desc: "Rank by value", icon: BarChart3 },
  { name: "Summarizer", desc: "Pros/cons & summary", icon: MessageSquare },
];

const AgentFlow = ({ isActive, currentStep }: AgentFlowProps) => {
  return (
    <Card className="p-4 sm:p-6 shadow-medium">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-primary rounded-md">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Agent Pipeline</h3>
        </div>
        <Badge variant="secondary" className={isActive ? "animate-pulse" : ""}>
          {isActive ? "Running" : "Idle"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <div key={step.name} className="relative">
              <div
                className={
                  "rounded-xl border p-3 sm:p-4 h-full transition-all " +
                  (isCurrent
                    ? "border-primary shadow-glow bg-primary/5"
                    : isDone
                    ? "border-success/50 bg-success/5"
                    : "bg-card")
                }
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={
                      "h-9 w-9 rounded-lg flex items-center justify-center transition-all " +
                      (isCurrent
                        ? "bg-primary text-primary-foreground animate-pulse"
                        : isDone
                        ? "bg-success text-white"
                        : "bg-muted text-muted-foreground")
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{index + 1}. {step.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-1/2 right-[-10px] w-5 h-0.5 bg-border" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AgentFlow;


