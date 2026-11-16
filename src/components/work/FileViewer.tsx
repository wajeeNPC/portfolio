import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useReducedMotion,
} from "motion/react";
import { ChevronLeft, ChevronRight, X } from "../../icons";
import type { DocBlock, DocPage } from "../../data/docs";

type Props = {
  /** Project name, shown in the page header */
  project: string;
  /** Pages in folder order, with their file names */
  pages: { name: string; page: DocPage }[];
  index: number;
  onIndexChange: (index: number) => void;
  /** The sheet in the folder this page is pulled out of (and goes back into) */
  sheet: HTMLElement;
  /** Called once the page is back in the folder */
  onClosed: () => void;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
const OPEN = 0.58;
const CLOSE = 0.46;

/** Page size: A4-ish, fitted to the screen */
function pageSize() {
  const w = Math.min(680, window.innerWidth * 0.92);
  const h = Math.min(window.innerHeight * 0.9, w * 1.414);
  return { w, h };
}

/** Transform that makes the centred page sit exactly over a sheet in the folder */
function overSheet(sheet: HTMLElement, w: number, h: number) {
  const r = sheet.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 - window.innerWidth / 2,
    y: r.top + r.height / 2 - window.innerHeight / 2,
    scaleX: r.width / w,
    scaleY: r.height / h,
  };
}

/**
 * A folder file pulled out into a full page. In one continuous motion the sheet arcs up out of the
 * folder while growing into a paper page in the middle of the screen. Closing tucks it back into its slot.
 * Only transform and opacity animate (no blur, no shadow repaint), so it stays on the compositor.
 */
