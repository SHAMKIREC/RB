import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import FixPanel from "./FixPanel";
import Footer from "./Footer";
import { useTheme } from "../hooks/useTheme";
import { endAdminSession, isAdminSessionActive, subscribeToAdminSession } from "../lib/adminSession";
import { disableInlineEditMode } from "../lib/pricingStorage";
import OwnerFloatingPanel from "./OwnerFloatingPanel";

export default function Layout() {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const [adminSessionActive, setAdminSessionActive] = useState(false);
  const isAdminRoute = pathname.startsWith('/admin');
  const showAdminNavigation = adminSessionActive && !isAdminRoute;

  useEffect(() => {
    isAdminSessionActive().then(setAdminSessionActive);
    return subscribeToAdminSession(setAdminSessionActive);
  }, [pathname]);

  const exitAdminSession = async () => {
    disableInlineEditMode();
    await endAdminSession();
    setAdminSessionActive(false);
  };

  return (
    <div className="min-h-screen bg-background light-grid">
      <Header theme={theme} onToggleTheme={toggle} />
      <main className={`page-${pathname.split('/')[1] || 'home'} ${isAdminRoute ? 'pb-0' : 'pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0'} pt-16 sm:pt-20`}>
        {showAdminNavigation && <OwnerFloatingPanel onExit={exitAdminSession} />}
        <Outlet />
      </main>
      <Footer />
      <FixPanel />
    </div>
  );
}
