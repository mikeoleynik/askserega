import { Suspense } from "react"
import { getAllFrameworks } from "@/lib/frameworks-index"
import FrameworksClient from "./FrameworksClient"

export const metadata = {
  title: "Фреймворки — Теория программирования",
  description: "Каталог инженерных моделей и фреймворков для построения теории проекта",
}

export default function FrameworksPage() {
  const frameworks = getAllFrameworks()

  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Загрузка...</div>}>
      <FrameworksClient frameworks={frameworks} />
    </Suspense>
  )
}
