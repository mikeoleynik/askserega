import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "AskSerega — Фреймворки для проектирования систем",
  description:
    "Подборка инженерных моделей и фреймворков, чтобы материализовать, поддерживать и передавать теорию вашего проекта.",
  openGraph: {
    title: "Теория программирования",
    description:
      "Подборка инженерных моделей и фреймворков, чтобы материализовать, поддерживать и передавать теорию вашего проекта.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${jetbrainsMono.variable} bg-canvas text-text min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
