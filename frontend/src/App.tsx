import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home, Login, Signup, MyMovies, MovieDetails, Search } from "@/pages";
import { CheckLogin, RequireAuth } from "@/components/core";
import { AuthProvider } from "@/context/AuthContext";
import { NavbarLayout } from "@/layout";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<CheckLogin />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<NavbarLayout />} >
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/:movieTitle" element={<MovieDetails />} />
          <Route element={<RequireAuth />}>
            <Route path="/my-movies" element={<MyMovies />} />
          </Route>
        </Route>
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </AuthProvider>
  )
}
