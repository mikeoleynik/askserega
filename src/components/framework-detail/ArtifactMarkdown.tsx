import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"

interface ArtifactMarkdownProps {
  source: string
}

const proseTableClasses = [
  "prose prose-sm max-w-none",
  "prose-headings:text-text prose-headings:font-semibold prose-headings:tracking-tight",
  "prose-h1:text-[17px] prose-h1:mb-3 prose-h1:mt-0",
  "prose-h2:text-[14px] prose-h2:mb-2 prose-h2:mt-5",
  "prose-h3:text-[13px] prose-h3:mb-1.5 prose-h3:mt-3",
  "prose-p:text-[13px] prose-p:text-muted prose-p:leading-relaxed prose-p:my-2",
  "prose-li:text-[13px] prose-li:text-muted prose-li:leading-relaxed",
  "prose-strong:text-text prose-strong:font-semibold",
  "prose-code:text-[11px] prose-code:font-mono prose-code:text-text",
  "prose-code:bg-surface-alt prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
  "prose-code:before:content-none prose-code:after:content-none",
  "prose-ul:my-2 prose-ul:pl-4 prose-li:my-0.5",
  "prose-table:my-0 prose-table:min-w-[560px] prose-table:w-full prose-table:text-[12px]",
  "prose-table:border prose-table:border-surface-alt prose-table:rounded-[6px] prose-table:overflow-hidden",
  "prose-thead:bg-surface-alt/60 prose-thead:border-b prose-thead:border-surface-alt",
  "prose-th:text-left prose-th:text-text prose-th:font-semibold",
  "prose-th:px-3 prose-th:py-2.5 prose-th:align-top prose-th:leading-snug",
  "prose-td:px-3 prose-td:py-2.5 prose-td:text-muted prose-td:align-top prose-td:leading-relaxed",
  "prose-tr:border-b prose-tr:border-surface-alt last:prose-tr:border-0",
  "[&_tbody_tr:nth-child(even)]:bg-surface-alt/20",
].join(" ")

export default async function ArtifactMarkdown({ source }: ArtifactMarkdownProps) {
  return (
    <div className="overflow-x-auto">
      <div className={proseTableClasses}>
        <MDXRemote
          source={source}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </div>
    </div>
  )
}
