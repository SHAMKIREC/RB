import { useEffect, useState } from "react";
import { CheckCircle2, Download, Laptop, Monitor, Share2, Smartphone } from "lucide-react";

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

export default function AppInstallSection() {
  const [message, setMessage] = useState(null);
  const [canInstall, setCanInstall] = useState(Boolean(window.__rbInstallPrompt));

  useEffect(() => {
    const handleAvailable = () => setCanInstall(Boolean(window.__rbInstallPrompt));
    const handleInstalled = () => {
      setCanInstall(false);
      setMessage({
        type: "success",
        text: "Приложение установлено. Ищите «РБ Решаем Быстро» в списке приложений.",
      });
    };

    window.addEventListener("rb-install-available", handleAvailable);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("rb-install-available", handleAvailable);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installOnAndroid = async () => {
    if (isStandalone()) {
      setMessage({ type: "success", text: "Приложение уже установлено и сейчас открыто." });
      return;
    }

    const promptEvent = window.__rbInstallPrompt;

    if (promptEvent) {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      window.__rbInstallPrompt = null;
      setCanInstall(false);

      setMessage(
        choice.outcome === "accepted"
          ? {
              type: "success",
              text: "Установка началась. Значок появится в списке приложений телефона.",
            }
          : {
              type: "info",
              text: "Установка отменена. Нажмите Android ещё раз, когда захотите установить приложение.",
            },
      );
      return;
    }

    setMessage({
      type: "info",
      text: "В Chrome нажмите ⋮ и выберите «Установить приложение» или «Добавить на главный экран».",
    });
  };

  const showIphoneInstructions = () => {
    if (isStandalone()) {
      setMessage({ type: "success", text: "Приложение уже установлено и сейчас открыто." });
      return;
    }

    setMessage({
      type: "info",
      text: "На iPhone откройте сайт в Safari, нажмите «Поделиться» и выберите «На экран Домой».",
    });
  };

  const installOnComputer = async (platform) => {
    if (isStandalone()) {
      setMessage({ type: "success", text: "Приложение уже установлено и сейчас открыто." });
      return;
    }

    const promptEvent = window.__rbInstallPrompt;

    if (promptEvent) {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      window.__rbInstallPrompt = null;
      setCanInstall(false);

      setMessage(
        choice.outcome === "accepted"
          ? {
              type: "success",
              text: `Приложение установлено для ${platform}. Откройте его через меню приложений и разверните окно.`,
            }
          : {
              type: "info",
              text: "Установка отменена. Нажмите кнопку ещё раз, когда захотите установить приложение.",
            },
      );
      return;
    }

    setMessage({
      type: "info",
      text:
        platform === "macOS"
          ? "На Mac откройте сайт в Safari и выберите «Файл → Добавить в Dock». В Chrome используйте значок установки в адресной строке."
          : "На Windows откройте сайт в Chrome или Edge и нажмите значок установки справа в адресной строке.",
    });
  };

  return (
    <section
      className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-inner shadow-black/10 sm:p-5"
      aria-labelledby="install-app-title"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-orange-500/20">
          <Smartphone className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h2 id="install-app-title" className="text-base font-black text-white sm:text-lg">
            Установить приложение
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-white/60 sm:text-sm">
            Быстрый запуск «РБ Решаем Быстро» с телефона или компьютера.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <button
          type="button"
          onClick={installOnAndroid}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff3300] px-3 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/20 transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          <Download className="h-5 w-5 shrink-0" aria-hidden="true" />
          Android
        </button>
        <button
          type="button"
          onClick={showIphoneInstructions}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff3300] px-3 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/20 transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          <Share2 className="h-5 w-5 shrink-0" aria-hidden="true" />
          iPhone
        </button>
        <button
          type="button"
          onClick={() => installOnComputer("Windows")}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff3300] px-3 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/20 transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          <Monitor className="h-5 w-5 shrink-0" aria-hidden="true" />
          Windows
        </button>
        <button
          type="button"
          onClick={() => installOnComputer("macOS")}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff3300] px-3 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/20 transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          <Laptop className="h-5 w-5 shrink-0" aria-hidden="true" />
          macOS
        </button>
      </div>

      {message && (
        <div
          className={`mt-3 flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs leading-relaxed sm:text-sm ${
            message.type === "success"
              ? "bg-emerald-500/15 text-emerald-100"
              : "bg-orange-500/15 text-orange-100"
          }`}
          role="status"
          aria-live="polite"
        >
          {message.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <Smartphone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <p className="mt-2 text-center text-[11px] text-white/45">
        {canInstall ? "Готово к установке на этом устройстве" : "Бесплатно · Без магазина приложений"}
      </p>
    </section>
  );
}
