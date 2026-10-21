import { useSyncExternalStore } from 'react'
import type { Attempt, CardProgress, Question } from './types'

interface State {
  attempts: Attempt[]
  cards: Record<string, CardProgress>
  examDate?: string // ISO date
  hoursPerWeek?: number
}

const KEY = 'az900-prep-v1'
const DAY = 24 * 60 * 60 * 1000
const BOX_INTERVAL_DAYS = [0, 0, 1, 3, 7, 14] // index = box number

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { attempts: [], cards: {} }
}

let state: State = load()
const listeners = new Set<() => void>()

function commit(next: State) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {}
  listeners.forEach((l) => l())
}

export function useStore(): State {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
  )
}

// Quiz: log the attempt, and resurface the linked flashcard if it was missed
export function recordAnswer(q: Question, selectedIndex: number) {
  const correct = selectedIndex === q.correctIndex
  const attempts = [
    ...state.attempts,
    { questionId: q.id, topic: q.topic, correct, at: Date.now() },
  ]
  const cards = { ...state.cards }
  if (!correct && q.cardId) cards[q.cardId] = { box: 1, dueAt: Date.now() }
  commit({ ...state, attempts, cards })
  return correct
}

// Flashcards: Leitner. Right = up a box, wrong = back to box 1
export function reviewCard(cardId: string, gotIt: boolean) {
  const current = state.cards[cardId] ?? { box: 1, dueAt: 0 }
  const box = gotIt ? (Math.min(current.box + 1, 5) as CardProgress['box']) : 1
  commit({
    ...state,
    cards: {
      ...state.cards,
      [cardId]: { box, dueAt: Date.now() + BOX_INTERVAL_DAYS[box] * DAY },
    },
  })
}

export function setPlanInputs(examDate: string, hoursPerWeek: number) {
  commit({ ...state, examDate, hoursPerWeek })
}

// Readiness: score per topic, used by the tracker and the planner
export function topicScores(s: State = state) {
  const out: Record<string, { correct: number; total: number }> = {}
  for (const a of s.attempts) {
    out[a.topic] ??= { correct: 0, total: 0 }
    out[a.topic].total++
    if (a.correct) out[a.topic].correct++
  }
  return out
}
export function resetProgress() {
  commit({ ...state, attempts: [], cards: {} })
}