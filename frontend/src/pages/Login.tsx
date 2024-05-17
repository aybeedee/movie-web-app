import { login } from "@/api/auth";
import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { LoginData } from "@/lib/types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { saveUser } = useAuth();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await login(loginData);
      console.log(res);
      saveUser(res.data);
      toast({
        variant: "default",
        title: "Success",
        description: res.message
      });
      navigate("/");
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message ?
        error.response.data.message : "There was a problem processing your request.";
      toast({
        variant: "destructive",
        title: "An error occured",
        description: errorMessage
      });
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  return (
    <div className="w-full h-full flex flex-row bg-[#18181a] text-white">
      <div className="w-1/2 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-60 translate-x-1/2">
          <BackgroundIllustrationTop />
        </div>
        <div className="absolute bottom-0 left-0 opacity-60 -translate-x-1/2">
          <BackgroundIllustrationBottom />
        </div>
        <div className="flex flex-col gap-4 h-full justify-center items-center px-10">
          <h1 className="font-semibold text-4xl text-center">
            Login to Your Account
          </h1>
          <p className="text-lg text-center font-light">
            Welcome Back! Login wtih your credentials to access all features of CMDb.
          </p>
          <div className="flex justify-center items-center gap-4">
            <p className="text-lg font-light">New Here?</p>
            <Link
              to="/signup"
              className="z-50 bg-white text-black w-fit px-4 py-1 rounded-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      <div className="w-1/2 flex flex-col items-center">
        <h1 className="text-3xl font-semibold">Sign In</h1>
        <form onSubmit={handleLogin} className="flex flex-col">
          <div className="flex flex-col">
            <label className="font-light">Email</label>
            <input
              type="email"
              placeholder="username@email.com"
              required={true}
              className="px-2 py-1 text-black"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-light">Password</label>
            <input
              type="password"
              placeholder="********"
              required={true}
              className="px-2 py-1 text-black"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="bg-white text-black w-fit px-4 py-1 rounded-sm"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};