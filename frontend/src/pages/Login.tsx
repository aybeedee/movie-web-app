import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="w-screen h-screen flex flex-row bg-[#18181a]">
      <div className="w-1/2 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-60 translate-x-1/2">
          <BackgroundIllustrationTop />
        </div>
        <div className="absolute bottom-0 left-0 opacity-60 -translate-x-1/2">
          <BackgroundIllustrationBottom />
        </div>
        <div className="flex flex-col gap-4 border border-red-500 h-full justify-center items-center">
          <h1 className="text-white font-semibold text-4xl text-center">
            Login to Your Account
          </h1>
          <p className="text-white text-lg text-center font-light">
            Welcome Back! Login wtih your credentials to access all features of CMDb.
          </p>
          <div className="flex justify-center items-center gap-4">
            <p className="text-white text-lg font-light">New Here?</p>
            <Link
              to="/signup"
              className="z-50 bg-white w-fit px-4 py-1 rounded-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      <div className="w-1/2 flex flex-col items-center border border-red-500">
        <h1 className="text-white text-3xl font-semibold">Sign In</h1>
        <form className="flex flex-col">
          <div className="flex flex-col">
            <label className="text-white font-light">Email</label>
            <input
              type="email"
              placeholder="username@email.com"
              required={true}
              className="px-2 py-1"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white font-light">Password</label>
            <input
              type="password"
              placeholder="********"
              required={true}
              className="px-2 py-1"
            />
          </div>
          <button
            type="submit"
            className="bg-white w-fit px-4 py-1 rounded-sm"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};