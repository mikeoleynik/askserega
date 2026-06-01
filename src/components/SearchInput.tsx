"use client"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="flex-1 relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Поиск по фреймворкам…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface text-text pl-9 pr-4 py-2 rounded-full text-[13px] border border-surface-alt focus:outline-none focus:border-[#c5ccd3] placeholder:text-subtle transition-colors"
      />
    </div>
  )
}
