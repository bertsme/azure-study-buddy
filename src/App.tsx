import Flashcards from './pages/flashcards'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import Quiz from './pages/quiz'
import Readiness from './pages/Readiness'
import Planner from './pages/planner'
import Buddy from './pages/Buddy'
function Home() {
  return (
    <div className="mx-auto max-w-2xl p-6 text-center">
      <h1 className="text-3xl font-bold">Azure Study Buddy</h1>
      <p className="mt-2 text-slate-400">Practise, revise and track your AZ-900 prep.</p>
      <NavLink
        to="/quiz"
        className="mt-6 inline-block rounded-lg bg-sky-500 px-5 py-2 font-medium text-white"
      >
        Start a quiz
      </NavLink>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="flex items-center gap-4 border-b border-slate-800 px-4 py-3">
          <NavLink to="/" className="font-bold">
            Azure Study Buddy
          </NavLink>
          <NavLink to="/quiz" className="text-slate-300 hover:text-white">
            Quiz
          </NavLink>
          <NavLink to="/flashcards" className="text-slate-300 hover:text-white">
            Flashcards
          </NavLink>
          <NavLink to="/readiness" className="text-slate-300 hover:text-white">
            Readiness
          </NavLink>
          <NavLink to="/planner" className="text-slate-300 hover:text-white">
            Planner
          </NavLink>
          <NavLink to="/buddy" className="text-slate-300 hover:text-white">
            Buddy
          </NavLink>
          <span className="ml-auto text-xs text-slate-500">
            Unofficial · not affiliated with Microsoft
          </span>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/readiness" element={<Readiness />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/buddy" element={<Buddy />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}