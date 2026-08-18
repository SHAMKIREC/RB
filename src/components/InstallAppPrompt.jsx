import { useEffect, useState } from 'react';
import { Download, Share2, X } from 'lucide-react';

const isRunningAsApp = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

export default function InstallAppPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(true);
  const [isIos, setIsIos] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const standalone = isRunningAsApp();
    setIsInstalled(standalone);
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Не удалось зарегистрировать service worker:', error);
      });
    }

    const handleInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstructions(false);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      setShowInstructions(true);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    }

    setInstallPrompt(null);
  };

  if (isInstalled || isDismissed) return null;

  return (
    <aside
      className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-md rounded-2xl border border-orange-200 bg-white/95 p-4 shadow-2xl backdrop-blur dark:border-orange-900 dark:bg-zinc-950/95"
      aria-label="Установка приложения"
    >
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="absolute right-3 top-3 rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-800 dark:hover:text-white"
        aria-label="Закрыть предложение установки"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="pr-8">
        <p className="text-base font-black text-slate-950 dark:text-white">
          Приложение «Решаем Быстро»
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Установите сайт на телефон или компьютер для быстрого доступа.
        </p>
      </div>

      {showInstructions && (
        <div className="mt-3 rounded-xl bg-orange-50 p-3 text-sm text-slate-700 dark:bg-orange-950/40 dark:text-slate-200">
          {isIos ? (
            <p className="flex items-start gap-2">
              <Share2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
              Нажмите «Поделиться» в Safari, затем выберите «На экран Домой».
            </p>
          ) : (
            <p>
              Откройте меню браузера и выберите «Установить приложение» или
              «Добавить на главный экран».
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleInstall}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff3300] px-4 py-3 font-bold text-white shadow-lg transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#ff4b19] focus:ring-offset-2"
      >
        <Download className="h-5 w-5" aria-hidden="true" />
        Скачать приложение
      </button>
    </aside>
  );
}
