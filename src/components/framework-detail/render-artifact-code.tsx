import type { ReactNode } from "react"

function highlightStructurizrDsl(code: string): ReactNode[] {
  const tokens: React.ReactNode[] = []
  const re = /("(?:[^"\\]|\\.)*")|\b(workspace|model|views)\b/g
  let last = 0
  let key = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(code)) !== null) {
    const index = match.index
    if (index > last) {
      tokens.push(<span key={key++}>{code.slice(last, index)}</span>)
    }
    if (match[1]) {
      tokens.push(
        <span key={key++} className="text-[#16a34a]">
          {match[1]}
        </span>
      )
    } else if (match[2]) {
      tokens.push(
        <span key={key++} className="text-[#1e3a5f] font-medium">
          {match[2]}
        </span>
      )
    }
    last = index + match[0].length
  }

  if (last < code.length) {
    tokens.push(<span key={key++}>{code.slice(last)}</span>)
  }

  return tokens
}

export function renderArtifactCode(example: string, filename?: string): ReactNode {
  if (filename?.endsWith(".dsl")) {
    return highlightStructurizrDsl(example)
  }
  return example
}
