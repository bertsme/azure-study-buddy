import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TOPICS } from '../data/topics'
import { buildPlan } from '../lib/plan'
import { setPlanInputs, useStore } from '../store'

const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const half = (h: number) => Math.round(h * 2) / 2
const topicName = (id: string) => TOPICS.find((t) => t.id === id)?.name ?? id

export default function Planner() {
  const { examDate, hoursPerWeek, attempts } = useStore()
  const [date, setDate] = useState(examDate ?? '')
  const [hours, setHours] = useState(String(hoursPerWeek ?? 5))
  const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD

  const plan = useMemo(
    () => (examDate && hoursPerWeek ? buildPlan(examDate, hoursPerWeek, attempts) : null),
    [examDate, hoursPerWeek, attempts],
  )

  function save() {
    const h = Number(hours)
    if (!date || !(h > 0)) return
    setPlanInputs(date, Math.min(h, 60))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="rounded-xl bg-slate-900 p-6">
        <h2 className="text-lg font-semibold">Plan my study time</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-slate-300">
            Exam date
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-100"
            />
          </label>
          <label className="text-sm text-slate-300">
            Hours you can study per week
            <input
              type="number"
              min={1}
              max={60}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-100"
            />
          </label>
        </div>
        <button
          onClick={save}
          className="mt-4 rounded-lg bg-sky-500 px-4 py-2 font-medium text-white"
        >
          Build my plan
        </button>
      </div>

      {examDate && !plan && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          That exam date is today or already passed. Pick a future date.
        </div>
      )}

      {plan && (
        <>
          <div className="rounded-xl bg-slate-900 p-6 text-center">
            <p className="text-4xl font-bold">{plan.daysLeft} days</p>
            <p className="mt-1 text-slate-400">
              about {half(plan.totalHours)} study hours until your exam
            </p>
            {attempts.length === 0 && (
              <p className="mt-3 text-sm text-amber-300">
                No quiz data yet, so this plan follows the exam weightings.{' '}
                <Link to="/quiz" className="underline">
                  Take a quiz
                </Link>{' '}
                and rebuild it to focus on your weak spots.
              </p>
            )}
          </div>

          <div className="rounded-xl bg-slate-900 p-4">
            <h3 className="font-semibold">Where your time goes</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              {plan.priority.map((p) => (
                <li key={p.topic} className="flex justify-between">
                  <span>{topicName(p.topic)}</span>
                  <span className="text-slate-400">
                    {half(p.hours)} h · {Math.round(p.mastery * 100)}% mastery
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {plan.weeks.map((w, i) => (
            <div key={i} className="rounded-xl bg-slate-900 p-4">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold">
                  {w.kind === 'review' ? 'Final review' : `Week ${i + 1}`}
                </h3>
                <span className="text-xs text-slate-400">
                  {fmt(w.start)} – {fmt(w.end)} · about {half(w.hours)} h
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {w.items
                  .filter((it) => it.hours >= 0.25)
                  .map((it) => (
                    <li key={it.topic} className="rounded-lg bg-slate-800 p-3">
                      <span className="font-medium">{topicName(it.topic)}</span>
                      <span className="text-slate-400"> · {half(it.hours)} h</span>
                    </li>
                  ))}
              </ul>
              <p className="mt-3 text-xs text-slate-400">
                {w.kind === 'review'
                  ? 'Do timed quizzes across all topics, clear your due flashcards daily, and go easy the day before the exam.'
                  : 'Work through the matching Microsoft Learn modules, then check yourself with a topic quiz.'}
              </p>
            </div>
          ))}

          <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-4 text-sm">
            <p className="font-semibold">Daily 15-minute habit</p>
            <p className="mt-1 text-slate-300">
              Clear your due flashcards first, then do one short quiz on your weakest topic. Small and
              daily beats a big session once a week.
            </p>
          </div>

          <p className="text-center text-xs text-slate-500">
            A starting plan, not a guarantee. Adjust it to your own pace.
          </p>
        </>
      )}
    </div>
  )
}