import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "An error occurred.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="rounded-full bg-destructive/10 p-3 text-destructive">
        <AlertCircle className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-destructive">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          Retry
        </Button>
      )}
    </div>
  );
}
