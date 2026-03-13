import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { SessionLayout } from "./components/SessionLayout";
import { HomeDashboard } from "./pages/HomeDashboard";
import { RevisionSession } from "./pages/RevisionSession";
import { NewStudySession } from "./pages/NewStudySession";
import { TopicWorkspace } from "./pages/TopicWorkspace";
import { QuizPage } from "./pages/QuizPage";
import { ExerciseRecovery } from "./pages/ExerciseRecovery";
import { AlertnessGames } from "./pages/AlertnessGames";
import { SessionInsights } from "./pages/SessionInsights";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { AIAssistantPage } from "./pages/AIAssistantPage";
import { VideoSearchPage } from "./pages/VideoSearchPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard layout — Camera Monitor + Profile Menu, no FocusBar */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<HomeDashboard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Route>

        {/* Session layout — Camera Monitor + FocusBar + Profile Menu + Back button */}
        <Route element={<SessionLayout />}>
          <Route path="/revision"     element={<RevisionSession />} />
          <Route path="/study"        element={<NewStudySession />} />
          <Route path="/workspace"    element={<TopicWorkspace />} />
          <Route path="/quiz"         element={<QuizPage />} />
          <Route path="/exercise"     element={<ExerciseRecovery />} />
          <Route path="/games"        element={<AlertnessGames />} />
          <Route path="/alert-games"  element={<AlertnessGames />} />
          <Route path="/insights"     element={<SessionInsights />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/video-search" element={<VideoSearchPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
