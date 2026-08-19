import { Phone } from "lucide-react";
import { PHONE, WHATSAPP, TELEGRAM, VK_MSG, MAX_URL } from "../lib/calcData";

// SVG Icons
export function TelegramIcon({ size = 20, bare = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {!bare && <rect width="24" height="24" rx="6" fill="#229ED9"/>}
      <path d="M5.5 11.8L17.2 7.2C17.8 7 18.3 7.4 18.1 8.1L16.2 17C16.1 17.5 15.7 17.8 15.3 17.5L12.5 15.4L11.1 16.7C11 16.8 10.8 16.9 10.6 16.9L10.8 14L15.9 9.4C16.1 9.2 15.9 9.1 15.6 9.3L9.2 13.5L6.4 12.7C5.8 12.5 5.8 12.1 5.5 11.8Z" fill="white"/>
    </svg>
  );
}

export function WhatsAppIcon({ size = 20, bare = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {!bare && <rect width="24" height="24" rx="6" fill="#25D366"/>}
      <path d="M12 4.5C7.86 4.5 4.5 7.86 4.5 12C4.5 13.38 4.86 14.67 5.49 15.78L4.5 19.5L8.34 18.54C9.42 19.11 10.67 19.44 12 19.44C16.14 19.44 19.5 16.08 19.5 11.94C19.5 7.86 16.14 4.5 12 4.5ZM12 18C10.83 18 9.72 17.67 8.79 17.1L8.52 16.95L6.24 17.55L6.87 15.36L6.69 15.09C6.06 14.13 5.7 12.99 5.7 11.76C5.7 8.52 8.52 5.7 12 5.7C15.48 5.7 18.3 8.52 18.3 12C18.3 15.48 15.48 18 12 18Z" fill="white"/>
      <path d="M15.39 13.41C15.21 13.32 14.28 12.87 14.13 12.81C13.98 12.75 13.86 12.72 13.74 12.9C13.62 13.08 13.26 13.5 13.17 13.62C13.08 13.74 12.96 13.74 12.78 13.65C12.6 13.56 12 13.35 11.28 12.72C10.71 12.21 10.35 11.58 10.23 11.4C10.11 11.22 10.2 11.1 10.32 11.01C10.41 10.92 10.53 10.77 10.62 10.68C10.71 10.59 10.74 10.5 10.8 10.38C10.86 10.26 10.83 10.17 10.8 10.08C10.77 9.99 10.44 9.06 10.32 8.73C10.2 8.43 10.08 8.46 9.99 8.46H9.72C9.6 8.46 9.42 8.52 9.27 8.7C9.12 8.88 8.7 9.27 8.7 10.2C8.7 11.13 9.3 12.03 9.39 12.15C9.48 12.27 10.44 13.8 11.97 14.61C13.5 15.42 13.5 15.15 13.86 15.12C14.22 15.09 15.03 14.7 15.18 14.31C15.33 13.92 15.33 13.59 15.27 13.5C15.57 13.5 15.57 13.5 15.39 13.41Z" fill="white"/>
    </svg>
  );
}

export function MaxIcon({ size = 20, bare = false }) {
  if (bare) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.2 18.2c-2.8-2.8-2.8-7.4 0-10.2s7.4-2.8 10.2 0c2.8 2.8 2.8 7.4 0 10.2-2.2 2.2-5.5 2.7-8.2 1.4L4 20.7l1.1-4.1c-1.1-2.7-.6-5.9 1.1-8.6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.2 9.4c1.6-1.4 4.1-1.3 5.5.3 1.4 1.6 1.3 4.1-.3 5.5-1.6 1.4-4.1 1.3-5.5-.3-1.4-1.6-1.3-4.1.3-5.5Z" fill="white"/></svg>;
  }
  return (
    <img
      src="/assets/social-links.png"
      alt="MAX"
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: 8, objectFit: "contain", display: "block" }}
    />
  );
}

export function VKIcon({ size = 20, bare = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {!bare && <rect width="24" height="24" rx="6" fill="#0077FF"/>}
      <path fillRule="evenodd" clipRule="evenodd" d="M4.5 8h2c.3 0 .5.2.6.5.5 1.8 1.4 3.3 1.9 3.3.2 0 .3-.2.3-.8V9.2c0-.8-.3-.9-.3-.9s.2-.3.8-.3h2.9c.5 0 .6.2.6.7v3.2c0 .4.2.5.3.5.4 0 1.2-1.5 1.8-3.4.1-.3.3-.5.6-.5h2c.6 0 .7.3.6.7-.6 2.2-2.1 4-2.1 4s-.2.3 0 .6c.2.2 1.7 1.7 2.1 2.4.3.5.1.9-.4.9h-2c-.6 0-.9-.3-1.4-.9-.4-.5-1-1.3-1.2-1.4-.2-.1-.4 0-.4.4v1.4c0 .4-.1.6-.9.6H9.9c-1.5 0-3.1-.9-4.3-3.3C4.2 11.2 4 8.6 4 8.5 4 8.2 4.2 8 4.5 8Z" fill="white"/>
    </svg>
  );
}

// Compact row of social buttons for various sizes
export function SocialButtonRow({ size = "md", showLabels = false }) {
  const sz = size === "sm" ? 18 : size === "lg" ? 24 : 20;

  const links = [
    { href: `tel:${PHONE}`, icon: <Phone size={sz} />, label: "Звонок", bg: "bg-gradient-to-br from-orange-500 to-red-600", text: "text-white" },
    { href: WHATSAPP, icon: <WhatsAppIcon size={sz} />, label: "WhatsApp", bg: "bg-[#25D366]", text: "text-white", external: true },
    { href: TELEGRAM, icon: <TelegramIcon size={sz} />, label: "Telegram", bg: "bg-[#229ED9]", text: "text-white", external: true },
    { href: MAX_URL, icon: <MaxIcon size={sz} />, label: "MAX", bg: "bg-gradient-to-br from-[#5B9BF5] to-[#9B59F5]", text: "text-white", external: true },
    { href: VK_MSG, icon: <VKIcon size={sz} />, label: "ВКонтакте", bg: "bg-[#0077FF]", text: "text-white", external: true },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target={l.external ? "_blank" : undefined}
          rel={l.external ? "noopener noreferrer" : undefined}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl ${l.bg} ${l.text} font-bold text-sm active:scale-95 transition-all hover:brightness-110 shadow-sm`}
        >
          {l.icon}
          {showLabels && <span>{l.label}</span>}
        </a>
      ))}
    </div>
  );
}
