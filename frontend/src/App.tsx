import "./App.css";
import { Routes, Route } from "react-router-dom";
import VerifyAuth from "./components/VerifyAuth";

export default function App() {
  return (
    // <Routes>
    //   {/* in these two, if auth and verified, navigate to home*/}
    //   <Route path="/login" element={<Login />} />
    //   <Route path="/signup" element={<Signup />} />
    //   <Route path="/" element={<Home />} >
    //     <Route element={<RequireAuth />}>
    //       <Route path="my-movies" element={<ProfilePage />} />
    //       <Route path="add-movie" element={<SettingsPage />} />
    //     </Route>
    //   </Route>
    //   <Route path="*" element={<div>404</div>} />
    // </Routes>


    <Routes>
      {/* in these two, if auth and verified, navigate to home*/}
      <Route element={<VerifyAuth />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="my-movies" element={<MyMovies />} />
        <Route path="add-movie" element={<AddMovie />} />
      </Route>
      <Route path="*" element={<div>404</div>} />
    </Routes>
  )
}
