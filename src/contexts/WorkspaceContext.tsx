import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type WorkspaceType = 
  | "sales" 
  | "education" 
  | "government" 
  | "healthcare" 
  | "realestate" 
  | "logistics" 
  | "ecommerce" 
  | "support" 
  | "finance" 
  | "production";

export interface WorkspaceInfo {
  type: WorkspaceType;
  label: Record<string, string>;
  icon: string;
  description: Record<string, string>;
}

export const workspaceTypes: WorkspaceInfo[] = [
  { type: "sales", icon: "💰", label: { uz: "Savdo CRM", ru: "CRM Продаж", en: "Sales CRM" }, description: { uz: "Savdo pipeline, bitimlar, leadlar", ru: "Воронка продаж, сделки, лиды", en: "Sales pipeline, deals, leads" } },
  { type: "education", icon: "🎓", label: { uz: "Ta'lim CRM", ru: "CRM Образования", en: "Education CRM" }, description: { uz: "Talabalar, kurslar, to'lovlar, davomat", ru: "Студенты, курсы, платежи, посещаемость", en: "Students, courses, payments, attendance" } },
  { type: "government", icon: "💧", label: { uz: "Davlat CRM", ru: "Гос. CRM", en: "Government CRM" }, description: { uz: "Murojaatlar, hududiy nazorat, hisobotlar", ru: "Обращения, региональный контроль, отчёты", en: "Complaints, regional control, reports" } },
  { type: "healthcare", icon: "🏥", label: { uz: "Tibbiyot CRM", ru: "CRM Медицины", en: "Healthcare CRM" }, description: { uz: "Bemorlar, navbat, tibbiy tarix", ru: "Пациенты, очередь, медицинская история", en: "Patients, queue, medical history" } },
  { type: "realestate", icon: "🏠", label: { uz: "Ko'chmas mulk CRM", ru: "CRM Недвижимости", en: "Real Estate CRM" }, description: { uz: "Uylar bazasi, xaridorlar, agentlar", ru: "База объектов, покупатели, агенты", en: "Property database, buyers, agents" } },
  { type: "logistics", icon: "📦", label: { uz: "Logistika CRM", ru: "CRM Логистики", en: "Logistics CRM" }, description: { uz: "Buyurtmalar, yetkazish, haydovchilar", ru: "Заказы, доставка, водители", en: "Orders, delivery, drivers" } },
  { type: "ecommerce", icon: "🛒", label: { uz: "E-commerce CRM", ru: "CRM E-commerce", en: "E-commerce CRM" }, description: { uz: "Onlayn buyurtmalar, mijozlar, to'lovlar", ru: "Онлайн заказы, клиенты, платежи", en: "Online orders, customers, payments" } },
  { type: "support", icon: "📱", label: { uz: "Support CRM", ru: "CRM Поддержки", en: "Support CRM" }, description: { uz: "Ticketlar, murojaatlar, chat", ru: "Тикеты, обращения, чат", en: "Tickets, requests, chat" } },
  { type: "finance", icon: "🏦", label: { uz: "Moliya CRM", ru: "CRM Финансов", en: "Finance CRM" }, description: { uz: "Mijozlar, kreditlar, to'lovlar", ru: "Клиенты, кредиты, платежи", en: "Clients, credits, payments" } },
  { type: "production", icon: "🏭", label: { uz: "Ishlab chiqarish CRM", ru: "CRM Производства", en: "Production CRM" }, description: { uz: "Buyurtmalar, jarayon, ombor", ru: "Заказы, процесс, склад", en: "Orders, process, warehouse" } },
];

interface WorkspaceContextType {
  workspace: WorkspaceType;
  setWorkspace: (ws: WorkspaceType) => void;
  getWorkspaceInfo: () => WorkspaceInfo;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspace: "sales",
  setWorkspace: () => {},
  getWorkspaceInfo: () => workspaceTypes[0],
});

export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspace, setWorkspace] = useState<WorkspaceType>(() => {
    return (localStorage.getItem("forge-workspace") as WorkspaceType) || "sales";
  });

  useEffect(() => {
    localStorage.setItem("forge-workspace", workspace);
  }, [workspace]);

  const getWorkspaceInfo = () => workspaceTypes.find(w => w.type === workspace) || workspaceTypes[0];

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace, getWorkspaceInfo }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
