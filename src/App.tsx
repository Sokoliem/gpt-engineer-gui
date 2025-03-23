import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import Layout from '@/components/layout/layout'
import Dashboard from '@/pages/dashboard'
import ProjectWorkspace from '@/pages/project-workspace'
import Settings from '@/pages/settings'
import NewProject from '@/pages/new-project'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="gpt-engineer-theme">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="project/:projectId" element={<ProjectWorkspace />} />
          <Route path="new" element={<NewProject />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App