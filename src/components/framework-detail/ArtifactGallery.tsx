import type { FrameworkArtifact } from "@/lib/frameworks-index"
import ArtifactBlock from "./ArtifactBlock"
import ArtifactMarkdown from "./ArtifactMarkdown"

interface ArtifactGalleryProps {
  artifacts: FrameworkArtifact[]
}

function sectionLabel(artifacts: FrameworkArtifact[]): string {
  if (artifacts.length === 1 && artifacts[0].label) {
    return `Артефакт — ${artifacts[0].label}`
  }
  return artifacts.length > 1 ? "Артефакты" : "Артефакт"
}

export default function ArtifactGallery({ artifacts }: ArtifactGalleryProps) {
  const items = artifacts.filter((artifact) => artifact.example)
  if (items.length === 0) return null

  return (
    <section id="artifact" className="scroll-mt-20">
      <div className="mono text-[10px] text-subtle uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
        <span className="text-blueprint/60">▸</span>
        {sectionLabel(items)}
      </div>

      <div className="space-y-6">
        {items.map((artifact, index) => (
          <ArtifactBlock
            key={`${artifact.filename ?? "artifact"}-${index}`}
            artifact={artifact}
            showLabel={items.length > 1}
            markdown={
              artifact.format === "markdown" && artifact.example ? (
                <ArtifactMarkdown source={artifact.example} />
              ) : undefined
            }
          />
        ))}
      </div>
    </section>
  )
}
