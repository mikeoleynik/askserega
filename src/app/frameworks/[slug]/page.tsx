import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getAllFrameworks, getFrameworkBySlug } from "@/lib/frameworks-index"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FrameworkDetailView from "@/components/framework-detail/FrameworkDetailView"
import ArtifactGallery from "@/components/framework-detail/ArtifactGallery"
import type { Metadata } from "next"

const baseUrl = "https://theory.dev"

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllFrameworks().map((fw) => ({ slug: fw.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fw = getFrameworkBySlug(params.slug)
  if (!fw) return {}

  return {
    title: `${fw.title} — Теория программирования`,
    description: fw.summary || fw.intent || fw.subtitle,
    openGraph: {
      title: fw.title,
      description: fw.summary || fw.intent || fw.subtitle,
    },
  }
}

export default async function FrameworkDetailPage({ params }: Props) {
  const fw = getFrameworkBySlug(params.slug)
  if (!fw) notFound()

  const allFrameworks = getAllFrameworks()

  const artifactGallery =
    fw.artifacts.length > 0 ? <ArtifactGallery artifacts={fw.artifacts} /> : undefined

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: fw.title,
    description: fw.summary || fw.intent || fw.subtitle,
    about: fw.domain_layer,
    difficulty: fw.difficulty,
    url: `${baseUrl}/frameworks/${fw.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Suspense fallback={<div className="p-8 text-center text-muted">Загрузка...</div>}>
        <FrameworkDetailView
          framework={fw}
          allFrameworks={allFrameworks}
          algorithm={fw.algorithm}
          antiPatterns={fw.antipatterns}
          artifactGallery={artifactGallery}
        />
      </Suspense>
      <Footer />
    </>
  )
}
