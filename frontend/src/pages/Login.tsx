import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";

export default function Login() {
  return (
    <div className="w-screen h-screen flex flex-row bg-[#18181a]">
      <div className="w-1/2 relative overflow-hidden border border-red-500">
        <div className="absolute top-0 right-0 opacity-60 translate-x-1/2">
          <BackgroundIllustrationTop />
        </div>
        <div className="absolute bottom-0 left-0 opacity-60 -translate-x-1/2">
          <BackgroundIllustrationBottom />
        </div>
        <h1 className="text-white text-4xl">Left</h1>
      </div>
      <div className="w-1/2 text-white text-6xl font-bold">
        Your website, reimagined
      </div>
    </div>
  );
};