
import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SecurityWrapper } from "@/components/security/SecurityWrapper";
import Landing from "./pages/Landing";
import ThankYou from "./pages/ThankYou";
import BackRedirect from "./pages/BackRedirect";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const LP_KEYS = Array.from({ length: 7 }, (_, index) => {
  const id = String(index + 1).padStart(2, "0");
  return `lp${id}`;
});

const LEGACY_LP_KEYS = Array.from({ length: 7 }, (_, index) => {
  const id = String(index + 1).padStart(2, "0");
  return `lp-${id}`;
});

const MetaPixelPageViewTracker = () => {
  const location = useLocation();
  const hasTrackedInitial = useRef(false);

  useEffect(() => {
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (!fbq) return;

    // O snippet do Pixel já dispara um PageView no carregamento inicial.
    // Aqui disparamos apenas em mudanças de rota (SPA) para evitar duplicar.
    if (!hasTrackedInitial.current) {
      hasTrackedInitial.current = true;
      return;
    }

    fbq("track", "PageView");
  }, [location.pathname, location.search]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecurityWrapper>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MetaPixelPageViewTracker />
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
            <Route path="/lp08" element={<Navigate to="/lp06" replace />} />
            <Route path="/lp09" element={<Navigate to="/lp06" replace />} />
            <Route path="/lp10" element={<Navigate to="/lp06" replace />} />
            <Route path="/lp-08" element={<Navigate to="/lp06" replace />} />
            <Route path="/lp-09" element={<Navigate to="/lp06" replace />} />
            <Route path="/lp-10" element={<Navigate to="/lp06" replace />} />
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
