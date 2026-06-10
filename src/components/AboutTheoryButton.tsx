"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Modal from "@/components/ui/Modal"

export default function AboutTheoryButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-surface-alt text-text px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#e0e0e0] transition-colors"
      >
        Как это работает?
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Как это работает">
        <div className="space-y-4 text-[15px] text-muted leading-relaxed">
          <h3 className="text-[17px] font-semibold text-text leading-snug">
            Четыре шага — от боли до артефакта
          </h3>

          <ol className="space-y-3 pl-5 list-decimal marker:text-text marker:font-medium">
            <li>
              <strong className="text-text font-medium">Выбери свою боль.</strong>{" "}
              Что мешает прямо сейчас — непонятные границы сервисов, долгий онбординг,
              страх менять код?
            </li>
            <li>
              <strong className="text-text font-medium">Получи набор инструментов.</strong>{" "}
              Для каждой боли собрана цепочка инженерных моделей, которые решают именно эту задачу.
            </li>
            <li>
              <strong className="text-text font-medium">Примени с помощью ИИ.</strong>{" "}
              Каждый инструмент идёт с готовым промтом. Вставь его в ChatGPT или Claude —
              и получи черновик анализа своего проекта.
            </li>
            <li>
              <strong className="text-text font-medium">Зафикси результат.</strong>{" "}
              На выходе — конкретные артефакты: ADR, контекстные карты, глоссарий.
              Общий язык для всей команды.
            </li>
          </ol>

          <p>
            Цель — не идеальная архитектура, а общее понимание системы, которое не зависит
            от одного человека.
          </p>

          <Link
            href="/frameworks"
            onClick={() => setOpen(false)}
            className="inline-block bg-text text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-overlay transition-colors mt-2"
          >
            Начать
          </Link>

          <p className="mono text-[11px] text-subtle border-t border-surface-alt pt-4 mt-2 leading-relaxed">
            В основе — работа Питера Наура (1985): создание программы — это не написание кода,
            а выстраивание теории системы в голове разработчика. Код — лишь её артефакт.
            Когда теория утрачена, код превращается в legacy.
          </p>
        </div>

        <figure className="mt-6">
          <div className="relative w-full overflow-hidden rounded-[8px] border border-surface-alt bg-surface-alt">
            <Image
              src="/img/serega.png"
              alt="Эффект Серёжи — когда разработчик уходит, его теория уходит вместе с ним"
              width={1200}
              height={800}
              className="w-full h-auto object-contain max-h-[40vh] sm:max-h-[320px]"
              sizes="(max-width: 640px) 100vw, 512px"
            />
          </div>
          <figcaption className="mono text-[10px] text-subtle mt-2 text-center">
            Эффект Серёги — теория живёт в голове, пока не зафиксирована
          </figcaption>
        </figure>
      </Modal>
    </>
  )
}
