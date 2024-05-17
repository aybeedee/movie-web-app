import { Search } from "@/assets/icons";
import { BackgroundIllustrationTop } from "@/assets/illustrations";
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
    <div className="w-full flex flex-row bg-[#18181a] border-b border-white/5">
      <div className="w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-60 translate-x-1/2">
          <BackgroundIllustrationTop />
        </div>
        <div className="flex flex-row justify-between items-center py-2 px-4 backdrop-blur-3xl">
          <h1 className="min-w-min text-white">
            {
              isLoggedIn ?
                `Welcome ${authInfo.user?.firstName}`
                : "Welcome to CMDb"
            }
          </h1>
          <div className="w-full fixed flex justify-center">
            <form
              className="relative w-1/3"
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
          <div className="flex flex-row z-10">
            {
              isLoggedIn ?
                <>
                  <p className="text-white">
                    Logged in as {authInfo.user?.email}
                  </p>
                  <button
                    onClick={signout}
                    className="bg-black text-white w-fit px-4 py-1 rounded-sm">
                    Signout
                  </button>
                </>
                : <div className="flex flex-row gap-2">
                  <Link
                    to="/login"
                    className="bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white font-semibold w-fit px-4 py-1 rounded-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white font-semibold w-fit px-4 py-1 rounded-sm"
                  >
                    Signup
                  </Link>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};