import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { endAdminSession, isAdminSessionActive, startAdminSession, subscribeToAdminSession } from '../lib/adminSession';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { enableInlineEditMode } from '../lib/pricingStorage';

export function AdminNavigation({ onExit }) {
  return <div className="border-b border-border bg-card/95"><div className="page-shell flex flex-wrap items-center gap-x-3 gap-y-2 py-2 text-xs font-bold sm:gap-3"><span className="text-muted-foreground">Администрирование:</span><Link to="/admin/orders" className="hover:text-primary">Заказы</Link><Link to="/admin/projects" className="hover:text-primary">Проекты</Link><Link to="/admin/reviews" className="hover:text-primary">Отзывы</Link><Link to="/" onClick={enableInlineEditMode} className="basis-full hover:text-primary sm:basis-auto">Открыть сайт</Link><button onClick={onExit} className="ml-auto inline-flex items-center gap-1 text-destructive"><LogOut className="h-3.5 w-3.5"/>Выйти</button></div></div>;
}

export default function AdminGate({ children }) {
  const [allowed, setAllowed] = useState(false); const [loading, setLoading] = useState(true); const [pin, setPin] = useState(''); const [error, setError] = useState('');
  const configured = isSupabaseConfigured && Boolean(import.meta.env.VITE_ADMIN_EMAIL);
  useEffect(() => {
    isAdminSessionActive().then(setAllowed).finally(() => setLoading(false));
    return subscribeToAdminSession(setAllowed);
  }, []);
  if (loading) return <div className="page-shell py-12" />;
  if (allowed) return <><AdminNavigation onExit={async () => { await endAdminSession(); setAllowed(false); }} />{children}</>;
  return <div className="page-shell py-12"><div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm"><h1 className="text-2xl font-black">Вход владельца сайта</h1><p className="mt-2 text-sm text-muted-foreground">Локальный режим управления заказами и проектами.</p>{!configured ? <p className="mt-3 text-sm text-destructive">Административный доступ не настроен.</p> : <form onSubmit={async (event) => { event.preventDefault(); setError(''); const ok = await startAdminSession(pin); if (ok) setAllowed(true); else setError('Неверный PIN.'); }} className="mt-5 space-y-3"><input value={pin} onChange={(event) => setPin(event.target.value)} type="password" inputMode="text" autoCapitalize="none" autoCorrect="off" className="w-full rounded-xl border border-border bg-background px-3 py-2.5" placeholder="PIN"/><button className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white">Войти</button>{error && <p className="text-xs text-destructive">{error}</p>}</form>}</div></div>;
}
