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
            <div className="mono text-[10px] text-subtle uppercase tracking-[0.12em] mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-subtle/40 inline-block" />
              Peter Naur, 1985 — программирование как построение теории
            </div>

            <h1 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.8px] text-text mb-5">
              Программирование — это акт построения теории.
            </h1>

            <p className="text-[16px] text-muted leading-relaxed mb-2">
              Код читается легко. Система — нет.
            </p>

            <p className="text-[16px] text-muted leading-relaxed mb-4">
              Почему сервисы разделены именно так? Где нельзя трогать? Как текут данные? Эти знания живут в голове одного человека — и
              исчезают вместе с ним.
            </p>
            <p className="text-[16px] text-muted leading-relaxed mb-8">
              <span className="text-subtle mr-1">↓</span>
              Подборка{" "}
              <strong className="text-text font-medium">
                инженерных моделей и фреймворков
              </strong>
              , чтобы материализовать, поддерживать и передавать теорию вашего проекта.
            </p>

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
