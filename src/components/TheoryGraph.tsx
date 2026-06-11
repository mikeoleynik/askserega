"use client"

import { useCallback, useMemo, useEffect } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import Link from "next/link"
import type { FrameworkMeta } from "@/lib/frameworks-index"
import { getAllSymptomChainEdges } from "@/lib/symptoms"
import { getDifficultyShort, type Difficulty } from "@/lib/taxonomy"
import { useTheoryMap } from "@/lib/useTheoryMap"

interface FrameworkNodeData {
  title: string
  slug: string
  difficulty: Difficulty
}

function FrameworkNode({ data }: NodeProps) {
  const d = data as unknown as FrameworkNodeData
  return (
    <Link
      href={`/frameworks/${d.slug}`}
      className="block bg-surface border border-surface-alt rounded-[8px] p-3 shadow-sm hover:border-[#d1d5db] transition-colors min-w-[140px]"
    >
      <Handle type="target" position={Position.Left} style={{ background: "#94a3b8" }} />
      <div className="text-[12px] font-semibold text-text leading-tight">{d.title}</div>
      <div className="mono text-[9px] text-subtle uppercase tracking-wider mt-0.5">
        {getDifficultyShort(d.difficulty)}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#94a3b8" }}
      />
    </Link>
  )
}

const nodeTypes = { framework: FrameworkNode }

interface TheoryGraphProps {
  frameworks: FrameworkMeta[]
}

function buildGraph(
  frameworks: FrameworkMeta[],
  addedSlugs: Set<string>
): { nodes: Node[]; edges: Edge[] } {
  const frameworkMap = new Map(frameworks.map((f) => [f.slug, f]))
  const visible = frameworks.filter((f) => addedSlugs.has(f.slug))

  const nodes: Node[] = visible.map((fw, i) => ({
    id: fw.slug,
    type: "framework",
    position: { x: (i % 4) * 220, y: Math.floor(i / 4) * 120 },
    data: { title: fw.title, slug: fw.slug, difficulty: fw.difficulty },
  }))

  const edges: Edge[] = getAllSymptomChainEdges()
    .filter(
      ({ source, target }) =>
        addedSlugs.has(source) &&
        addedSlugs.has(target) &&
        frameworkMap.has(source) &&
        frameworkMap.has(target)
    )
    .map(({ source, target }) => ({
      id: `${source}->${target}`,
      source,
      target,
      animated: true,
      style: { stroke: "#94a3b8", strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
    }))

  return { nodes, edges }
}

export default function TheoryGraph({ frameworks }: TheoryGraphProps) {
  const { slugs } = useTheoryMap()

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(frameworks, slugs),
    // пересчитываем только при изменении slugs или frameworks
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [frameworks, slugs.size, Array.from(slugs).join(",")]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Синхронизируем граф при изменении набора slug
  useEffect(() => {
    const { nodes: n, edges: e } = buildGraph(frameworks, slugs)
    setNodes(n)
    setEdges(e)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugs.size, Array.from(slugs).join(",")])

  const defaultEdgeOptions = useMemo(
    () => ({
      style: { stroke: "#94a3b8" },
      markerEnd: { type: MarkerType.ArrowClosed } as const,
    }),
    []
  )

  if (slugs.size === 0) {
    return (
      <div className="w-full h-[600px] border border-surface-alt rounded-[8px] flex flex-col items-center justify-center gap-3 text-center px-8">
        <svg
          className="h-10 w-10 text-surface-alt"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <circle cx="6" cy="12" r="2.5" strokeWidth="1.5" />
          <circle cx="18" cy="6" r="2.5" strokeWidth="1.5" />
          <circle cx="18" cy="18" r="2.5" strokeWidth="1.5" />
          <path strokeWidth="1.5" strokeLinecap="round" d="M8.4 10.8 15.6 7.2M8.4 13.2l7.2 3.6" />
        </svg>
        <p className="text-[15px] font-medium text-text">Карта пустая</p>
        <p className="text-[13px] text-muted leading-relaxed max-w-[320px]">
          Откройте любой фреймворк и нажмите{" "}
          <span className="font-medium text-text">«Добавить на карту»</span> — он появится здесь.
        </p>
        <Link
          href="/frameworks"
          className="mt-2 text-[13px] bg-text text-white px-4 py-2 rounded-full font-medium hover:bg-overlay transition-colors"
        >
          К фреймворкам
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full h-[600px] border border-surface-alt rounded-[8px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#e2e8f0" gap={24} />
        <Controls />
      </ReactFlow>
    </div>
  )
}
