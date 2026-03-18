import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { CommandMenu } from "../command/CommandMenu";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-[240px] min-h-screen">
        {children}
      </main>
      <CommandMenu />
    </div>
  );
};
