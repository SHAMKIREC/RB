import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { endAdminSession, isAdminSessionActive, startAdminSession } from '../lib/adminSession';
import { enableInlineEditMode } from '../lib/pricingStorage';

export function AdminNavigation({ onExit }) {
  return <div className="border-b border-border bg-card/95"><div className="page-shell flex flex-wrap items-center gap-x-3 gap-y-2 py-2 text-xs font-bold sm:gap-3"><span className="text-muted-foreground">Администрирование:</span><Link to="/admin/orders" className="hover:text-primary">Заказы</Link><Link to="/admin/projects" className="hover:text-primary">Проекты</Link><Link to="/admin/reviews" className="hover:text-primary">Отзывы</Link><Link to="/" onClick={enableInlineEditMode} className="basis-full hover:text-primary sm:basis-auto">Открыть сайт</Link><button onClick={onExit} className="ml-auto inline-flex items-center gap-1 text-destructive"><LogOut className="h-3.5 w-3.5"/>Выйти</button></div></div>;
}

export default function AdminGate({ children }) {
  const [allowed, setAllowed] = useState(isAdminSessionActive); const [pin, setPin] = useState(''); const [error, setError] = useState('');
  const configured = Boolean(import.meta.env.VITE_ADMIN_PIN);
  if (allowed) return <><AdminNavigation onExit={() => { endAdminSession(); setAllowed(false); }} />{children}</>;
  return <div className="page-shell py-12"><div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm"><h1 className="text-2xl font-black">Вход владельца сайта</h1><p className="mt-2 text-sm text-muted-foreground">Локальный режим управления заказами и проектами.</p>{!configured ? <p className="mt-3 text-sm text-destructive">Административный PIN не настроен. Добавьте VITE_ADMIN_PIN в .env.local и перезапустите приложение.</p> : <form onSubmit={(event) => { event.preventDefault(); if (startAdminSession(pin)) setAllowed(true); else setError('Неверный PIN.'); }} className="mt-5 space-y-3"><input value={pin} onChange={(event) => setPin(event.target.value)} type="password" inputMode="numeric" className="w-full rounded-xl border border-border bg-background px-3 py-2.5" placeholder="PIN"/><button className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white">Войти</button>{error && <p className="text-xs text-destructive">{error}</p>}</form>}<p className="mt-4 text-xs text-muted-foreground">Это временная клиентская защита MVP, не серверная авторизация.</p></div></div>;
}
