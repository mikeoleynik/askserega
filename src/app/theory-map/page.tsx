import Header from "@/components/Header"
import Footer from "@/components/Footer"
import TheoryGraph from "@/components/TheoryGraph"
import { getAllFrameworks } from "@/lib/frameworks-index"

export const metadata = {
  title: "Карта теории — Теория программирования",
  description: "Интерактивная визуализация связей между инженерными фреймворками",
}

export default function TheoryMapPage() {
  const frameworks = getAllFrameworks()

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-[28px] font-semibold text-text tracking-[-0.5px] mb-2">
            Карта теории
          </h1>
          <p className="text-muted text-[14px]">
            Интерактивный граф связей между фреймворками. Перетаскивайте узлы, масштабируйте,
            кликайте для перехода.
          </p>
        </div>
        <TheoryGraph frameworks={frameworks} />
      </div>
      <Footer />
    </>
  )
}
