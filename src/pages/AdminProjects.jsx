import { useEffect, useMemo, useState } from "react";
import AdminGate from "../components/AdminGate";
import WorkPicker from "../components/admin/WorkPicker";
import PhotoUploader from "../components/PhotoUploader";
import {
  deleteProject,
  getProjects,
  PROJECTS_CHANGED_EVENT,
  PROJECTS_STORAGE_KEY,
  saveProject,
  setProjectPublished,
} from "../lib/projectsStorage";

const blank = () => ({
  clientName: "",
  location: "",
  title: "",
  description: "",
  deadline: "",
  materialsSubtotal: 0,
  extraCosts: 0,
  photos: [],
  photoGroups: { before: [], process: [], after: [] },
  coverPhoto: "",
  works: [],
  isPublished: false,
  isManualTotal: false,
  finalTotal: "",
});

const money = (value) => `${Math.round(value || 0).toLocaleString("ru-RU")} ₽`;
const photoSrc = (photo) =>
  typeof photo === "string" ? photo : photo?.src || "";
const asPhotos = (photos) =>
  Array.isArray(photos) ? photos.filter((photo) => photoSrc(photo)) : [];

const normalizePhotoGroups = (project) => {
  const groups = project?.photoGroups;
  if (groups && ["before", "process", "after"].some((key) => Array.isArray(groups[key]))) {
    return {
      before: asPhotos(groups.before),
      process: asPhotos(groups.process),
      after: asPhotos(groups.after),
    };
  }

  // Существующие проекты хранили только один массив photos.
  return { before: [], process: [], after: asPhotos(project?.photos) };
};

const flattenPhotoGroups = (groups) => [
  ...asPhotos(groups.after),
  ...asPhotos(groups.process),
  ...asPhotos(groups.before),
];

const normalizeDocuments = (project) => {
  const documents = project?.documents || {};
  const list = (type) => (Array.isArray(documents[type]) ? documents[type] : [])
    .map((document) => ({
      ...document,
      name: document?.name || "Документ",
      type: document?.type || "application/octet-stream",
      src: document?.src || document?.data || "",
      path: document?.path,
      file: document?.file,
      isPublic: document?.isPublic === true,
    }))
    .filter((document) => document.src);
  return {
    contract: list("contract"),
    act: list("act"),
    additional: list("additional"),
  };
};

const projectTotal = (project) =>
  Number(project.finalTotal ?? project.total ?? project.calculatedTotal ?? 0);
const requestError = (error, fallback) => error?.message || fallback;

const publicationError = (project, total) => {
  if (!String(project.title || "").trim()) return "Укажите название проекта.";
  if (!Array.isArray(project.works) || project.works.length === 0) {
    return "Добавьте хотя бы одну выполненную работу.";
  }
  if (!Number.isFinite(Number(total)) || Number(total) <= 0) {
    return "Укажите стоимость проекта.";
  }
  return "";
};

export default function AdminProjects() {
  return (
    <AdminGate>
      <Content />
    </AdminGate>
  );
}

