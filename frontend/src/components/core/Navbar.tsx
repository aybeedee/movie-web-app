import { useAuth } from "@/hooks";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { authInfo, isLoggedIn, removeSession } = useAuth();
  const navigate = useNavigate();

  console.log("Navbar: ", {
    authInfo: authInfo,
    isLoggedIn: isLoggedIn
  });

  const signout = () => {
    removeSession();
    navigate("/login");
  }

  return (
    <div className="flex flex-row justify-between border-b border-red-500">
      <h1>
        {
          isLoggedIn ?
            `Welcome ${authInfo.user?.firstName}`
            : "Welcome to CMDb"
        }
      </h1>
      <div className="flex flex-row">
        {
          isLoggedIn ?
            <>
              <p>
                Logged in as {authInfo.user?.email}
              </p>
              <button
                onClick={signout}
                className="bg-black text-white w-fit px-4 py-1 rounded-sm">
                Signout
              </button>
            </>
            : <>
              <Link
                to="/login"
                className="bg-black text-white w-fit px-4 py-1 rounded-sm">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-black text-white w-fit px-4 py-1 rounded-sm">
                Signup
              </Link>
            </>
        }
      </div>
    </div>
  );
};