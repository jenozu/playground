import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import NotFoundPage from '../../components/layout/NotFoundPage'
import DashboardPage from '../../features/dashboard/pages/DashboardPage'
import CoursesPage from '../../features/courses/pages/CoursesPage'
import PracticePage from '../../features/practice/pages/PracticePage'
import ProjectsPage from '../../features/projects/pages/ProjectsPage'
import ProgressPage from '../../features/progress/pages/ProgressPage'
import SettingsPage from '../../features/settings/pages/SettingsPage'

export const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'courses', element: <CoursesPage /> },
      { path: 'practice', element: <PracticePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
