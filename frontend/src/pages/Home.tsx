import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-row bg-[#18181a]">
      <div className="w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-60 translate-x-1/2">
          <BackgroundIllustrationTop />
        </div>
        <div className="absolute bottom-0 left-0 opacity-60 -translate-x-1/2">
          <BackgroundIllustrationBottom />
        </div>
        <div className="flex flex-col gap-4 h-full justify-center items-center px-10">
          <h1 className="text-white font-semibold text-4xl text-center">
            Login to Your Account
          </h1>
          <p className="text-white text-lg text-center font-light">
            Welcome Back! Login wtih your credentials to access all features of CMDb.
          </p>
          <div className="flex justify-center items-center gap-4">
            <p className="text-white text-lg font-light">New Here?</p>

          </div>
        </div>
      </div>
    </div>
  );
};