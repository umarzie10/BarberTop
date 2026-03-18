import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Users,
  Kanban,
  BarChart3,
  Plus,
  Search,
} from "lucide-react";

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runAction = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buyruq yoki qidirish..." />
      <CommandList>
        <CommandEmpty>Hech narsa topilmadi.</CommandEmpty>
        <CommandGroup heading="Tezkor harakatlar">
          <CommandItem onSelect={() => runAction("/pipeline")}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi bitim qo'shish
          </CommandItem>
          <CommandItem onSelect={() => runAction("/contacts")}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi kontakt qo'shish
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Navigatsiya">
          <CommandItem onSelect={() => runAction("/")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => runAction("/pipeline")}>
            <Kanban className="mr-2 h-4 w-4" />
            Pipeline
          </CommandItem>
          <CommandItem onSelect={() => runAction("/contacts")}>
            <Users className="mr-2 h-4 w-4" />
            Kontaktlar
          </CommandItem>
          <CommandItem onSelect={() => runAction("/analytics")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analitika
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
