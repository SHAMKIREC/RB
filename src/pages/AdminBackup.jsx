import { useState } from 'react';
import { DatabaseBackup, Download, ShieldCheck } from 'lucide-react';
import AdminGate from '../components/AdminGate';
import { createFullBackup } from '../lib/backupStorage';

const sizeText = (bytes) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
};

export default function AdminBackup() {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const download = async () => {
    setBusy(true);
    setError('');
    setResult(null);
    try {
      setResult(await createFullBackup(setProgress));
      setProgress('Резервная копия скачана.');
    } catch (backupError) {
      setError(backupError?.message || 'Не удалось создать резервную копию.');
      setProgress('');
    } finally {
      setBusy(false);
    }
  };

  return <AdminGate><main className="page-shell py-8 sm:py-12">
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-primary p-3 text-white"><DatabaseBackup className="h-6 w-6" /></div>
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Администрирование</p><h1 className="text-2xl font-black sm:text-3xl">Резервная копия</h1></div>
      </div>

      <section className="mt-7 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /><p className="text-sm text-muted-foreground">В один файл попадут заказы, проекты, отзывы, цены, фотографии услуг и оригиналы всех загруженных файлов. Ключи и пароль владельца в копию не входят.</p></div>
        <button type="button" disabled={busy} onClick={download} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-black text-white shadow-lg shadow-orange-500/20 disabled:cursor-wait disabled:opacity-60">
          <Download className="h-5 w-5" />{busy ? 'Создаю резерв…' : 'Скачать полный резерв'}
        </button>
        {progress && <p className="mt-4 text-center text-sm font-semibold text-muted-foreground" aria-live="polite">{progress}</p>}
        {error && <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p>}
        {result && <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
          <p className="font-black">Готово: {result.filename}</p>
          <p className="mt-1">Записей: {result.tableRows} · файлов: {result.files} · размер: {sizeText(result.bytes)}</p>
          <p className="mt-2 text-xs">Сохраните файл на компьютере или в облачном диске. Не отправляйте его посторонним.</p>
        </div>}
      </section>

      <section className="mt-5 rounded-3xl border border-border bg-card p-5 sm:p-7">
        <h2 className="font-black">Как пользоваться</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Скачивайте новый резерв после важных изменений и не реже одного раза в неделю.</li>
          <li>Храните две последние копии: на компьютере и в надёжном облачном диске.</li>
          <li>Не переименовывайте содержимое файла и не публикуйте его.</li>
        </ol>
      </section>
    </div>
  </main></AdminGate>;
}
