import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <Loader2 
      className={cn("h-6 w-6 animate-spin text-emerald-600", className)} 
    />
  );
};

export default LoadingSpinner;