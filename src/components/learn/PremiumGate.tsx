import { Lock } from "lucide-react";

export function PremiumGate() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl border border-border/60 bg-muted/30">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Lock className="w-5 h-5 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">Premium Content</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        This content will be available with a premium subscription. Coming soon.
      </p>
    </div>
  );
}
