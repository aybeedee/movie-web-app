import { useAuth } from "@/hooks";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { auth, removeSession } = useAuth();
  const navigate = useNavigate();

  const signout = () => {
    removeSession();
    navigate("/login");
  }

  return (
    <div className="flex flex-row justify-between border-b border-red-500">
      <h1>
        Welcome {auth.user?.firstName}
      </h1>
      <div className="flex flex-row">
        <p>
          Logged in as {auth.user?.email}
        </p>
        <button
          onClick={signout}
          className="bg-black text-white w-fit px-4 py-1 rounded-sm">
          Signout
        </button>
      </div>
    </div>
  );
};