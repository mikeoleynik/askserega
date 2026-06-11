"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "theory:map:slugs"

function readSlugs(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return new Set<string>(parsed)
  } catch {
    // ignore
  }
  return new Set()
}

function writeSlugs(slugs: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(slugs)))
}

export function useTheoryMap() {
  const [slugs, setSlugs] = useState<Set<string>>(() => new Set())

  // Читаем из localStorage после mount (избегаем SSR mismatch)
  useEffect(() => {
    setSlugs(readSlugs())
  }, [])

  // Синхронизация между вкладками и при возврате на /theory-map
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setSlugs(readSlugs())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      writeSlugs(next)
      return next
    })
  }, [])

  const has = useCallback((slug: string) => slugs.has(slug), [slugs])

  return { slugs, toggle, has }
}
