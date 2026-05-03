import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/Appointments";
import Services from "./pages/Services";
import Barbers from "./pages/Barbers";
import Clients from "./pages/Clients";
import Payments from "./pages/Payments";
import Book from "./pages/Book";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Plans from "./pages/Plans";
import Messages from "./pages/Messages";
import BarberDetail from "./pages/BarberDetail";
import BarberProfileEdit from "./pages/barber/BarberProfileEdit";
import BarberServicesPage from "./pages/barber/BarberServicesPage";
import BarberPortfolioPage from "./pages/barber/BarberPortfolioPage";
import BarberBookingsPage from "./pages/barber/BarberBookingsPage";
import BarberStatsPage from "./pages/barber/BarberStatsPage";
import BarberReviewsPage from "./pages/barber/BarberReviewsPage";
import BarberClientsPage from "./pages/barber/BarberClientsPage";
import BarberSchedulePage from "./pages/barber/BarberSchedulePage";
import { AIChatPanel } from "./components/ai/AIChatPanel";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/auth" element={<AuthRoute><Landing /></AuthRoute>} />
                <Route path="/auth/login" element={<AuthRoute><Auth /></AuthRoute>} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/appointments" element={<Appointments />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/barbers" element={<Barbers />} />
                        <Route path="/barbers/:id" element={<BarberDetail />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/payments" element={<Payments />} />
                        <Route path="/book" element={<Book />} />
                        <Route path="/my-bookings" element={<MyBookings />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/plans" element={<Plans />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/barber/profile" element={<BarberProfileEdit />} />
                        <Route path="/barber/services" element={<BarberServicesPage />} />
                        <Route path="/barber/portfolio" element={<BarberPortfolioPage />} />
                        <Route path="/barber/bookings" element={<BarberBookingsPage />} />
                        <Route path="/barber/stats" element={<BarberStatsPage />} />
                        <Route path="/barber/reviews" element={<BarberReviewsPage />} />
                        <Route path="/barber/clients" element={<BarberClientsPage />} />
                        <Route path="/barber/schedule" element={<BarberSchedulePage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <AIChatPanel />
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
