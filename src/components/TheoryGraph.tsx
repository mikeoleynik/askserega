"use client"

import { useCallback, useMemo } from "react"
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

export default function TheoryGraph({ frameworks }: TheoryGraphProps) {
  const frameworkMap = useMemo(
    () => new Map(frameworks.map((f) => [f.slug, f])),
    [frameworks],
  )

  const initialNodes: Node[] = useMemo(
    () =>
      frameworks.map((fw, i) => ({
        id: fw.slug,
        type: "framework",
        position: { x: 0, y: i * 100 },
        data: {
          title: fw.title,
          slug: fw.slug,
          difficulty: fw.difficulty,
        },
      })),
    [frameworks],
  )

  const initialEdges: Edge[] = useMemo(() => {
    return getAllSymptomChainEdges()
      .filter(({ source, target }) => frameworkMap.has(source) && frameworkMap.has(target))
      .map(({ source, target }) => ({
        id: `${source}->${target}`,
        source,
        target,
        animated: true,
        style: { stroke: "#94a3b8", strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
      }))
  }, [frameworkMap])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const defaultEdgeOptions = useMemo(
    () => ({
      style: { stroke: "#94a3b8" },
      markerEnd: { type: MarkerType.ArrowClosed } as const,
    }),
    [],
  )

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
