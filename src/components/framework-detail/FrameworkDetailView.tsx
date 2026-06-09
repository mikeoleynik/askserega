"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { FrameworkMeta } from "@/lib/frameworks-index"
import type { AlgorithmStep, AntiPattern } from "@/lib/parse-framework-sections"
import { getDifficultyLabel, getEstimatedTime } from "@/lib/taxonomy"
import {
  getChainNeighbors,
  getFrameworkStepInSymptom,
  getSymptomsForFramework,
  resolveActiveSymptom,
} from "@/lib/symptoms"
import ChainMap from "./ChainMap"
import CopyButton from "./CopyButton"

interface FrameworkDetailViewProps {
  framework: FrameworkMeta
  allFrameworks: FrameworkMeta[]
  algorithm: AlgorithmStep[]
  antiPatterns: AntiPattern[]
  artifactGallery?: ReactNode
}

const TOC_ITEMS = [
  { id: "pain", label: "Боль и интент" },
  { id: "llm", label: "LLM-промт" },
  { id: "algorithm", label: "Алгоритм" },
  { id: "anchor", label: "Что вы получите" },
  { id: "artifact", label: "Артефакт" },
  { id: "antipattern", label: "Антипаттерны" },
  { id: "map", label: "Карта связей" },
]

function difficultyHeroClass(difficulty: FrameworkMeta["difficulty"]): string {
  switch (difficulty) {
    case "low":
      return "bg-[#f0fdf4] text-[#16a34a]"
    case "medium":
      return "bg-[#fffbeb] text-[#b45309]"
    case "high":
      return "bg-[#fef2f2] text-[#dc2626]"
  }
}

function difficultyDotClass(difficulty: FrameworkMeta["difficulty"]): string {
  switch (difficulty) {
    case "low":
      return "bg-[#16a34a]"
    case "medium":
      return "bg-[#b45309]"
    case "high":
      return "bg-[#dc2626]"
  }
}

function BlockLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mono text-[10px] text-subtle uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
      <span className="text-blueprint/60">▸</span>
      {children}
    </div>
  )
}

