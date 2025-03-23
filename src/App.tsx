import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { HomePage } from '@/pages/home-page';
import { ProjectPage } from '@/pages/project-page';
import { NewProjectPage } from '@/pages/new-project-page';
import { FavoritesPage } from '@/pages/favorites-page';
import { RecentPage } from '@/pages/recent-page';
import { VisionPage } from '@/pages/vision-page';
import { BenchmarkPage } from '@/pages/benchmark-page';
import { SettingsPage } from '@/pages/settings-page';
import { LogsPage } from '@/pages/logs-page';
import { ToastProvider } from '@/components/ui/toast';
import { Notifications } from '@/components/ui/notifications';
import { WelcomeScreen } from '@/components/onboarding/welcome-screen';
import { useOnboarding } from '@/hooks/use-onboarding';

function App() {
  const { showWelcome, setShowWelcome, completeOnboarding } = useOnboarding();

  return (
    <Router>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/project/:id" element={<ProjectPage />} />
                <Route path="/new" element={<NewProjectPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/recent" element={<RecentPage />} />
                <Route path="/vision" element={<VisionPage />} />
                <Route path="/benchmark" element={<BenchmarkPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/logs" element={<LogsPage />} />
              </Routes>
            </main>
          </div>
          <Notifications />
          <WelcomeScreen
            open={showWelcome}
            onClose={() => setShowWelcome(false)}
            onComplete={(apiKey) => completeOnboarding(apiKey)}
          />
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;