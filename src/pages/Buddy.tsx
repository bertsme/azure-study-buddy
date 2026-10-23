import { useEffect, useRef, useState } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }
type Lang = 'en' | 'sw'

const STARTERS = [
  'Explain the shared responsibility model',
  'IaaS vs PaaS vs SaaS, simply',
  'CapEx vs OpEx with a real example',
  'What is an availability zone?',
]

const GREETING: Msg = {
  role: 'assistant',
  content:
    "Habari! I'm your Azure Study Buddy. Ask me about any AZ-900 concept and I'll explain it in plain language with everyday examples. Where shall we start?",
}

const OFFLINE: Msg = {
  role: 'assistant',
  content: "I couldn't reach my brain just now. Check your connection and try again in a moment.",
}

export default function Buddy() {
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [lang, setLang] = useState<Lang>('en')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return
    const next: Msg[] = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Drop the greeting: the API expects the conversation to start with the user
        body: JSON.stringify({ messages: next.slice(1), language: lang }),
      })
      if (!res.ok) throw new Error('bad status')
      const data = await res.json()
      if (typeof data.reply !== 'string') throw new Error('bad response')
      setMessages([...next, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([...next, OFFLINE])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="neu-scope min-h-[calc(100vh-3.25rem)] px-4 py-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-5">
        {/* Header card */}
        <div className="neu-raised flex flex-wrap items-center gap-4 rounded-3xl p-4">
          <img src="/study-buddy-icon.png" alt="" className="neu-glow h-16 w-16 rounded-full" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-slate-100">Azure Study Buddy</h1>
            <p className="text-xs text-slate-400">
              Ask anything about AZ-900. Unofficial, not affiliated with Microsoft.
            </p>
          </div>
          <div className="neu-inset flex rounded-full p-1" role="group" aria-label="Language">
            {(['en', 'sw'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  lang === l ? 'neu-raised-sm text-[#3fe0e0]' : 'text-slate-400'
                }`}
              >
                {l === 'en' ? 'English' : 'Kiswahili'}
              </button>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div
          ref={listRef}
          className="neu-inset h-[50vh] space-y-4 overflow-y-auto rounded-3xl p-4"
        >
          {messages.map((m, i) =>
            m.role === 'assistant' ? (
              <div key={i} className="flex items-start gap-3">
                <img src="/study-buddy-icon.png" alt="" className="h-8 w-8 shrink-0 rounded-full" />
                <p className="neu-raised-sm max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-slate-200">
                  {m.content}
                </p>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <p className="neu-raised-sm max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-[#7ff0f0]">
                  {m.content}
                </p>
              </div>
            ),
          )}

          {loading && (
            <div className="flex items-start gap-3">
              <img src="/study-buddy-icon.png" alt="" className="h-8 w-8 shrink-0 rounded-full" />
              <div className="neu-raised-sm flex gap-1.5 rounded-2xl rounded-tl-sm px-4 py-4">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-2 w-2 animate-pulse rounded-full bg-[#3fe0e0]"
                    style={{ animationDelay: `${d * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Starter chips */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-3">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="neu-raised-sm neu-press rounded-full px-4 py-2 text-xs text-slate-300 hover:text-[#3fe0e0]"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="neu-inset flex items-center gap-3 rounded-full py-2 pl-5 pr-2 focus-within:outline focus-within:outline-1 focus-within:outline-[#3fe0e0]/60">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder={
              lang === 'en' ? 'Ask about any Azure concept…' : 'Uliza kuhusu dhana yoyote ya Azure…'
            }
            className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            aria-label="Send"
            className="neu-glow neu-press h-11 w-11 rounded-full text-lg text-[#3fe0e0] disabled:opacity-40"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}