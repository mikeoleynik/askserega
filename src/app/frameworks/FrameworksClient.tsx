"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FrameworkCard from "@/components/FrameworkCard"
import FilterPanel from "@/components/FilterPanel"
import SearchInput from "@/components/SearchInput"
import { Badge } from "@/components/ui/badge"
import { searchFrameworks, buildSearchIndex } from "@/lib/search"
import { symptoms } from "@/lib/symptoms"
import {
  filterFrameworks,
  formatFrameworkCount,
  resolveActiveSymptom,
  buildCatalogUrl,
} from "@/lib/catalog-filter"
import type { FrameworkMeta } from "@/lib/frameworks-index"
import type { FilterState } from "@/components/FilterPanel"

interface FrameworksClientProps {
  frameworks: FrameworkMeta[]
}

export default function FrameworksClient({ frameworks }: FrameworksClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const symptomFromUrl = searchParams.get("symptom")

  const [filter, setFilter] = useState<FilterState>({
    difficulty: null,
    domain_layer: null,
    symptom: symptomFromUrl,
    search: "",
    sort: "title",
  })

  useEffect(() => {
    buildSearchIndex(frameworks)
  }, [frameworks])

  useEffect(() => {
    if (symptomFromUrl) {
      setFilter((prev) => ({ ...prev, symptom: symptomFromUrl }))
    }
  }, [symptomFromUrl])

  const updateFilter = useCallback(
    (newFilter: FilterState) => {
      setFilter(newFilter)
      router.replace(buildCatalogUrl(newFilter.symptom), { scroll: false })
    },
    [router],
  )

  const activeSymptom = resolveActiveSymptom(filter.symptom, symptoms)

  const filtered = useMemo(
    () => filterFrameworks(frameworks, filter, activeSymptom),
    [frameworks, filter, activeSymptom],
  )

  const [searched, setSearched] = useState<FrameworkMeta[]>([])

  useEffect(() => {
    if (filter.search) {
      searchFrameworks(filter.search, filtered).then(setSearched)
    } else {
      setSearched(filtered)
    }
  }, [filter.search, filtered])

  const displayed = filter.search ? searched : filtered

  const clearFilters = useCallback(() => {
    setFilter({ difficulty: null, domain_layer: null, symptom: null, search: "", sort: "title" })
    router.replace("/frameworks", { scroll: false })
  }, [router])

  const hasFilter = filter.difficulty || filter.domain_layer || filter.symptom || filter.search

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto px-8 pb-24 flex gap-8 items-start pt-8">
        <FilterPanel state={filter} onStateChange={updateFilter} />

        <div className="flex-1 min-w-0">
          {activeSymptom && (
            <div className="mb-6 p-4 bg-surface-alt rounded-[8px]">
              <p className="text-sm text-text font-medium mb-1">{activeSymptom.goal}</p>
              <p className="mono text-[11px] text-subtle">{activeSymptom.title}</p>
            </div>
          )}

          <div className="mb-5 flex items-center gap-3">
            <SearchInput
              value={filter.search}
              onChange={(v) => setFilter((prev) => ({ ...prev, search: v }))}
            />
            <div className="mono text-[11px] text-subtle whitespace-nowrap">
              {displayed.length}{" "}
              {formatFrameworkCount(displayed.length)}
            </div>
            {hasFilter && (
              <button
                onClick={clearFilters}
                className="mono text-[11px] text-muted bg-surface-alt hover:bg-[#e0e0e0] px-3 py-1.5 rounded-full transition-colors"
              >
                × сброс
              </button>
            )}
          </div>

          <div
            id="cards-grid"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {displayed.map((fw) => (
              <FrameworkCard key={fw.slug} framework={fw} symptomId={filter.symptom} />
            ))}
          </div>

          {displayed.length === 0 && (
            <div className="text-center py-20">
              <p className="mono text-sm text-subtle mb-4">
                {"// нет фреймворков по текущему фильтру"}
              </p>
              <button
                onClick={clearFilters}
                className="text-[13px] text-muted underline underline-offset-2 hover:text-text transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          )}

          {activeSymptom && displayed.length > 0 && (
            <div className="mt-8 p-4 bg-surface-alt rounded-[8px]">
              <p className="mono text-[10px] text-subtle uppercase tracking-wider mb-1">
                Результат
              </p>
              <p className="text-sm text-text">{activeSymptom.outcome}</p>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-surface-alt">
            <Link
              href="/theory-map"
              className="mono text-[11px] text-subtle hover:text-text transition-colors inline-flex items-center gap-1.5"
            >
              Карта связей всех фреймворков
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
