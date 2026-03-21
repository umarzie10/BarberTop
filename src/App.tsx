import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { AIChatPanel } from "@/components/ai/AIChatPanel";
import Index from "./pages/Index";
import Pipeline from "./pages/Pipeline";
import Contacts from "./pages/Contacts";
import Analytics from "./pages/Analytics";
import Leads from "./pages/Leads";
import Activities from "./pages/Activities";
import Communications from "./pages/Communications";
import Integrations from "./pages/Integrations";
import Automation from "./pages/Automation";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import WorkspaceSelector from "./pages/WorkspaceSelector";
import EducationModule from "./pages/modules/EducationModule";
import GovernmentModule from "./pages/modules/GovernmentModule";
import HealthcareModule from "./pages/modules/HealthcareModule";
import RealEstateModule from "./pages/modules/RealEstateModule";
import LogisticsModule from "./pages/modules/LogisticsModule";
import EcommerceModule from "./pages/modules/EcommerceModule";
import SupportModule from "./pages/modules/SupportModule";
import FinanceModule from "./pages/modules/FinanceModule";
import ProductionModule from "./pages/modules/ProductionModule";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <WorkspaceProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/pipeline" element={<Pipeline />} />
                            <Route path="/contacts" element={<Contacts />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/leads" element={<Leads />} />
                            <Route path="/activities" element={<Activities />} />
                            <Route path="/communications" element={<Communications />} />
                            <Route path="/integrations" element={<Integrations />} />
                            <Route path="/automation" element={<Automation />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/workspace" element={<WorkspaceSelector />} />
                            <Route path="/education" element={<EducationModule />} />
                            <Route path="/government" element={<GovernmentModule />} />
                            <Route path="/healthcare" element={<HealthcareModule />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </AppLayout>
                        <AIChatPanel />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </WorkspaceProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
