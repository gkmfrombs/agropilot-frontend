import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { IOSDevice } from './components/IOSFrame';
import Login from './screens/Login';
import MorningBriefing from './screens/MorningBriefing';
import FarmerProfile from './screens/FarmerProfile';
import PredictiveAlert from './screens/PredictiveAlert';
import AIConsultant from './screens/AIConsultant';
import RoutePlanning from './screens/RoutePlanning';
import VisitCopilot from './screens/VisitCopilot';
import LogVisit from './screens/LogVisit';
import AlertsFeed from './screens/AlertsFeed';
import CropScanner from './screens/CropScanner';
import YieldCalculator from './screens/YieldCalculator';
import RetailerProfile from './screens/RetailerProfile';
import RepProfile from './screens/RepProfile';
import ManagerLayout from './screens/manager/ManagerLayout';
import TerritoryHeatmap from './screens/manager/TerritoryHeatmap';
import KPIDashboard from './screens/manager/KPIDashboard';
import RepPerformance from './screens/manager/RepPerformance';
import AlertManagement from './screens/manager/AlertManagement';
import CampaignPerformance from './screens/manager/CampaignPerformance';

function RepApp() {
  return (
    <div className="app-container">
      <IOSDevice width={390} height={844}>
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </IOSDevice>
    </div>
  );
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
  );
}

function AppRoutes() {
  const { role } = useAuth();

  if (!role) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  if (role === 'manager') {
    return (
      <Routes>
        <Route path="/manager/*" element={<ManagerApp />} />
        <Route path="*" element={<Navigate to="/manager" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/manager/*" element={<Navigate to="/" />} />
      <Route path="/*" element={<RepApp />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}