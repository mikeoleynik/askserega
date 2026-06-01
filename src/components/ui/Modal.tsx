"use client"

import { useCallback, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return createPortal(
    <div
      className="modal-backdrop fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-overlay/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal-panel relative w-full sm:max-w-[560px] max-h-[92vh] sm:max-h-[85vh] bg-surface border border-surface-alt sm:rounded-[12px] rounded-t-[12px] shadow-[0_24px_48px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-alt shrink-0">
          <h2 id="modal-title" className="text-[16px] font-semibold text-text">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-text hover:bg-surface-alt transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  )
}
