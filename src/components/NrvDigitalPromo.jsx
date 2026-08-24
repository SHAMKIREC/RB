import nrvDigitalBackground from "../assets/images/services/nrv-digital-background.webp";
import { Link } from "react-router-dom";

export const NRV_DIGITAL_URL = "/nrv-digital";

const DIRECTIONS = [
  "Проектирование",
  "Разработка",
  "Автоматизация",
  "Поддержка",
];

export default function NrvDigitalPromo() {
  return (
    <section className="page-shell pb-8 sm:pb-10">
      <div className="nrv-promo-enter nrv-promo-light group relative overflow-hidden rounded-2xl border border-orange-200/80 bg-gradient-to-br from-white/90 via-orange-50/65 to-stone-100/85 px-6 py-6 text-slate-900 shadow-[0_20px_56px_rgba(15,23,42,0.12),0_7px_20px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-[250ms] ease-out hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_24px_64px_rgba(15,23,42,0.15),0_9px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] sm:px-10 sm:py-7">
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-orange-400/15 blur-3xl" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] overflow-hidden sm:block sm:right-[8%] lg:right-[12%]"
        >
          <img
            src={nrvDigitalBackground}
            alt=""
            className="nrv-background-drift h-full w-full object-cover object-right opacity-40 saturate-110 contrast-105"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.72) 12%, black 26%, black 76%, rgba(0, 0, 0, 0.7) 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.72) 12%, black 26%, black 76%, rgba(0, 0, 0, 0.7) 90%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 grid gap-7 lg:grid-cols-[minmax(0,7fr)_minmax(220px,3fr)] lg:items-center lg:gap-10">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-600 sm:text-base">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Наш цифровой партнёр
            </p>

            <Link
              to={NRV_DIGITAL_URL}
              className="mt-2 inline-flex whitespace-nowrap text-[30px] font-black leading-none tracking-[0.02em] text-slate-900 transition-colors duration-200 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:text-[36px]"
            >
              <span className="text-orange-500 transition-colors duration-200 group-hover:text-orange-600">
                NRV
              </span>
              <span className="transition-colors duration-200 group-hover:text-slate-700">
                &nbsp;DIGITAL
              </span>
            </Link>

            <h2 className="mt-3 text-lg font-bold leading-tight sm:text-xl">
              Цифровые решения для бизнеса
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
              NRV DIGITAL — партнёр «РБ Решаем Быстро» по разработке сайтов, веб-приложений, калькуляторов, автоматизации и технической поддержке цифровых сервисов.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {DIRECTIONS.map((direction) => (
                <span
                  key={direction}
                  className="rounded-full border border-orange-300/70 bg-orange-50/75 px-3 py-1 text-[13px] font-semibold text-orange-700 shadow-[0_2px_8px_rgba(234,88,12,0.08)] backdrop-blur-sm transition-colors duration-200 hover:border-orange-400 hover:bg-orange-100/85 hover:text-orange-800"
                >
                  {direction}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-stretch justify-center lg:items-center lg:border-l lg:border-orange-200/60 lg:pl-8">
            <p className="mb-3 hidden text-center text-sm font-semibold text-slate-700 lg:block">
              Нужен сайт или цифровой сервис?
            </p>
            <Link
              to={`${NRV_DIGITAL_URL}#contacts`}
              className="group/button inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-[0_6px_16px_rgba(234,88,12,0.20)] transition duration-200 hover:-translate-y-px hover:bg-orange-600 hover:shadow-[0_10px_20px_rgba(234,88,12,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Перейти к партнёру
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover/button:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes nrv-promo-enter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nrv-promo-enter {
          animation: nrv-promo-enter 520ms ease-out both;
        }

        .nrv-promo-light {
          color-scheme: light;
        }

        .nrv-background-drift {
          animation: nrv-background-drift 14s ease-in-out infinite alternate;
        }

        @keyframes nrv-background-drift {
          from { transform: translate3d(0, -3px, 0); }
          to { transform: translate3d(-5px, 3px, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .nrv-promo-enter,
          .nrv-background-drift {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
