import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoadingSpinner from "./components/ui/loading-spinner";
import { ScrollToTop } from "@/components/ScrollToTop";

const About = lazy(() => import("./pages/About"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Suspense
              fallback={
                <div className="flex-1 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              }
            >
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<About />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </Suspense>
            <Toaster />
            <Sonner />
            <ScrollToTop />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;