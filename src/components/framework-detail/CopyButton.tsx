"use client"

import { useState } from "react"

export default function CopyButton({
  text,
  label = "Скопировать",
  variant = "inline",
}: {
  text: string
  label?: string
  variant?: "inline" | "pill"
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const className =
    variant === "pill"
      ? "text-[12px] bg-surface-alt text-text px-4 py-2 rounded-full font-medium hover:bg-[#e0e0e0] transition-colors inline-flex items-center gap-1.5"
      : "mono text-[11px] text-muted hover:text-text flex items-center gap-1.5 transition-colors"

  return (
    <button onClick={handleCopy} className={className}>
      {variant === "inline" &&
        (!copied ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        ))}
      <span>{copied ? "Скопировано" : label}</span>
    </button>
  )
}
