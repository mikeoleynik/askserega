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

      <Modal isOpen={open} onClose={() => setOpen(false)} title="О теории">
        <div className="space-y-4 text-[15px] text-muted leading-relaxed">
          <h3 className="text-[17px] font-semibold text-text leading-snug">
            Программирование — это формирование теории
          </h3>

          <p>
            Питер Наур был прав: создание программы — это не написание кода, а выстраивание
            «теории» того, как работает система в голове разработчика. Код — лишь её артефакт.
          </p>

          <p>
            Когда эта «теория» утрачена, код превращается в legacy. Его можно читать, но
            невозможно развивать: вы не понимаете, <em>почему</em> система устроена именно
            так, и любое изменение становится риском.
          </p>

          <p>
            <strong className="text-text font-medium">AskSerega</strong> — это инструмент
            для материализации вашего понимания. Мы создали «дизайн-систему для ума», которая
            помогает разработчикам проектировать не просто файлы, а живую модель проекта.
          </p>

          <p>Вместо того чтобы блуждать в потемках legacy, пройдите 4 простых шага:</p>

          <ol className="space-y-3 pl-5 list-decimal marker:text-text marker:font-medium">
            <li>
              <strong className="text-text font-medium">Выберите свою «боль»:</strong> Укажите,
              что именно мешает развитию проекта сейчас (например, «непонятные границы
              сервисов» или «сложность передачи знаний»).
            </li>
            <li>
              <strong className="text-text font-medium">Соберите скелет теории:</strong> Мы
              подберём набор инженерных фреймворков, которые решают именно вашу задачу. Это
              фундамент, на котором будет строиться ваше понимание.
            </li>
            <li>
              <strong className="text-text font-medium">Примените с помощью LLM:</strong> Каждая
              модель сопровождается готовым промтом. Используйте его, чтобы проанализировать
              ваш код, выявить сущности или построить связи — AI сделает черновую работу, а
              вы — сфокусируетесь на смысле.
            </li>
            <li>
              <strong className="text-text font-medium">Зафиксируйте знания:</strong> На выходе
              у вас не просто диаграммы, а готовые артефакты (ADR, контекстные карты), которые
              станут «якорем» теории для всей команды.
            </li>
          </ol>

          <p>
            Ваша цель — не нагромождение кода, а ясность системы. Мы здесь, чтобы помочь вам
            эту ясность выстроить.
          </p>

          <Link
            href="/frameworks"
            onClick={() => setOpen(false)}
            className="inline-block bg-text text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-overlay transition-colors mt-2"
          >
            Начать построение теории
          </Link>
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