function FileViewer({
  project,
  pages,
  index,
  onIndexChange,
  sheet,
  onClosed,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [size] = useState(pageSize);
  /** Content visible (fades in while the page is still settling) */
  // With reduced motion the content shows straight away (no arc to wait for).
  const [ready, setReady] = useState(() => !!reduceMotion);
  /** Fully open: shadow on, focus moved in */
  const [settled, setSettled] = useState(false);
  const [closing, setClosing] = useState(false);
  const sheetRef = useRef(sheet);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const { name, page } = pages[index];

  // Pull the page out of the folder
  useLayoutEffect(() => {
    restoreFocus.current = document.activeElement as HTMLElement | null;
    sheetRef.current.style.visibility = "hidden";
    const start = overSheet(sheetRef.current, size.w, size.h);

    if (reduceMotion) {
      animate(scope.current, { opacity: [0, 1] }, { duration: 0.2 }).then(() =>
        setSettled(true),
      );
      return;
    }
    const el = scope.current;
    animate(el, { opacity: 1 }, { duration: 0 });
    // Size and sideways travel run the whole time; only the height arcs (up out of the folder, then down
    // to centre), so there's no pause between "lift" and "open".
    animate(
      el,
      { x: [start.x, 0], scaleX: [start.scaleX, 1], scaleY: [start.scaleY, 1] },
      { duration: OPEN, ease: EASE_OUT },
    );
    animate(
      el,
      { y: [start.y, Math.min(start.y, 0) - 40, 0], rotate: [0, -2.5, 0] },
      { duration: OPEN, times: [0, 0.35, 1], ease: ["easeOut", EASE_IN_OUT] },
    ).then(() => setSettled(true));
    // Content starts fading in while the page is still settling
    const t = window.setTimeout(() => setReady(true), OPEN * 1000 * 0.55);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus the close button once the page is open; lock the page behind it
  useEffect(() => {
    if (settled) closeRef.current?.focus({ preventScroll: true });
  }, [settled]);
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  const close = async () => {
    if (closing) return;
    setClosing(true);
    setReady(false);
    setSettled(false);
    const sheetNow = sheetRef.current;
    if (reduceMotion) {
      await animate(scope.current, { opacity: 0 }, { duration: 0.15 });
    } else {
      const end = overSheet(sheetNow, size.w, size.h);
      const el = scope.current;
      // The reverse arc: shrink while rising a touch, then drop into the slot
      animate(
        el,
        { x: [0, end.x], scaleX: [1, end.scaleX], scaleY: [1, end.scaleY] },
        { duration: CLOSE, ease: EASE_IN_OUT },
      );
      await animate(
        el,
        { y: [0, Math.min(end.y, 0) - 40, end.y], rotate: [0, -2.5, 0] },
        { duration: CLOSE, times: [0, 0.6, 1], ease: [EASE_IN_OUT, "easeIn"] },
      );
    }
    sheetNow.style.visibility = "";
    restoreFocus.current?.focus({ preventScroll: true });
    onClosed();
  };

  // Flip to another file: swap which sheet is "out" so closing returns to the right slot
  const go = (next: number) => {
    if (next < 0 || next >= pages.length || closing) return;
    const sheets = sheetRef.current
      .closest(".gf-files")
      ?.querySelectorAll<HTMLElement>(".gf-sheet");
    const target = sheets?.[next];
    if (target) {
      sheetRef.current.style.visibility = "";
      target.style.visibility = "hidden";
      sheetRef.current = target;
    }
    onIndexChange(next);
  };

  // Keyboard: Escape closes (before the folder's own Escape handler), arrows flip pages
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      } else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  });

  return createPortal(
    <div
      data-gf-keep-open
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={`${project}: ${name}`}
      className="fixed inset-0 z-[95] grid place-items-center"
    >
      {/* Backdrop */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-coal/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: closing ? CLOSE : OPEN * 0.7 }}
        onClick={close}
      />

      {/* The page */}
      <div
        ref={scope}
        className="relative"
        // Hidden until the pull-out starts, so it never flashes at full size
        style={{
          width: size.w,
          height: size.h,
          transformOrigin: "center",
          opacity: 0,
          willChange: "transform",
        }}
      >
        {/* Shadow on its own layer: fades in once the page has landed instead of repainting while it moves */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 rounded-[6px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.55)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: settled ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
        <div className="relative flex size-full flex-col overflow-hidden rounded-[6px] bg-[#fffdf9] text-coal">
          {/* Page content fades in once the page has opened */}
          <motion.div
            className="flex min-h-0 flex-1 flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: ready ? 0.25 : 0.1 }}
          >
            {/* Header strip */}
            <header className="flex items-center justify-between gap-3 border-b border-coal/10 px-6 py-3 md:px-10">
              <p className="truncate font-montserrat text-[11px] font-semibold tracking-[0.14em] text-coal/55 uppercase">
                {project} <span className="text-accent">·</span> {name}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-coal/15 px-3 font-montserrat text-xs font-semibold transition-colors hover:bg-coal/5"
              >
                <X size={16} />
                Put back
              </button>
            </header>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={index}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-montserrat text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                    {page.kicker}
                  </p>
                  <h2 className="mt-2 text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                    {page.title}
                    <span className="text-accent">.</span>
                  </h2>
                  <div className="mt-6 space-y-5">
                    {page.blocks.map((block, i) => (
                      <Block key={i} block={block} />
                    ))}
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>

            {/* Footer: page numbers and flipping */}
            <footer className="flex items-center justify-between border-t border-coal/10 px-4 py-2.5 md:px-8">
              <button
                type="button"
                onClick={() => go(index - 1)}
                disabled={index === 0}
                aria-label="Previous page"
                className="grid size-10 place-items-center rounded-full transition-colors hover:bg-coal/5 disabled:opacity-25"
              >
                <ChevronLeft size={18} />
              </button>
              <p className="font-montserrat text-xs font-semibold tabular-nums text-coal/55">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(pages.length).padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={() => go(index + 1)}
                disabled={index === pages.length - 1}
                aria-label="Next page"
                className="grid size-10 place-items-center rounded-full transition-colors hover:bg-coal/5 disabled:opacity-25"
              >
                <ChevronRight size={18} />
              </button>
            </footer>
          </motion.div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="text-lg leading-relaxed font-medium md:text-xl">
          {block.text}
        </p>
      );
    case "heading":
      return (
        <h3 className="pt-2 text-lg font-semibold tracking-tight">
          {block.text}
        </h3>
      );
    case "text":
      return (
        <p className="font-montserrat text-sm leading-relaxed text-coal/75">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul className="space-y-2 font-montserrat text-sm leading-relaxed text-coal/75">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-accent"
              />
              {item}
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="space-y-3">
          {block.items.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-coal font-montserrat text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{step.title}</p>
                <p className="font-montserrat text-sm leading-relaxed text-coal/70">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "stats":
      return (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {block.items.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-coal/[0.04] p-4">
              <p className="text-2xl font-semibold tracking-tight md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 font-montserrat text-xs text-coal/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      );
    case "facts":
      return (
        <dl className="divide-y divide-coal/10 border-y border-coal/10 font-montserrat text-sm">
          {block.items.map((fact) => (
            <div key={fact.label} className="flex justify-between gap-4 py-2.5">
              <dt className="text-coal/60">{fact.label}</dt>
              <dd className="text-right font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      );
    case "image":
      return (
        <figure>
          <img
            src={block.src}
            alt={block.caption ?? ''}
            loading="lazy"
            className="w-full rounded-lg border border-coal/10 bg-white object-contain"
          />
          {block.caption && (
            <figcaption className="mt-2 font-montserrat text-xs text-coal/55">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "example":
      return (
        <div className="space-y-2 rounded-xl border border-coal/10 bg-white p-4">
          <p className="font-montserrat text-xs font-semibold text-coal/55">
            Question
          </p>
          <p className="text-sm font-medium">{block.question}</p>
          <p className="pt-2 font-montserrat text-xs font-semibold text-coal/55">
            Answer
          </p>
          <p className="font-montserrat text-sm leading-relaxed text-coal/75">
            {block.answer}
          </p>
          <p className="inline-flex rounded-full bg-accent/10 px-2.5 py-1 font-montserrat text-[11px] font-semibold text-accent">
            {block.source}
          </p>
        </div>
      );
    case "table":
      return (
        <figure>
          {/* Scrolls sideways inside the page on narrow screens instead of squashing columns */}
          <div className="overflow-x-auto rounded-xl border border-coal/10">
            <table className="w-full border-collapse font-montserrat text-xs md:text-[13px]">
              <thead>
                <tr className="bg-coal/[0.04] text-left">
                  {block.columns.map((col, c) => (
                    <th
                      key={col}
                      scope="col"
                      className={`px-3 py-2 font-semibold whitespace-nowrap text-coal/60 ${c > 0 && c === block.columns.length - 1 ? "text-right" : ""}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr
                    key={r}
                    className={`border-t border-coal/10 ${r === block.highlight ? "bg-accent/10 font-semibold" : ""}`}
                  >
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className={`px-3 py-2 align-top ${c === 0 ? "text-coal" : "tabular-nums text-coal/75"} ${c > 0 && c === row.length - 1 ? "text-right whitespace-nowrap" : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="mt-2 font-montserrat text-xs text-coal/55">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "bars": {
      const max = Math.max(...block.items.map((item) => item.value));
      return (
        <figure>
          <ul className="space-y-3">
            {block.items.map((item) => (
              <li key={item.label}>
                <div className="flex justify-between gap-3 font-montserrat text-xs">
                  <span className="text-coal/70">{item.label}</span>
                  <span className="font-semibold tabular-nums">
                    {item.display}
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 rounded-full bg-coal/[0.06]">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(item.value / max) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          {block.caption && (
            <figcaption className="mt-3 font-montserrat text-xs text-coal/55">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }
    case "shift":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {block.items.map((item) => (
            <div key={item.label} className="rounded-xl bg-coal/[0.04] p-4">
              <p className="font-montserrat text-xs text-coal/60">
                {item.label}
              </p>
              <p className="mt-1 flex items-baseline gap-2 tabular-nums">
                <span className="text-lg font-semibold text-coal/45">
                  {item.from}
                </span>
                <span aria-label="to" className="text-coal/40">
                  →
                </span>
                <span className="text-2xl font-semibold tracking-tight text-accent md:text-3xl">
                  {item.to}
                </span>
              </p>
            </div>
          ))}
        </div>
      );
    case "note":
      return (
        <p className="rounded-r-xl border-l-4 border-accent bg-accent/[0.07] px-4 py-3 text-sm leading-relaxed font-medium">
          {block.text}
        </p>
      );
    case "download":
      return (
        <a
          href={block.href}
          target="_blank"
          rel="noopener"
          className="flex items-center justify-between gap-4 rounded-xl border border-coal/15 bg-white p-4 transition-colors hover:border-accent hover:bg-accent/[0.04]"
        >
          <span>
            <span className="block font-semibold">{block.label}</span>
            {block.meta && (
              <span className="mt-0.5 block font-montserrat text-xs text-coal/55">
                {block.meta}
              </span>
            )}
          </span>
          <ChevronRight size={18} className="shrink-0 text-accent" />
        </a>
      );
  }
}

export default FileViewer;
