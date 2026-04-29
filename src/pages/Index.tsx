import { useUserRole } from "@/hooks/useUserRole";
import AdminDashboard from "./dashboards/AdminDashboard";
import BarberDashboard from "./dashboards/BarberDashboard";
import ClientDashboard from "./dashboards/ClientDashboard";

const Index = () => {
  const { role, loading } = useUserRole();
  if (loading) return <div className="p-8 text-muted-foreground text-sm">Loading...</div>;
  if (role === "admin") return <AdminDashboard />;
  if (role === "barber") return <BarberDashboard />;
  return <ClientDashboard />;
};

export default Index;
