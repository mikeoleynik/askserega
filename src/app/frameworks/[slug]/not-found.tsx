import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function FrameworkNotFound() {
  return (
    <>
      <Header />
      <div className="max-w-[800px] mx-auto px-8 py-24 text-center">
        <h1 className="text-[32px] font-semibold text-text mb-4">Фреймворк не найден</h1>
        <p className="text-muted mb-8">
          Запрошенный фреймворк не существует или был перемещён.
        </p>
        <Link
          href="/frameworks"
          className="bg-text text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-overlay transition-colors inline-block"
        >
          К каталогу
        </Link>
      </div>
      <Footer />
    </>
  )
}
