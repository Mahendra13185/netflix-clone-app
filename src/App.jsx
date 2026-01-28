import React, { useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Player from "./pages/Player/Player";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstRun = useRef(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // prevent duplicate firing in dev / strict mode
      if (isFirstRun.current) {
        isFirstRun.current = false;
      }

      if (!user && location.pathname !== "/login") {
        console.log("Logged Out");
        navigate("/login", { replace: true });
      }

      if (user && location.pathname === "/login") {
        console.log("Logged In");
        navigate("/", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player/:id" element={<Player />} />
      </Routes>
    </>
  );
};

export default App;
