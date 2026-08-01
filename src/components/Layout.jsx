import { Outlet } from "react-router-dom";
import Header from "./Header";
import FixPanel from "./FixPanel";
import MobileNav from "./MobileNav";
import Footer from "./Footer";
import { useTheme } from "../hooks/useTheme";

export default function Layout() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background light-grid">
      <Header theme={theme} onToggleTheme={toggle} />
      <main className="pt-16 sm:pt-20 pb-[140px] md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <FixPanel />
    </div>
  );
}