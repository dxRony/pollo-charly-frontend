import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthProvider'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { DashboardShell } from '@/pages/DashboardShell'
import { DashboardHomePage } from '@/pages/DashboardHomePage'
import { UsersPage } from '@/pages/UsersPage'
import { SuppliesPage } from '@/pages/SuppliesPage'
import { ComplementsPage } from '@/pages/ComplementsPage'
import { DishesPage } from '@/pages/DishesPage'
import { DailyMenuPage } from '@/pages/DailyMenuPage'
import { InventoryMovementsPage } from '@/pages/InventoryMovementsPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHomePage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="dishes" element={<DishesPage />} />
            <Route path="daily-menu" element={<DailyMenuPage />} />
            <Route path="supplies" element={<SuppliesPage />} />
            <Route path="inventory-movements" element={<InventoryMovementsPage />} />
            <Route path="complements" element={<ComplementsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
