import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="md:ml-[240px] min-h-screen pt-14 md:pt-0">{children}</main>
    </div>
  );
};
