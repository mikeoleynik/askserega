"use client"

import type { ReactNode } from "react"
import type { FrameworkArtifact } from "@/lib/frameworks-index"
import CopyButton from "./CopyButton"
import { renderArtifactCode } from "./render-artifact-code"

interface ArtifactBlockProps {
  artifact: FrameworkArtifact
  markdown?: ReactNode
  showLabel?: boolean
}

export default function ArtifactBlock({ artifact, markdown, showLabel = true }: ArtifactBlockProps) {
  if (!artifact.example) return null

  const showFooter = Boolean(artifact.open_url)

  return (
    <div>
      {showLabel && artifact.label && (
        <p className="text-[13px] text-text font-medium mb-2">{artifact.label}</p>
      )}

      <div className="bg-surface rounded-[8px] border border-surface-alt overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-surface-alt bg-surface-alt/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#94a3b8]" />
            <span className="mono text-[11px] text-muted">{artifact.filename ?? "artifact"}</span>
          </div>
          <CopyButton text={artifact.example} />
        </div>

        {artifact.format === "markdown" ? (
          <div className="p-5">{markdown}</div>
        ) : (
          <pre className="mono text-[12px] text-muted leading-relaxed p-5 whitespace-pre overflow-x-auto">
            {renderArtifactCode(artifact.example, artifact.filename)}
          </pre>
        )}
      </div>

      {showFooter && (
        <div className="flex gap-3 mt-3">
          <a
            href={artifact.open_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] bg-text text-white px-4 py-2 rounded-full font-medium hover:bg-overlay transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            {artifact.open_label ?? "Открыть"}
          </a>
          <CopyButton text={artifact.example} label="Скопировать шаблон" variant="pill" />
        </div>
      )}
    </div>
  )
}
