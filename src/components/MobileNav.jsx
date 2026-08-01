import { Link, useLocation } from "react-router-dom";
import { Home, Wrench, Calculator, Star, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function MobileNav() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const items = [
    { path: "/", label: "Главная", icon: Home, exact: true },
    { path: "/services", label: "Услуги", icon: Wrench },
    { path: "/calculator", label: "Расчёт", icon: Calculator },
    { path: "/reviews", label: "Отзывы", icon: Star },
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around py-2 px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-muted-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-[10px] font-medium">Тема</span>
        </button>
      </div>
    </nav>
  );
}