function Content() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank());
  const [error, setError] = useState("");
  const [listError, setListError] = useState("");

  const refresh = async () => setItems(await getProjects());
  useEffect(() => {
    const onStorage = (event) => { if (event.key === PROJECTS_STORAGE_KEY) refresh(); };
    refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener(PROJECTS_CHANGED_EVENT, refresh);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(PROJECTS_CHANGED_EVENT, refresh); };
  }, []);

  const works = useMemo(
    () => form.works.reduce((sum, work) => sum + Number(work.totalPrice || 0), 0),
    [form.works],
  );
  const calculatedTotal =
    works + Number(form.materialsSubtotal || 0) + Number(form.extraCosts || 0);
  const finalTotal = form.isManualTotal
    ? Number(form.finalTotal || 0)
    : calculatedTotal;

  const save = async (published) => {
    const message = published ? publicationError(form, finalTotal) : "";
    if (message) {
      setError(message);
      return;
    }

    const photoGroups = normalizePhotoGroups(form);
    const photos = flattenPhotoGroups(photoGroups);
    setError("");
    try {
      await saveProject({
        ...form,
        photoGroups,
        photos,
        documents: normalizeDocuments(form),
        coverPhoto: photos[0] || "",
        workSubtotal: works,
        calculatedTotal,
        finalTotal,
        total: finalTotal,
        materialsSubtotal: Number(form.materialsSubtotal || 0),
        extraCosts: Number(form.extraCosts || 0),
        isPublished: published,
      });
      setForm(blank());
      await refresh();
    } catch (saveError) {
      setError(requestError(saveError, "Не удалось сохранить проект в Supabase."));
    }
  };

  const edit = (project) =>
    setForm({
      ...project,
      photos: asPhotos(project.photos),
      photoGroups: normalizePhotoGroups(project),
      works: Array.isArray(project.works) ? project.works : [],
      isManualTotal: Boolean(project.isManualTotal),
      finalTotal: project.finalTotal ?? project.total ?? "",
      materialsSubtotal: project.materialsSubtotal ?? 0,
      extraCosts: project.extraCosts ?? 0,
    });

  const updatePhotoGroup = (stage, photos) => {
    const photoGroups = {
      ...normalizePhotoGroups(form),
      [stage]: asPhotos(photos),
    };
    const allPhotos = flattenPhotoGroups(photoGroups);
    setForm({
      ...form,
      photoGroups,
      photos: allPhotos,
      coverPhoto: allPhotos[0] || "",
    });
  };

  const addDocuments = async (type, event) => {
    const files = Array.from(event.target.files || []);
    const added = files.map((file) => ({ name: file.name, type: file.type, file, src: URL.createObjectURL(file), isPublic: false }));
    const documents = normalizeDocuments(form);
    setForm({
      ...form,
      documents: { ...documents, [type]: [...documents[type], ...added] },
    });
    event.target.value = "";
  };

  const removeDocument = (type, index) => {
    const documents = normalizeDocuments(form);
    setForm({
      ...form,
      documents: {
        ...documents,
        [type]: documents[type].filter((_, itemIndex) => itemIndex !== index),
      },
    });
  };

  const publishFromList = async (project) => {
    const nextPublished = !project.isPublished;
    if (nextPublished) {
      const message = publicationError(project, projectTotal(project));
      if (message) {
        setListError(
          `Проект «${project.title || "без названия"}» не опубликован: ${message}`,
        );
        return;
      }
    }

    try {
      setListError("");
      await setProjectPublished(project.id, nextPublished);
      await refresh();
    } catch (publishError) {
      setListError(requestError(publishError, "Не удалось обновить публикацию проекта в Supabase."));
    }
  };

  const field = (key, label) => (
    <label className="text-sm font-bold">
      {label}
      <input
        required={key === "title"}
        value={form[key] ?? ""}
        onChange={(event) => setForm({ ...form, [key]: event.target.value })}
        className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
      />
    </label>
  );

  return (
    <div className="page-shell py-6 sm:py-10">
      <div className="flex flex-col items-stretch gap-4 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
        <h1 className="text-3xl font-black">Управление проектами</h1>
        <button
          type="button"
          onClick={() => setForm(blank())}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white min-[420px]:w-auto min-[420px]:py-2"
        >
          Добавить проект
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save(false);
          }}
          className="w-full min-w-0 space-y-4 rounded-2xl border border-border bg-card p-4 sm:space-y-5 sm:p-5"
        >
          <section>
            <h2 className="font-black">Основная информация</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {field("title", "Название проекта")}
              {field("clientName", "Имя клиента")}
              {field("location", "Город, район или улица")}
              {field("deadline", "Срок выполнения")}
            </div>
            <label className="mt-3 block text-sm font-bold">
              Описание проекта
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                className="mt-1 min-h-24 w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
              />
            </label>
          </section>

          <section>
            <h2 className="font-black">Фотографии проекта</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Старые фотографии без этапа сохраняются и отображаются в разделе «После ремонта».
            </p>
            <div className="mt-3 grid gap-4">
              <PhotoUploader
                value={normalizePhotoGroups(form).before}
                onChange={(photos) => updatePhotoGroup("before", photos)}
                label="До ремонта"
              />
              <PhotoUploader
                value={normalizePhotoGroups(form).process}
                onChange={(photos) => updatePhotoGroup("process", photos)}
                label="В процессе"
              />
              <PhotoUploader
                value={normalizePhotoGroups(form).after}
                onChange={(photos) => updatePhotoGroup("after", photos)}
                label="После ремонта"
              />
            </div>
          </section>

          <section>
            <h2 className="font-black">Выполненные работы</h2>
            <div className="mt-3">
              <WorkPicker
                value={form.works}
                onChange={(nextWorks) => setForm({ ...form, works: nextWorks })}
              />
            </div>
          </section>

          <section>
            <h2 className="font-black">Документы проекта</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                ["contract", "Договор"],
                ["act", "Акт"],
                ["additional", "Дополнительные документы"],
              ].map(([type, label]) => {
                const documents = normalizeDocuments(form)[type];
                return (
                  <div key={type} className="rounded-xl border border-border bg-background p-3">
                    <p className="text-sm font-bold">{label}</p>
                    <label className="mt-2 block cursor-pointer text-xs font-bold text-primary">
                      Добавить файл
                      <input
                        type="file"
                        className="sr-only"
                        onChange={(event) => addDocuments(type, event)}
                      />
                    </label>
                    {documents.length > 0 && (
                      <ul className="mt-2 space-y-1 text-xs">
                        {documents.map((document, index) => (
                          <li key={`${document.name}-${index}`} className="flex items-center justify-between gap-2">
                            <a
                              href={document.src}
                              download={document.name}
                              className="min-w-0 truncate text-primary underline"
                            >
                              {document.name}
                            </a>
                            <button
                              type="button"
                              onClick={() => removeDocument(type, index)}
                              className="shrink-0 text-destructive"
                            >
                              Удалить
                            </button>
                            <label className="flex items-center gap-1 whitespace-nowrap text-[11px] text-muted-foreground">
                              <input
                                type="checkbox"
                                checked={document.isPublic === true}
                                onChange={(event) => {
                                  const nextDocuments = normalizeDocuments(form);
                                  nextDocuments[type] = nextDocuments[type].map((item, itemIndex) => itemIndex === index ? { ...item, isPublic: event.target.checked } : item);
                                  setForm({ ...form, documents: nextDocuments });
                                }}
                              />
                              Показывать на странице проекта
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-black">Стоимость</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-bold">
                Стоимость работ
                <output className="mt-1 block rounded-xl bg-secondary px-3 py-2 font-normal">
                  {money(works)}
                </output>
              </label>
              <label className="text-sm font-bold">
                Стоимость материалов
                <input
                  type="number"
                  min="0"
                  value={form.materialsSubtotal}
                  onChange={(event) =>
                    setForm({ ...form, materialsSubtotal: event.target.value })
                  }
                  className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
                />
              </label>
              <label className="text-sm font-bold">
                Дополнительные расходы
                <input
                  type="number"
                  min="0"
                  value={form.extraCosts}
                  onChange={(event) =>
                    setForm({ ...form, extraCosts: event.target.value })
                  }
                  className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
                />
              </label>
              <label className="flex items-end gap-2 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={Boolean(form.isManualTotal)}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      isManualTotal: event.target.checked,
                      finalTotal: event.target.checked ? form.finalTotal : calculatedTotal,
                    })
                  }
                />
                Указать итоговую сумму вручную
              </label>
            </div>
            {form.isManualTotal && (
              <div className="mt-3">
                <label className="text-sm font-bold">
                  Итоговая стоимость проекта
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.finalTotal}
                    onChange={(event) =>
                      setForm({ ...form, finalTotal: event.target.value })
                    }
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
                  />
                </label>
                <p className="mt-2 text-xs text-muted-foreground">
                  Расчётная сумма: {money(calculatedTotal)}
                </p>
              </div>
            )}
            <p className="mt-3 rounded-xl bg-primary/10 px-3 py-2 font-black text-primary">
              Итоговая стоимость: {money(finalTotal)}
            </p>
            {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
          </section>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button className="w-full rounded-xl border border-border px-4 py-2 text-sm font-bold sm:w-auto">
              Сохранить черновик
            </button>
            <button
              type="button"
              onClick={() => save(true)}
              className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white sm:w-auto"
            >
              Опубликовать проект
            </button>
          </div>
        </form>

        <aside className="min-w-0 space-y-3">
          {listError && (
            <p
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {listError}
            </p>
          )}

          {items.map((project) => {
            const groups = normalizePhotoGroups(project);
            const previewGroups = [
              ["До", groups.before],
              ["Процесс", groups.process],
              ["После", groups.after],
            ].filter(([, photos]) => photos.length);
            const preview = photoSrc(project.coverPhoto) || asPhotos(project.photos)[0];

            return (
              <article
                key={project.id}
                className="overflow-hidden rounded-2xl border border-primary/50 bg-card text-sm shadow-sm"
              >
                <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 p-3">
                  {preview ? (
                    <img
                      src={preview}
                      alt=""
                      className="h-24 w-[5.5rem] rounded-xl border border-primary/30 bg-secondary object-contain"
                    />
                  ) : (
                    <div className="flex h-24 w-[5.5rem] items-center justify-center rounded-xl border border-dashed border-primary/40 bg-secondary px-2 text-center text-xs text-muted-foreground">
                      Нет фото
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <b className="break-words">{project.title || "Без названия"}</b>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          project.isPublished
                            ? "bg-primary/15 text-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {project.isPublished ? "Опубликован" : "Черновик"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[project.clientName, project.location].filter(Boolean).join(" · ") ||
                        "Клиент и адрес не указаны"}
                    </p>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {project.description || "Описание не добавлено"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="font-black text-primary">{money(projectTotal(project))}</span>
                      <span className="text-muted-foreground">
                        {project.deadline || "Срок не указан"}
                      </span>
                    </div>
                  </div>
                </div>

                {previewGroups.length > 0 && (
                  <div className="border-t border-primary/20 px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      {previewGroups.map(([label, photos]) => (
                        <div key={label} className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <span>{label}:</span>
                          {photos.slice(0, 3).map((photo, index) => (
                            <img
                              key={`${label}-${index}`}
                              src={photo}
                              alt=""
                              className="h-7 w-7 rounded-md border border-primary/30 bg-secondary object-contain"
                            />
                          ))}
                          {photos.length > 3 && <span>+{photos.length - 3}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-x-3 gap-y-2 border-t border-primary/20 px-3 py-2 text-xs font-bold">
                  <button type="button" onClick={() => edit(project)} className="text-primary">
                    Редактировать
                  </button>
                  <button type="button" onClick={() => publishFromList(project)}>
                    {project.isPublished ? "Снять с публикации" : "Опубликовать"}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteProject(project.id);
                      await refresh();
                    }}
                    className="text-destructive"
                  >
                    Удалить
                  </button>
                </div>
              </article>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
