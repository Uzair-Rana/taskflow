import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDash from './pages/AdminDash'
import UserDash from './pages/UserDash'
import AdminUsers from './pages/admin/Users'
import AdminSettings from './pages/admin/Settings'
import AdminProjects from './pages/admin/Projects'
import Activity from './pages/admin/Activity'
import UserProjects from './pages/user/Projects'
import UserTasks from './pages/user/Tasks'
import ChatPage from './pages/Chat'
import { AuthProvider, useAuth } from './state/auth'

function Protected({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <Protected role="admin">
                <AdminDash />
              </Protected>
            }
          />
          <Route
            path="/admin/users"
            element={
              <Protected role="admin">
                <AdminUsers />
              </Protected>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <Protected role="admin">
                <AdminSettings />
              </Protected>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <Protected role="admin">
                <AdminProjects />
              </Protected>
            }
          />
          <Route
            path="/admin/activity"
            element={
              <Protected role="admin">
                <Activity />
              </Protected>
            }
          />
          <Route
            path="/user"
            element={
              <Protected>
                <UserDash />
              </Protected>
            }
          />
          <Route
            path="/user/projects"
            element={
              <Protected>
                <UserProjects />
              </Protected>
            }
          />
          <Route
            path="/user/tasks"
            element={
              <Protected>
                <UserTasks />
              </Protected>
            }
          />
          <Route
            path="/chat"
            element={
              <Protected>
                <ChatPage />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
