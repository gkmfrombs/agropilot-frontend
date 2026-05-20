import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/AuthContext'
import { ToastProvider } from './components/ToastContext'
import { ThemeProvider } from './components/ThemeContext'
import { useState } from 'react'
import Login from './screens/Login'
import Onboarding from './screens/Onboarding'
import MorningBriefing from './screens/MorningBriefing'
import FarmerProfile from './screens/FarmerProfile'
import PredictiveAlert from './screens/PredictiveAlert'
import AIConsultant from './screens/AIConsultant'
import RoutePlanning from './screens/RoutePlanning'
import VisitCopilot from './screens/VisitCopilot'
import LogVisit from './screens/LogVisit'
import AlertsFeed from './screens/AlertsFeed'
import CropScanner from './screens/CropScanner'
import YieldCalculator from './screens/YieldCalculator'
import RetailerProfile from './screens/RetailerProfile'
import RepProfile from './screens/RepProfile'
import { TopNav } from './components/Shared'
import TourOverlay from './components/TourOverlay'
import ManagerLayout from './screens/manager/ManagerLayout'
import TerritoryHeatmap from './screens/manager/TerritoryHeatmap'
import KPIDashboard from './screens/manager/KPIDashboard'
import RepPerformance from './screens/manager/RepPerformance'
import AlertManagement from './screens/manager/AlertManagement'
import CampaignPerformance from './screens/manager/CampaignPerformance'
import ReasoningGraph from './screens/ReasoningGraph'
import SyncCenter from './screens/SyncCenter'

function RepApp() {
  return (
    <div className="rep-layout">
      <TopNav />
      <div className="rep-content">
        <Routes>
          <Route path="/" element={<MorningBriefing />} />
          <Route path="/route" element={<RoutePlanning />} />
          <Route path="/chat" element={<AIConsultant />} />
          <Route path="/alerts" element={<AlertsFeed />} />
          <Route path="/me" element={<RepProfile />} />
          <Route path="/alert" element={<PredictiveAlert />} />
          <Route path="/farmer/:id" element={<FarmerProfile />} />
          <Route path="/retailer/:id" element={<RetailerProfile />} />
          <Route path="/visit" element={<VisitCopilot />} />
          <Route path="/log-visit" element={<LogVisit />} />
          <Route path="/scanner" element={<CropScanner />} />
          <Route path="/calculator" element={<YieldCalculator />} />
          <Route path="/profile" element={<FarmerProfile />} />
          <Route path="/graph" element={<ReasoningGraph />} />
          <Route path="/sync" element={<SyncCenter />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}

function ManagerApp() {
  return (
    <Routes>
      <Route element={<ManagerLayout />}>
        <Route index element={<TerritoryHeatmap />} />
        <Route path="kpi" element={<KPIDashboard />} />
        <Route path="reps" element={<RepPerformance />} />
        <Route path="alerts" element={<AlertManagement />} />
        <Route path="campaigns" element={<CampaignPerformance />} />
      </Route>
      <Route path="*" element={<Navigate to="/manager" />} />
    </Routes>
  )
}

/**
 * Wraps the authenticated rep app and conditionally renders the spotlight tour
 * on first login. Tour state is tracked in localStorage ('agro_tour_done').
 */
function RepAppWithTour() {
  // Always show tour — demo always shows full onboarding flow
  const [showTour, setShowTour] = useState(true)

  const handleTourDone = () => {
    setShowTour(false)
  }

  return (
    <>
      <RepApp />
      {showTour && <TourOverlay onDone={handleTourDone} />}
    </>
  )
}

function AppRoutes() {
  const { role } = useAuth()
  // Always start at /onboarding — demo always shows full flow
  const [onboarded, setOnboarded] = useState(false)

  // ── Unauthenticated ────────────────────────────────────────────────────────
  if (!role) {
    return (
      <Routes>
        <Route
          path="/onboarding"
          element={<Onboarding onComplete={() => setOnboarded(true)} />}
        />
        <Route
          path="*"
          element={onboarded ? <Login /> : <Navigate to="/onboarding" replace />}
        />
      </Routes>
    )
  }

  // ── Manager ────────────────────────────────────────────────────────────────
  if (role === 'manager') {
    return (
      <Routes>
        <Route path="/manager/*" element={<ManagerApp />} />
        <Route path="*" element={<Navigate to="/manager" />} />
      </Routes>
    )
  }

  // ── Field Rep ──────────────────────────────────────────────────────────────
  return (
    <Routes>
      <Route path="/manager/*" element={<Navigate to="/" />} />
      <Route path="/*" element={<RepAppWithTour />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
