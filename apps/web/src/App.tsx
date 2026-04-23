import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { AuthGuard } from './components/auth/AuthGuard'
import { LoginPage } from './components/auth/LoginPage'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { NewJournalPage } from './pages/NewJournalPage'
import { JournalPage } from './pages/JournalPage'
import { GraphPage } from './pages/GraphPage'
import { ChallengePage } from './pages/ChallengePage'
import { StatsPage } from './pages/StatsPage'

export default function App() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => { init() }, [init])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="journal/new" element={<NewJournalPage />} />
          <Route path="graph" element={<GraphPage />} />
          <Route path="challenge" element={<ChallengePage />} />
          <Route path="stats" element={<StatsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
