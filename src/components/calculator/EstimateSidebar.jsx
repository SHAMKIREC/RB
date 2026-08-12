import { useState } from 'react';
import { CheckCircle2, ClipboardList, Phone, Send, Trash2, X } from 'lucide-react';
import { PHONE, PHONE_DISPLAY, WHATSAPP, TELEGRAM, MAX_URL } from '../../lib/calcData';
import { MaxIcon, TelegramIcon, VKIcon, WhatsAppIcon } from '../SocialLinks';

const money = (value) => Math.round(value || 0).toLocaleString('ru-RU');
const VK_COMMUNITY_URL = 'https://vk.ru/club237262784';

export default function EstimateSidebar({ works, materials, worksSubtotal, materialsSubtotal, estimateText, onRemoveWork, onRemoveMaterial }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const grandTotal = worksSubtotal + materialsSubtotal;
  const hasEstimate = works.length > 0;
  const message = estimateText || 'Решаем Быстро — предварительная смета';
  const shareText = encodeURIComponent(message);
  const copiedNotice = 'copied';

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setNotice(copiedNotice);
      return true;
    } catch {
      setNotice('copy-error');
      return false;
    }
  };

  const openShareDialog = async () => {
    setNotice('');
    await copyMessage();
    setIsShareOpen(true);
  };

  const copyForFallback = (href) => {
    setIsShareOpen(false);
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const openTelegram = () => {
    copyForFallback(TELEGRAM);
  };

  const openVk = () => {
    copyForFallback(VK_COMMUNITY_URL);
  };

  return <aside className="rb-card calc-base-surface flex h-auto max-h-none flex-col overflow-hidden rounded-2xl bg-white dark:bg-card lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:max-h-[calc(100vh-6rem)]">
    <div className="flex-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-3.5 py-3 text-white">
      {hasEstimate ? <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/55">Смета составлена</p><p className="mt-1 text-[11px] text-white/65">{works.length} раб. · {materials.length} мат.</p></div><p className="font-mono text-2xl font-black leading-none">{money(grandTotal)} <span className="text-orange-400">₽</span></p></div> : <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"><ClipboardList className="h-4 w-4 text-orange-300" /></span><div><p className="text-sm font-black">Выберите работы</p><p className="text-[11px] text-white/60">Добавьте позиции для расчёта.</p></div></div>}
    </div>

    {hasEstimate && <div className="calc-base-surface min-h-0 flex-1 overflow-y-auto bg-[#fffdfa] px-3.5 py-3 dark:bg-card">
      <section><h2 className="mb-1.5 text-xs font-black">Работы</h2><div className="space-y-1.5">{works.map((work) => <div key={work.id} className="flex gap-1.5 text-[11px]"><div className="min-w-0 flex-1"><p className="truncate font-medium">{work.name}</p><p className="text-muted-foreground">{work.quantity} {work.unit} · {money(work.price)} ₽</p></div><span className="whitespace-nowrap font-mono font-bold">{money(work.total)} ₽</span><button onClick={() => onRemoveWork(work.id)} aria-label={`Удалить ${work.name}`} className="text-muted-foreground hover:text-primary"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div></section>
      {materials.length > 0 && <section className="mt-3 border-t border-border pt-3"><h2 className="mb-1.5 text-xs font-black">Материалы</h2><div className="space-y-1.5">{materials.map((item) => <div key={item.workId} className="flex gap-1.5 text-[11px]"><img src={item.image} alt={item.name} className="h-7 w-7 rounded-md object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-medium">{item.name}</p><p className="text-muted-foreground">{item.packageAmount} {item.packageUnit}</p><p className="text-muted-foreground">{item.quantity} шт. × {money(item.pricePerPackage)} ₽</p></div><span className="whitespace-nowrap font-mono font-bold">{money(item.total)} ₽</span><button onClick={() => onRemoveMaterial(item.workId)} aria-label={`Удалить ${item.name}`} className="text-muted-foreground hover:text-primary"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div></section>}
    </div>}

    <div className="calc-base-surface flex-none border-t border-slate-200 bg-white px-3.5 py-3 dark:border-border dark:bg-card">
      {hasEstimate && <><section className="calc-base-surface space-y-1 rounded-xl border border-primary/15 bg-primary/5 p-2.5 text-xs"><div className="flex justify-between"><span>Работы</span><b>{money(worksSubtotal)} ₽</b></div><div className="flex justify-between"><span>Материалы</span><b>{money(materialsSubtotal)} ₽</b></div><div className="flex justify-between border-t border-primary/20 pt-2 text-sm"><b>Итого</b><b className="text-primary">{money(grandTotal)} ₽</b></div></section><button onClick={openShareDialog} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-[0_8px_16px_-10px_hsl(var(--primary))] hover:brightness-105"><Send className="h-4 w-4" />Отправить смету</button></>}
      <a href={`tel:${PHONE}`} className={`flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-bold hover:bg-secondary ${hasEstimate ? 'mt-2' : ''}`}><Phone className="h-4 w-4 text-primary" />Позвонить {PHONE_DISPLAY}</a>
      {hasEstimate && <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">Предварительный расчёт. Стоимость уточняется после осмотра объекта.</p>}
    </div>

    {isShareOpen && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:z-50 sm:items-center sm:p-3" role="dialog" aria-modal="true" aria-label="Отправить смету"><div className="max-h-[calc(100dvh-1.5rem-env(safe-area-inset-bottom))] w-full max-w-sm overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-2xl sm:max-h-none sm:overflow-visible"><div className="mb-3 flex items-center justify-between"><div><h2 className="text-sm font-black">Отправить смету</h2><p className="text-[11px] text-muted-foreground">Выберите удобный мессенджер</p></div><button onClick={() => setIsShareOpen(false)} aria-label="Закрыть" className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"><X className="h-4 w-4" /></button></div>{notice && <div role="status" className={`mb-3 flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left ${notice === copiedNotice ? 'border-primary/30 bg-primary/10' : 'border-destructive/30 bg-destructive/10'}`}>{notice === copiedNotice ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />}<div className="min-w-0">{notice === copiedNotice ? <><p className="text-xs font-bold text-foreground">✓ Смета скопирована</p><p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">Сообщение готово.<br />Откройте выбранный мессенджер и нажмите «Вставить».</p></> : <><p className="text-xs font-bold text-foreground">Не удалось скопировать смету</p><p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">Разрешите доступ к буферу обмена и повторите попытку.</p></>}</div></div>}<div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => copyForFallback(`${WHATSAPP}?text=${shareText}`)} className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-xs font-bold text-white"><WhatsAppIcon size={18} />WhatsApp</button><button type="button" onClick={openTelegram} className="flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] py-3 text-xs font-bold text-white"><TelegramIcon size={18} />Telegram</button><button onClick={() => copyForFallback(MAX_URL)} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#5B9BF5] to-[#9B59F5] py-3 text-xs font-bold text-white"><MaxIcon size={18} />MAX</button><button type="button" onClick={openVk} className="flex items-center justify-center gap-2 rounded-xl bg-[#0077FF] py-3 text-xs font-bold text-white"><VKIcon size={18} />ВКонтакте</button></div></div></div>}
  </aside>;
}
