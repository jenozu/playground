import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import NotFoundPage from '../../components/layout/NotFoundPage'
import LiveDashboard from '../../features/dashboard/pages/LiveDashboard'
import { RegisteredCoursesPage } from '../../features/courses/pages/CoursesPage'
import CourseDetailPage from '../../features/courses/pages/CourseDetailPage'
import PracticePage from '../../features/practice/pages/PracticePage'
import ProjectsPage from '../../features/projects/pages/ProjectsPage'
import ProgressPage from '../../features/learning-progress/pages/ProgressPage'
import LessonPage from '../../features/lesson/pages/LessonPage'
import SettingsPage from '../../features/settings/pages/SettingsPage'

export const routes = [
  { path: '/courses/:courseId/lessons/:lessonId', element: <LessonPage /> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <LiveDashboard /> },
      { path: 'courses', element: <RegisteredCoursesPage /> },
      { path: 'courses/:courseId', element: <CourseDetailPage /> },
      { path: 'practice', element: <PracticePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
