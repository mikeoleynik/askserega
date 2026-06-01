interface BadgeProps {
  variant?: "default" | "low" | "medium" | "high" | "domain"
  children: React.ReactNode
  className?: string
}

const difficultyStyles: Record<string, string> = {
  low: "bg-[#f0fdf4] text-[#16a34a]",
  medium: "bg-[#fffbeb] text-[#b45309]",
  high: "bg-[#fef2f2] text-[#dc2626]",
}

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  const colorClass = variant === "low" || variant === "medium" || variant === "high"
    ? difficultyStyles[variant]
    : variant === "domain"
    ? "bg-blueprint-lt text-blueprint"
    : "bg-surface-alt text-muted"

  return (
    <span
      className={`mono text-[10px] px-2 py-0.5 rounded-sm font-medium ${colorClass} ${className}`}
    >
      {children}
    </span>
  )
}
