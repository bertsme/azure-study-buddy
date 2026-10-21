import { QUESTIONS } from '../data/questions'
import { TOPICS } from '../data/topics'
import { resetProgress, useStore } from '../store'
import type { TopicId } from '../types'

// Midpoints of the exam weighting ranges (adjust if the outline changes)
const SHARE: Record<TopicId, number> = {
  'cloud-concepts': 0.275,
  architecture: 0.375,
  'management-governance': 0.325,
}

function verdict(pct: number, answeredAny: boolean) {
  if (!answeredAny) return { label: 'No data yet', note: 'Take a quiz to get your first reading.', color: 'text-slate-400' }
  if (pct < 40) return { label: 'Early days', note: 'Keep practising and review your flashcards daily.', color: 'text-red-400' }
  if (pct < 70) return { label: 'Getting there', note: 'Focus on your weakest topic below.', color: 'text-amber-400' }
  if (pct < 85) return { label: 'Almost ready', note: 'Close the remaining gaps, then do a full run.', color: 'text-sky-400' }
  return { label: 'Looking strong', note: 'Keep it fresh with spaced flashcard reviews.', color: 'text-green-400' }
}

export default function Readiness() {
  const { attempts } = useStore()

  // Attempts are chronological, so the last write per question wins
  const latest = new Map<string, boolean>()
  for (const a of attempts) latest.set(a.questionId, a.correct)

  const rows = TOPICS.map((t) => {
    const qs = QUESTIONS.filter((q) => q.topic === t.id)
    const answered = qs.filter((q) => latest.has(q.id)).length
    const correct = qs.filter((q) => latest.get(q.id) === true).length
    const mastery = qs.length ? correct / qs.length : 0
    const accuracy = answered ? correct / answered : 0
    return { topic: t, total: qs.length, answered, correct, mastery, accuracy }
  })

  const shareSum = rows.reduce((s, r) => s + SHARE[r.topic.id], 0)
  const overall = Math.round(
    (rows.reduce((s, r) => s + SHARE[r.topic.id] * r.mastery, 0) / shareSum) * 100,
  )
  const v = verdict(overall, latest.size > 0)

  const weakest = rows
    .filter((r) => r.total > 0)
    .sort((a, b) => a.mastery - b.mastery)[0]

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="rounded-xl bg-slate-900 p-6 text-center">
        <p className="text-sm text-slate-400">Estimated readiness</p>
        <p className="mt-1 text-5xl font-bold">{overall}%</p>
        <p className={`mt-2 text-lg font-semibold ${v.color}`}>{v.label}</p>
        <p className="mt-1 text-sm text-slate-400">{v.note}</p>
        <p className="mt-3 text-xs text-slate-500">
          A rough study guide based on your practice here, not a prediction of your real exam result.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.topic.id} className="rounded-xl bg-slate-900 p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold">{r.topic.name}</h3>
              <span className="text-xs text-slate-400">Exam weight {r.topic.weight}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-500 transition-all"
                style={{ width: `${Math.round(r.mastery * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {r.correct} of {r.total} questions currently correct · {r.answered} attempted
              {r.answered > 0 && ` · ${Math.round(r.accuracy * 100)}% accuracy on attempted`}
            </p>
          </div>
        ))}
      </div>

      {latest.size > 0 && weakest && weakest.mastery < 1 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          Weakest area right now: <strong>{weakest.topic.name}</strong>. Start your next quiz there.
        </div>
      )}

      <div className="text-center">
        <button
          onClick={() => {
            if (confirm('Reset all quiz and flashcard progress?')) resetProgress()
          }}
          className="text-xs text-slate-500 underline hover:text-slate-300"
        >
          Reset progress
        </button>
      </div>
    </div>
  )
}