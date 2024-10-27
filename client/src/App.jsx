import {useEffect, useState} from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import AuthContext from "./context/AuthContext.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Verify from "./pages/Verify.jsx";
import Profile from "./components/Profile.jsx";
import Home from "./pages/Home.jsx";
import UserCalendar from "./pages/UserCalendar.jsx";
import {api} from "./api/base.js";
import {CircularProgress} from "@mui/material";

function App() {
  const [user, setUser] = useState(null);
  const [tempUser, setTempUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching the current user
    const fetchUserData = async () => {
      try {
        const res = await api.get("auth/me");
        setUser(res.data.user);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }finally {
        setLoading(false)
      }
    };
    fetchUserData();
  }, []);

  if (loading){
    return (
        <div style={{ height: "100vh" , width: "100vw" , display: "flex" , alignItems: "center" , justifyContent: "center"}}>
          <CircularProgress />
        </div>
    )
  }
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
                <Route path="/user-calendar" element={<UserCalendar />} />
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
