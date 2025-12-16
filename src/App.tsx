
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SecurityWrapper } from "@/components/security/SecurityWrapper";
import Landing from "./pages/Landing";
import ThankYou from "./pages/ThankYou";
import BackRedirect from "./pages/BackRedirect";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const LP_KEYS = Array.from({ length: 10 }, (_, index) => {
  const id = String(index + 1).padStart(2, "0");
  return `lp${id}`;
});

const LEGACY_LP_KEYS = Array.from({ length: 10 }, (_, index) => {
  const id = String(index + 1).padStart(2, "0");
  return `lp-${id}`;
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecurityWrapper>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/lp01" replace />} />
            {LP_KEYS.map((key) => (
              <Route key={key} path={`/${key}`} element={<Landing variantKeyOverride={key} />} />
            ))}
            {LEGACY_LP_KEYS.map((legacyKey, index) => (
              <Route
                key={legacyKey}
                path={`/${legacyKey}`}
                element={<Navigate to={`/${LP_KEYS[index]}`} replace />}
              />
            ))}
            <Route path="/obrigado" element={<ThankYou />} />
            <Route path="/ultima-chance" element={<BackRedirect />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SecurityWrapper>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
