import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home, Login, Signup, MyMovies, AddMovie } from "@/pages";
import { VerifyAuth } from "@/components";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<VerifyAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="my-movies" element={<MyMovies />} />
          <Route path="add-movie" element={<AddMovie />} />
        </Route>
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </AuthProvider>
  )
}
