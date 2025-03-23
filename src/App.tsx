import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { HomePage } from '@/pages/home-page';
import { ProjectPage } from '@/pages/project-page';
import { NewProjectPage } from '@/pages/new-project-page';
import { FavoritesPage } from '@/pages/favorites-page';
import { RecentPage } from '@/pages/recent-page';
import { ToastProvider } from '@/components/ui/toast';

function App() {
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
              </Routes>
            </main>
          </div>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;