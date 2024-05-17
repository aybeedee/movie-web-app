import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-row bg-[#18181a] text-white">
      <div className="w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-60 translate-x-1/2">
          <BackgroundIllustrationTop />
        </div>
        <div className="absolute bottom-0 left-0 opacity-60 -translate-x-1/2">
          <BackgroundIllustrationBottom />
        </div>
        <div className="flex flex-col gap-8 mt-4 mx-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-start gap-3 items-baseline">
              <h1 className="font-semibold text-2xl">
                Featured Today
              </h1>
              <p className="text-sm font-light italic border-l border-white pl-2">
                Carefully curated list of featured movies for the day
              </p>
            </div>
            <div className="h-28 w-1/2 border border-slate-700"></div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-start gap-3 items-baseline">
              <h1 className="font-semibold text-2xl">
                Top Ranked
              </h1>
              <p className="text-sm font-light italic border-l border-white pl-2">
                All available movies ordered by rank
              </p>
            </div>
            <div className="h-28 w-1/2 border border-slate-700"></div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-start gap-3 items-baseline">
              <h1 className="font-semibold text-2xl">
                Newly Added
              </h1>
              <p className="text-sm font-light italic border-l border-white pl-2">
                Movies that have been recently added to the platform
              </p>
            </div>
            <div className="h-28 w-1/2 border border-slate-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};