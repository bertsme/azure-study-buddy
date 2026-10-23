import { QUESTIONS } from '../data/questions'
import { TOPICS } from '../data/topics'
import type { Attempt, TopicId } from '../types'

const DAY = 24 * 60 * 60 * 1000

// Midpoints of the exam weighting ranges
export const SHARE: Record<TopicId, number> = {
  'cloud-concepts': 0.275,
  architecture: 0.375,
  'management-governance': 0.325,
}

// Share of each topic's questions the learner currently has right (latest answer wins)
export function topicMastery(attempts: Attempt[]): Record<TopicId, number> {
  const latest = new Map<string, boolean>()
  for (const a of attempts) latest.set(a.questionId, a.correct)
  const out = {} as Record<TopicId, number>
  for (const t of TOPICS) {
    const qs = QUESTIONS.filter((q) => q.topic === t.id)
    const correct = qs.filter((q) => latest.get(q.id) === true).length
    out[t.id] = qs.length ? correct / qs.length : 0
  }
  return out
}

export interface WeekPlan {
  kind: 'learn' | 'review'
  start: Date
  end: Date
  hours: number
  items: { topic: TopicId; hours: number }[]
}

export interface Plan {
  daysLeft: number
  totalHours: number
  weeks: WeekPlan[]
  priority: { topic: TopicId; mastery: number; hours: number }[]
}

export function buildPlan(examDate: string, hoursPerWeek: number, attempts: Attempt[]): Plan | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exam = new Date(examDate + 'T00:00:00')
  const daysLeft = Math.round((exam.getTime() - today.getTime()) / DAY)
  if (!(daysLeft > 0) || !(hoursPerWeek > 0)) return null

  const mastery = topicMastery(attempts)
  const weeksCount = Math.ceil(daysLeft / 7)
  const lastDays = daysLeft - 7 * (weeksCount - 1)

  // 2+ weeks: the last week is a review week. Otherwise one short learning stretch.
  const hasReview = weeksCount >= 2
  const reviewHours = hasReview ? (hoursPerWeek * lastDays) / 7 : 0
  const caps = hasReview
    ? Array<number>(weeksCount - 1).fill(hoursPerWeek)
    : [(hoursPerWeek * daysLeft) / 7]
  const learningHours = caps.reduce((a, b) => a + b, 0)

  // Weak topics get more time and come first
  const weighted = TOPICS.map((t) => ({
    topic: t.id,
    mastery: mastery[t.id],
    w: SHARE[t.id] * (1.25 - mastery[t.id]),
  }))
  const wSum = weighted.reduce((s, x) => s + x.w, 0)
  const priority = weighted
    .map((x) => ({ topic: x.topic, mastery: x.mastery, hours: (learningHours * x.w) / wSum }))
    .sort((a, b) => a.mastery - b.mastery)

  const dayOffset = (n: number) => {
    const d = new Date(today)
    d.setDate(d.getDate() + n)
    return d
  }
  const lastStudyDay = dayOffset(daysLeft - 1)
  const weekBounds = (i: number) => {
    const start = dayOffset(i * 7)
    const end = dayOffset(i * 7 + 6)
    return { start, end: end > lastStudyDay ? lastStudyDay : end }
  }

  // Fill learning weeks in priority order
  const weeks: WeekPlan[] = caps.map((cap, i) => ({
    kind: 'learn' as const,
    ...weekBounds(i),
    hours: cap,
    items: [],
  }))
  let wi = 0
  let capLeft = caps[0]
  for (const p of priority) {
    let remaining = p.hours
    while (remaining > 0.01 && wi < weeks.length) {
      const take = Math.min(remaining, capLeft)
      weeks[wi].items.push({ topic: p.topic, hours: take })
      remaining -= take
      capLeft -= take
      if (capLeft < 0.01 && wi < weeks.length - 1) {
        wi++
        capLeft = caps[wi]
      }
    }
  }

  if (hasReview) {
    weeks.push({
      kind: 'review',
      ...weekBounds(weeksCount - 1),
      hours: reviewHours,
      items: priority.map((p) => ({ topic: p.topic, hours: reviewHours / priority.length })),
    })
  }

  return { daysLeft, totalHours: learningHours + reviewHours, weeks, priority }
}