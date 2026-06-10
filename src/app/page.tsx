import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import AboutTheoryButton from "@/components/AboutTheoryButton"
import HomeSymptomsSection from "./HomeSymptomsSection"

export default function HomePage() {
  return (
    <>
      <Header />

      <section className="blueprint-bg border-b border-surface-alt">
        <div className="max-w-[1200px] mx-auto px-8 pt-16 pb-14">
          <div className="max-w-[640px]">
            <h1 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.8px] text-text mb-5">
              Теория проекта — за 15 минут
            </h1>

            <p className="text-[16px] text-muted leading-relaxed mb-6">
              Почему сервисы разделены именно так? Где нельзя трогать? Как течёт информация?
              Эти знания живут в голове одного человека — и исчезают вместе с ним.
            </p>

            <p className="text-[16px] text-muted leading-relaxed mb-8">
              <span className="text-subtle mr-1">↓</span>
              Подборка{" "}
              <strong className="text-text font-medium">
                инженерных моделей и фреймворков
              </strong>
              , чтобы материализовать, поддерживать и передавать теорию вашего проекта.
            </p>

            <div className="flex items-center gap-2 mono text-[12px] text-muted mb-8 flex-wrap">
              <span>Выбери боль</span>
              <span className="text-subtle">→</span>
              <span>Получи модели и LLM-промт</span>
              <span className="text-subtle">→</span>
              <span>Зафикси артефакт</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/frameworks"
                className="bg-text text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-overlay transition-colors"
              >
                К фреймворкам
              </Link>
              <AboutTheoryButton />
            </div>
          </div>
        </div>
      </section>

      <HomeSymptomsSection />

      <Footer />
    </>
  )
}
