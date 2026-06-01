"use client"

interface TagProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function Tag({ children, onClick, className = "" }: TagProps) {
  return (
    <span
      onClick={onClick}
      className={`mono text-[10px] text-subtle border border-[#d1d5db] px-1.5 py-0.5 rounded-sm ${
        onClick ? "cursor-pointer hover:bg-surface-alt" : ""
      } transition-colors ${className}`}
    >
      {children}
    </span>
  )
}
