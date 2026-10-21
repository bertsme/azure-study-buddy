import { useState } from 'react'
import { CARDS } from '../data/data'
import { TOPICS } from '../data/topics'
import { reviewCard, useStore } from '../store'

export default function Flashcards() {
  const { cards: progress } = useStore()
  const [mode, setMode] = useState<'due' | 'all'>('due')
  const [flipped, setFlipped] = useState(false)
  const [index, setIndex] = useState(0)

  const now = Date.now()
  const dueDeck = CARDS.filter((c) => progress[c.id] && progress[c.id].dueAt <= now).sort(
    (a, b) => progress[a.id].dueAt - progress[b.id].dueAt,
  )
  const deck = mode === 'all' ? CARDS : dueDeck
  const card = deck.length ? (mode === 'all' ? deck[index % deck.length] : deck[0]) : undefined

  function answer(gotIt: boolean) {
    if (!card) return
    reviewCard(card.id, gotIt)
    setFlipped(false)
    setIndex((i) => i + 1)
  }

  function switchMode(m: 'due' | 'all') {
    setMode(m)
    setFlipped(false)
    setIndex(0)
  }

  const topicName = (id: string) => TOPICS.find((t) => t.id === id)?.name

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => switchMode('due')}
          className={`rounded-full px-3 py-1 text-sm ${mode === 'due' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          Due now ({dueDeck.length})
        </button>
        <button
          onClick={() => switchMode('all')}
          className={`rounded-full px-3 py-1 text-sm ${mode === 'all' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          Whole deck ({CARDS.length})
        </button>
      </div>

      {!card ? (
        <div className="rounded-xl bg-slate-900 p-6 text-center">
          <p className="text-lg font-semibold">Nothing due right now 🎉</p>
          <p className="mt-2 text-slate-400">
            Missed quiz questions show up here automatically. Take a quiz, or study the whole deck.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-900 p-6">
          <div className="flex justify-between text-xs text-slate-400">
            <span>{topicName(card.topic)}</span>
            <span>Box {progress[card.id]?.box ?? 'new'}</span>
          </div>

          <button
            onClick={() => setFlipped((f) => !f)}
            className="mt-4 flex min-h-48 w-full items-center justify-center rounded-lg border border-slate-700 p-6 text-left hover:border-sky-500"
          >
            <span className={flipped ? 'text-slate-200' : 'text-lg font-semibold'}>
              {flipped ? card.back : card.front}
            </span>
          </button>
          <p className="mt-2 text-center text-xs text-slate-500">
            {flipped ? 'Be honest with yourself 👇' : 'Tap the card to reveal the answer'}
          </p>

          {flipped && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => answer(false)}
                className="flex-1 rounded-lg bg-red-500/20 py-2 font-medium text-red-300"
              >
                Missed it
              </button>
              <button
                onClick={() => answer(true)}
                className="flex-1 rounded-lg bg-green-500/20 py-2 font-medium text-green-300"
              >
                Got it
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}