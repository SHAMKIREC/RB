import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, DatabaseBackup, FolderKanban, GripVertical, LogOut, MessageSquareText, Pencil, ReceiptText, ShieldCheck, X } from 'lucide-react';
import { useInlineEditMode } from '../hooks/usePricingState';
import { disableInlineEditMode, enableInlineEditMode } from '../lib/pricingStorage';

const links = [
  { to: '/admin/orders', label: 'Заказы', icon: ReceiptText },
  { to: '/admin/projects', label: 'Проекты', icon: FolderKanban },
  { to: '/admin/reviews', label: 'Отзывы', icon: MessageSquareText },
  { to: '/admin/service-photos', label: 'Фото услуг', icon: Camera },
  { to: '/admin/backup', label: 'Резерв', icon: DatabaseBackup },
];

const BUTTON_WIDTH = 154;
const BUTTON_HEIGHT = 48;
const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));
const defaultPosition = () => ({
  x: Math.max(10, window.innerWidth - BUTTON_WIDTH - 12),
  y: Math.max(76, window.innerHeight - BUTTON_HEIGHT - 112),
});

const savedPosition = () => {
  try {
    const value = JSON.parse(localStorage.getItem('rb-owner-panel-position') || 'null');
    if (Number.isFinite(value?.x) && Number.isFinite(value?.y)) return value;
  } catch { /* use default position */ }
  return defaultPosition();
};

export default function OwnerFloatingPanel({ onExit }) {
  const editMode = useInlineEditMode();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(savedPosition);
  const drag = useRef(null);

  const keepOnScreen = (next) => ({
    x: clamp(next.x, 8, window.innerWidth - BUTTON_WIDTH - 8),
    y: clamp(next.y, 72, window.innerHeight - BUTTON_HEIGHT - 96),
  });

  useEffect(() => {
    const onResize = () => setPosition((current) => keepOnScreen(current));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const pointerDown = (event) => {
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: position.x, y: position.y, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 7) current.moved = true;
    if (current.moved) setPosition(keepOnScreen({ x: current.x + dx, y: current.y + dy }));
  };
  const pointerUp = (event) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    drag.current = null;
    const next = keepOnScreen({ x: current.x + event.clientX - current.startX, y: current.y + event.clientY - current.startY });
    setPosition(next);
    try { localStorage.setItem('rb-owner-panel-position', JSON.stringify(next)); } catch { /* position persistence is optional */ }
  };

  const toggleEditing = () => editMode ? disableInlineEditMode() : enableInlineEditMode();

  return <>
    <div
      style={{ left: position.x, top: position.y, touchAction: 'none' }}
      className="group fixed z-[75] flex h-12 w-[154px] select-none items-stretch overflow-hidden rounded-2xl border border-orange-400/45 bg-[#252321]/95 text-left text-white shadow-[0_14px_34px_-12px_rgba(0,0,0,.75)] backdrop-blur-xl transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-10px_rgba(249,82,22,.55)]"
    >
      <button type="button" onClick={() => setOpen(true)} aria-label="Открыть панель владельца" className="flex min-w-0 flex-1 items-center px-2 text-left active:bg-white/[.06]">
        <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20"><ShieldCheck className="h-4 w-4"/><span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-[#252321] bg-green-400" /></span>
        <span className="ml-1.5 min-w-0 flex-1"><span className="block text-[8px] uppercase tracking-[.15em] text-white/45">Панель</span><span className="block truncate text-[11px] font-black">Владельца</span></span>
      </button>
      <button
        type="button"
        aria-label="Передвинуть кнопку панели владельца"
        title="Передвинуть"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={() => { drag.current = null; }}
        className="grid w-10 shrink-0 touch-none place-items-center border-l border-white/10 text-white/35 transition-colors hover:bg-white/[.06] hover:text-orange-300 active:bg-orange-500/15"
      ><GripVertical className="h-5 w-5" /></button>
    </div>

    {open && <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/55 p-3 backdrop-blur-sm sm:items-center" onClick={() => setOpen(false)}>
      <section role="dialog" aria-modal="true" aria-labelledby="owner-panel-title" className="w-full max-w-md origin-bottom animate-in overflow-hidden rounded-[28px] border border-white/10 bg-[#252321] text-white shadow-2xl duration-200 sm:origin-center" onClick={(event) => event.stopPropagation()}>
        <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-orange-500/25 via-[#2d2926] to-red-500/15 p-5">
          <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25"><ShieldCheck className="h-6 w-6" /></span>
            <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-orange-300">Управление сайтом</p><h2 id="owner-panel-title" className="text-xl font-black">Панель владельца</h2></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Закрыть" className="ml-auto grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[.06] text-white/70 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-2.5">
            {links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} onClick={() => setOpen(false)} className="group flex min-h-[72px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[.055] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-400/45 hover:bg-orange-500/10">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[.07] text-white/70 transition group-hover:bg-orange-500 group-hover:text-white"><Icon className="h-5 w-5" /></span><span className="text-sm font-black">{label}</span>
            </Link>)}
            <button type="button" onClick={toggleEditing} className={`group col-span-2 flex min-h-[72px] items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${editMode ? 'border-orange-400/60 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/15' : 'border-white/10 bg-white/[.055] hover:border-orange-400/45 hover:bg-orange-500/10'}`}>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${editMode ? 'bg-white/20' : 'bg-white/[.07] text-white/70 group-hover:bg-orange-500 group-hover:text-white'}`}><Pencil className="h-5 w-5" /></span>
              <span><span className="block text-sm font-black">{editMode ? 'Изменение цен включено' : 'Изменить цены на сайте'}</span><span className="mt-0.5 block text-[10px] text-white/55">{editMode ? 'Нажмите, чтобы закончить редактирование' : 'На ценниках появятся кнопки редактирования'}</span></span>
            </button>
          </div>

          <button type="button" onClick={onExit} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs font-black text-red-200 transition hover:border-red-400/45 hover:bg-red-500/20 hover:text-white"><LogOut className="h-4 w-4" />Выйти из панели владельца</button>
        </div>
      </section>
    </div>}
  </>;
}
