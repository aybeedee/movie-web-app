import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home, Login, Signup, MyMovies, AddMovie } from "@/pages";
import { CheckLogin, VerifyAuth } from "@/components/core";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<CheckLogin />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<VerifyAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/my-movies" element={<MyMovies />} />
          <Route path="/add-movie" element={<AddMovie />} />
        </Route>
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </AuthProvider>
  )
}
