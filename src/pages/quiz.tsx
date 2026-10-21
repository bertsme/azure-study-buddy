import { useMemo, useState } from 'react'
import { QUESTIONS } from '../data/questions'
import { TOPICS } from '../data/topics'
import { recordAnswer } from '../store'
import type { TopicId } from '../types'

export default function Quiz() {
  const [topic, setTopic] = useState<TopicId | 'all'>('all')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const questions = useMemo(
    () => (topic === 'all' ? QUESTIONS : QUESTIONS.filter((q) => q.topic === topic)),
    [topic],
  )
  const q = questions[index]

  function restart(next: TopicId | 'all') {
    setTopic(next)
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  function choose(i: number) {
    if (selected !== null) return
    setSelected(i)
    if (recordAnswer(q, i)) setScore((s) => s + 1)
  }

  function next() {
    if (index + 1 >= questions.length) {
      setFinished(true)
    } else {
      setIndex(index + 1)
      setSelected(null)
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => restart('all')}
          className={`rounded-full px-3 py-1 text-sm ${topic === 'all' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          All topics
        </button>
        {TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => restart(t.id)}
            className={`rounded-full px-3 py-1 text-sm ${topic === t.id ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {finished || !q ? (
        <div className="rounded-xl bg-slate-900 p-6 text-center">
          <p className="text-2xl font-bold">
            {score} / {questions.length}
          </p>
          <p className="mt-2 text-slate-400">Missed questions are queued for your flashcards.</p>
          <button
            onClick={() => restart(topic)}
            className="mt-4 rounded-lg bg-sky-500 px-4 py-2 font-medium text-white"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Question {index + 1} of {questions.length}
          </p>
          <h2 className="mt-2 text-lg font-semibold">{q.text}</h2>

          <div className="mt-4 space-y-3">
            {q.options.map((opt, i) => {
              const answered = selected !== null
              const isCorrect = i === q.correctIndex
              const isPicked = i === selected
              let style = 'border-slate-700 hover:border-sky-500'
              if (answered && isCorrect) style = 'border-green-500 bg-green-500/10'
              else if (answered && isPicked) style = 'border-red-500 bg-red-500/10'
              else if (answered) style = 'border-slate-800 opacity-70'

              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={answered}
                  className={`w-full rounded-lg border p-3 text-left ${style}`}
                >
                  <span>{opt}</span>
                  {answered && (
                    <p className="mt-2 text-sm text-slate-300">{q.explanations[i]}</p>
                  )}
                </button>
              )
            })}
          </div>

          {selected !== null && (
            <button
              onClick={next}
              className="mt-4 rounded-lg bg-sky-500 px-4 py-2 font-medium text-white"
            >
              {index + 1 >= questions.length ? 'See results' : 'Next question'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}