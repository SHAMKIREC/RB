import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const rawMetrikaId = String(import.meta.env.VITE_YANDEX_METRIKA_ID || "").trim();
const metrikaId = /^\d+$/.test(rawMetrikaId) ? Number(rawMetrikaId) : null;
const trackerStateKey = "__rbYandexMetrika";

function ensureMetrikaApi() {
  window.ym = window.ym || function metrikaQueue() {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = window.ym.l || Date.now();

  if (!document.querySelector('script[data-yandex-metrika="true"]')) {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://mc.yandex.ru/metrika/tag.js";
    script.dataset.yandexMetrika = "true";
    document.head.appendChild(script);
  }
}

export default function YandexMetrika() {
  const location = useLocation();
  const pageUrl = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    if (!metrikaId) return;

    ensureMetrikaApi();

    let trackerState = window[trackerStateKey];

    if (!trackerState || trackerState.id !== metrikaId) {
      window.ym(metrikaId, "init", {
        accurateTrackBounce: true,
        clickmap: true,
        defer: true,
        trackLinks: true,
        webvisor: true,
      });

      trackerState = { id: metrikaId, lastUrl: null };
      window[trackerStateKey] = trackerState;
    }

    if (trackerState.lastUrl === pageUrl) return;

    const previousUrl = trackerState.lastUrl;
    trackerState.lastUrl = pageUrl;

    window.ym(metrikaId, "hit", pageUrl, {
      title: document.title,
      ...(previousUrl ? { referer: previousUrl } : {}),
    });
  }, [pageUrl]);

  return null;
}
