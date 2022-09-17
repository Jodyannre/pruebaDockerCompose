import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../auth/context/AuthContext'

export const PrivateRoute = ({ children }) => {
  const { logged, user } = useContext(AuthContext)
  return logged ? children : <Navigate to="/login" />
}
