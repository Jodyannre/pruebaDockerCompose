import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Admin, DashboardClient, DashboardSecretaria, DashboardMedico } from '../containers'
import Login from '../containers/Login'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'
import Payment from '../public/payment'

function App() {
  return (
    <Routes>
      <Route
        path="login/*"
        element={
          <PublicRoute>
            <Routes>
              <Route path="/*" element={<Login />} />
            </Routes>
          </PublicRoute>
        }
      />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Routes>
              <Route path="/admin" element={<Admin />} />
              <Route path="/client" element={<DashboardClient />} />
              <Route path="/secretaria" element={<DashboardSecretaria />} />
              <Route path="/doctor" element={<DashboardMedico />} />
            </Routes>
          </PrivateRoute>
        }
      />
      <Route path="payment" >
        <Route path=":token" element={<Payment />} />
      </Route>
    </Routes>
  )
}

export default App;
