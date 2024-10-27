import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import AuthContext from "./context/AuthContext.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Verify from "./pages/Verify.jsx";
import Profile from "./components/Profile.jsx";
import Home from "./pages/Home.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [tempUser, setTempUser] = useState(null);


  return (
    <AuthContext.Provider value={{ user, setUser, tempUser, setTempUser }}>
      <Router >
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          {user ? (
              <Route element={<RootLayout />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
          ) : (
              <>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify" element={<Verify />} />
              </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>

  )
}

export default App
