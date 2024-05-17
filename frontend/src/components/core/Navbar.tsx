import { Search } from "@/assets/icons";
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
    <div className="flex flex-row justify-between items-center border border-green-500">
      <h1 className="min-w-min">
        {
          isLoggedIn ?
            `Welcome ${authInfo.user?.firstName}`
            : "Welcome to CMDb"
        }
      </h1>
      <div className="w-1/2 border border-red-500">
        <form
          className="relative w-full"
          onSubmit={(event) => {
            event.preventDefault();
            // const newSearchParams = new URLSearchParams(searchParams);
            // if (productSearchValue === "") {
            //   newSearchParams.delete("search");
            //   setSearchParams(newSearchParams);
            // } else {
            //   newSearchParams.set("search", productSearchValue);
            //   setSearchParams(newSearchParams);
            // }
          }}
        >
          <div className="absolute left-2 top-[0.3rem] pr-2 border-r border-slate-200" >
            <Search />
          </div>
          <input
            className="pl-10 border border-slate-200 w-full"
            type="text"
          />
        </form>
      </div>
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