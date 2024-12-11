import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginForm from "./loginForm"
import ProtectRoute from "./ProtectRoute"
import OTPInputForm from "./OTPForm"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/otp" element={<OTPInputForm />} />
        <Route
          path="/app"
          element={
            <ProtectRoute>
              <p>App</p>
            </ProtectRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
