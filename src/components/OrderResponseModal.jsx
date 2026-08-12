import { useState } from 'react';
import { X } from 'lucide-react';
import { MaxIcon, TelegramIcon, VKIcon, WhatsAppIcon } from './SocialLinks';
import { MAX_URL, TELEGRAM, VK_MSG, WHATSAPP } from '../lib/calcData';

const contacts = {
  whatsapp: import.meta.env.VITE_OWNER_WHATSAPP || WHATSAPP,
  telegram: import.meta.env.VITE_OWNER_TELEGRAM || TELEGRAM,
  max: import.meta.env.VITE_OWNER_MAX_URL || (MAX_URL?.startsWith('tel:') ? null : MAX_URL),
  vk: import.meta.env.VITE_OWNER_VK_URL || VK_MSG,
};

export default function OrderResponseModal({ number, onClose }) {
  const [notice, setNotice] = useState('');
  const text = `Здравствуйте! Готов выполнить заказ №${number}.`;
  const encoded = encodeURIComponent(text);
  const copyAndOpen = async (url) => { try { await navigator.clipboard.writeText(text); } catch {} window.open(url, '_blank', 'noopener,noreferrer'); setNotice('Сообщение скопировано. Вставьте его в чат.'); };
  const buttons = [
    contacts.whatsapp && <a key="whatsapp" href={`${contacts.whatsapp}${contacts.whatsapp.includes('?') ? '&' : '?'}text=${encoded}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-xs font-bold text-white"><WhatsAppIcon size={18} />WhatsApp</a>,
    contacts.telegram && <a key="telegram" href={`${contacts.telegram}${contacts.telegram.includes('?') ? '&' : '?'}text=${encoded}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] py-3 text-xs font-bold text-white"><TelegramIcon size={18} />Telegram</a>,
    contacts.max && <button key="max" onClick={() => copyAndOpen(contacts.max)} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#5B9BF5] to-[#9B59F5] py-3 text-xs font-bold text-white"><MaxIcon size={18} />MAX</button>,
    contacts.vk && <button key="vk" onClick={() => copyAndOpen(contacts.vk)} className="flex items-center justify-center gap-2 rounded-xl bg-[#0077FF] py-3 text-xs font-bold text-white"><VKIcon size={18} />ВКонтакте</button>,
  ].filter(Boolean);
  return <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-3 sm:items-center" role="dialog" aria-modal="true"><div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl"><div className="mb-4 flex items-start justify-between"><div><h2 className="font-black">Откликнуться на заказ №{number}</h2><p className="mt-1 text-xs text-muted-foreground">Выберите удобный способ связи. Номер заказа будет добавлен в сообщение автоматически.</p></div><button onClick={onClose} aria-label="Закрыть" className="rounded-lg p-1 hover:bg-secondary"><X className="h-4 w-4" /></button></div>{buttons.length ? <div className="grid grid-cols-2 gap-2">{buttons}</div> : <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">Контакты владельца для откликов пока не настроены.</p>}{notice && <p className="mt-3 text-center text-xs text-muted-foreground">{notice}</p>}</div></div>;
}