export default function FrameworkDetailView({
  framework: fw,
  allFrameworks,
  algorithm,
  antiPatterns,
  artifactGallery,
}: FrameworkDetailViewProps) {
  const [activeSection, setActiveSection] = useState("pain")
  const [applied, setApplied] = useState(false)

  const searchParams = useSearchParams()
  const symptomFromUrl = searchParams.get("symptom")

  const frameworkMap = new Map(allFrameworks.map((f) => [f.slug, f]))
  const frameworkSymptoms = getSymptomsForFramework(fw.slug)
  const activeSymptom = resolveActiveSymptom(fw.slug, symptomFromUrl)
  const primarySymptom = activeSymptom
  const stepInfo = activeSymptom
    ? getFrameworkStepInSymptom(activeSymptom.id, fw.slug)
    : null

  const chain = activeSymptom
    ? getChainNeighbors(activeSymptom.id, fw.slug)
    : { requires: [], leadsTo: [] }
  const requires = chain.requires
    .map((slug) => frameworkMap.get(slug))
    .filter((fw): fw is FrameworkMeta => Boolean(fw))
  const leadsTo = chain.leadsTo
    .map((slug) => frameworkMap.get(slug))
    .filter((fw): fw is FrameworkMeta => Boolean(fw))

  function frameworkHref(slug: string) {
    return activeSymptom
      ? `/frameworks/${slug}?symptom=${activeSymptom.id}`
      : `/frameworks/${slug}`
  }

  const visibleToc = TOC_ITEMS.filter((item) => {
    if (item.id === "llm") return Boolean(fw.prompt)
    if (item.id === "algorithm") return algorithm.length > 0
    if (item.id === "anchor") return Boolean(fw.theory_anchor)
    if (item.id === "artifact") return fw.artifacts.length > 0 || Boolean(fw.artifact_desc)
    if (item.id === "antipattern") return antiPatterns.length > 0
    if (item.id === "map") return requires.length > 0 || leadsTo.length > 0
    return true
  })

  useEffect(() => {
    const key = `theory:applied:${fw.slug}`
    setApplied(localStorage.getItem(key) === "1")
  }, [fw.slug])

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [visibleToc.length])

  function toggleApply() {
    const key = `theory:applied:${fw.slug}`
    const next = !applied
    setApplied(next)
    if (next) {
      localStorage.setItem(key, "1")
    } else {
      localStorage.removeItem(key)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="blueprint-bg border-b border-surface-alt" id="top">
        <div className="max-w-[1200px] mx-auto px-8 pt-10 pb-10">
          <nav className="mono text-[10px] text-subtle uppercase tracking-[0.12em] mb-6 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-text transition-colors">
              Главная
            </Link>
            <span>›</span>
            <Link href="/frameworks" className="hover:text-text transition-colors">
              Фреймворки
            </Link>
            {fw.domain_layer && (
              <>
                <span>›</span>
                <span className="text-muted">{fw.domain_layer}</span>
              </>
            )}
            <span>›</span>
            <span className="text-text">{fw.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="max-w-[640px]">
              <h1 className="text-[36px] font-semibold leading-[1.1] tracking-[-0.7px] text-text mb-4">
                {fw.title}
              </h1>
              {(fw.summary || fw.subtitle) && (
                <p className="text-[16px] text-muted leading-relaxed">{fw.summary || fw.subtitle}</p>
              )}
            </div>

            <div className="flex flex-wrap lg:flex-col gap-2 lg:items-end shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 mono text-[11px] font-medium px-3 py-1.5 rounded-full ${difficultyHeroClass(fw.difficulty)}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full inline-block ${difficultyDotClass(fw.difficulty)}`}
                />
                Сложность: {getDifficultyLabel(fw.difficulty)}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-surface text-muted mono text-[11px] px-3 py-1.5 rounded-full border border-surface-alt">
                ⏱ &nbsp;{getEstimatedTime(fw.difficulty)}
              </span>
              {fw.domain_layer && (
                <span className="inline-flex items-center gap-1.5 bg-surface text-muted mono text-[11px] px-3 py-1.5 rounded-full border border-surface-alt">
                  {fw.domain_layer}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Layout: stretch columns so aside matches main height — required for sticky TOC */}
      <div className="max-w-[1200px] mx-auto px-8 pb-24 flex gap-8 mt-10 framework-detail-layout">
        {/* Sidebar TOC */}
        <aside className="w-44 shrink-0 hidden lg:block" aria-label="Содержание страницы">
          <div className="framework-toc-sidebar">
            <p className="mono text-[10px] text-subtle uppercase tracking-[0.12em] mb-3">Содержание</p>
            <nav className="space-y-0.5">
              {visibleToc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`toc-link block text-[12px] py-1 pl-3 border-l-2 transition-colors ${
                    activeSection === item.id
                      ? "active text-text font-medium border-text"
                      : "text-muted hover:text-text border-transparent"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {fw.links.length > 0 && (
              <div className="mt-8 space-y-1.5">
                <p className="mono text-[10px] text-subtle uppercase tracking-[0.12em] mb-2">
                  Ссылки
                </p>
                {fw.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[11px] text-muted hover:text-text transition-colors flex items-center gap-1.5"
                  >
                    <svg
                      className="w-3 h-3 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={toggleApply}
                className={`w-full text-[12px] font-medium px-3 py-2.5 rounded-[8px] border transition-colors text-left flex items-center gap-2 ${
                  applied
                    ? "bg-text text-white border-text"
                    : "bg-surface-alt text-text border-[#d1d5db] hover:bg-[#e0e0e0]"
                }`}
              >
                {!applied ? (
                  <span className="text-base">○</span>
                ) : (
                  <span className="text-base">✓</span>
                )}
                <span>{applied ? "Применено ✓" : "Применил"}</span>
              </button>
              {applied && (
                <p className="mono text-[10px] text-subtle mt-1.5 pl-1">сохранено локально</p>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-10">
          {/* Block A: Context */}
          <section id="pain" className="scroll-mt-20">
            <BlockLabel>Блок A — Контекст</BlockLabel>

            {primarySymptom && (
              <div className="bg-[#fef2f2] border border-[#fecaca] rounded-[8px] p-5 mb-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="mono text-[10px] text-[#dc2626] uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                      />
                    </svg>
                    Боль
                  </div>
                  {stepInfo && (
                    <span className="mono text-[10px] text-[#b91c1c] bg-[#fee2e2] px-2 py-0.5 rounded-full shrink-0">
                      Шаг {stepInfo.step} из {stepInfo.total}
                    </span>
                  )}
                </div>
                <p className="text-[14px] text-[#7f1d1d] font-medium leading-snug mb-1">
                  {primarySymptom.title}
                </p>
                <p className="text-[13px] text-[#b91c1c] leading-relaxed">{primarySymptom.goal}</p>
              </div>
            )}

            {frameworkSymptoms.length > 0 && (
              <div className="mb-5">
                {frameworkSymptoms.length > 1 && (
                  <p className="mono text-[10px] text-subtle uppercase tracking-wider mb-2">
                    Путь обучения
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {frameworkSymptoms.map((s) => {
                    const isActive = activeSymptom?.id === s.id
                    return (
                      <Link
                        key={s.id}
                        href={`/frameworks/${fw.slug}?symptom=${s.id}`}
                        className={`mono text-[10px] px-2 py-1 rounded-full border transition-colors ${
                          isActive
                            ? "bg-text text-white border-text"
                            : "bg-surface border-surface-alt text-muted hover:border-[#d1d5db]"
                        }`}
                      >
                        {s.title}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {fw.intent && (
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[8px] p-5">
                <div className="mono text-[10px] text-[#16a34a] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Цель
                </div>
                <p className="text-[15px] text-[#14532d] leading-relaxed">{fw.intent}</p>
              </div>
            )}
          </section>

          {/* LLM Prompt */}
          {fw.prompt && (
            <section id="llm" className="scroll-mt-20">
              <BlockLabel>LLM-ускоритель</BlockLabel>

              <div className="bg-surface rounded-[8px] border border-surface-alt overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-surface-alt bg-surface-alt/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#94a3b8]" />
                    <span className="mono text-[11px] text-muted">{fw.slug}-prompt.txt</span>
                  </div>
                  <CopyButton text={fw.prompt} />
                </div>
                <pre className="mono text-[12px] text-muted leading-relaxed p-5 whitespace-pre-wrap overflow-x-auto">
                  {fw.prompt}
                </pre>
              </div>

              <p className="text-[12px] text-subtle mt-2 px-1">
                Вставьте промт в ChatGPT / Claude / Gemini, заменив{" "}
                <span className="mono bg-surface-alt px-1 py-0.5 rounded text-[11px]">[...]</span>{" "}
                данными вашего проекта.
              </p>
            </section>
          )}

          {/* Block B: Algorithm */}
          {algorithm.length > 0 && (
            <section id="algorithm" className="scroll-mt-20">
              <BlockLabel>Блок B — Механика · Алгоритм</BlockLabel>

              <div className="bg-surface rounded-[8px] border border-surface-alt divide-y divide-surface-alt">
                {algorithm.map((step) => (
                  <div key={step.number} className="step-item flex items-start gap-4 p-4">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-[#d1d5db] text-text accent-[#282828] shrink-0 mt-0.5"
                      />
                      <div>
                        <div className="mono text-[10px] text-subtle mb-0.5">
                          ШАГ {String(step.number).padStart(2, "0")}
                        </div>
                        <p className="step-label text-[14px] text-text font-medium leading-snug">
                          {step.title}
                        </p>
                        {step.description && (
                          <p className="text-[13px] text-muted mt-1 leading-relaxed">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Theory Anchor */}
          {fw.theory_anchor && (
            <section id="anchor" className="scroll-mt-20">
              <div className="relative bg-[#eef2f7] border border-[#c7d6ea] rounded-[8px] p-6 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(30,58,95,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,95,0.06) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="relative">
                  <div className="mono text-[10px] text-[#1e3a5f]/60 uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                    <span>◆</span> Что вы получите
                  </div>
                  {fw.theory_anchor.split(/\n\n+/).map((paragraph, index) => (
                    <p
                      key={index}
                      className={
                        index === 0
                          ? "text-[15px] text-[#1e3a5f] leading-relaxed font-medium"
                          : "text-[13px] text-[#1e3a5f]/70 mt-2 leading-relaxed"
                      }
                    >
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Artifact */}
          {artifactGallery}

          {!artifactGallery && fw.artifact_desc && (
            <section id="artifact" className="scroll-mt-20">
              <BlockLabel>Артефакт</BlockLabel>

              <div className="bg-surface rounded-[8px] border border-surface-alt overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-surface-alt bg-surface-alt/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#94a3b8]" />
                    <span className="mono text-[11px] text-muted">artifact</span>
                  </div>
                  <CopyButton text={fw.artifact_desc} label="Скопировать" />
                </div>
                <pre className="mono text-[12px] text-muted leading-relaxed p-5 whitespace-pre-wrap overflow-x-auto">
                  {fw.artifact_desc}
                </pre>
              </div>
            </section>
          )}

          {/* Anti-patterns */}
          {antiPatterns.length > 0 && (
            <section id="antipattern" className="scroll-mt-20">
              <BlockLabel>Антипаттерны</BlockLabel>

              <div className="space-y-3">
                {antiPatterns.map((ap) => (
                  <div
                    key={ap.title}
                    className="flex gap-4 bg-surface rounded-[8px] p-4 border border-surface-alt"
                  >
                    <span className="shrink-0 w-7 h-7 rounded-full bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-[#dc2626] text-sm font-bold mt-0.5">
                      ✕
                    </span>
                    <div>
                      <p className="text-[14px] text-text font-medium mb-1">{ap.title}</p>
                      {ap.description && (
                        <p className="text-[13px] text-muted leading-relaxed">{ap.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Block C: Connections */}
          {(requires.length > 0 || leadsTo.length > 0) && (
            <section id="map" className="scroll-mt-20">
              <BlockLabel>Блок C — Карта связей</BlockLabel>

              <ChainMap
                current={fw}
                requires={requires}
                leadsTo={leadsTo}
                hrefFor={frameworkHref}
                stepInfo={stepInfo}
                symptomTitle={activeSymptom?.title}
              />
            </section>
          )}
        </main>
      </div>
    </>
  )
}
