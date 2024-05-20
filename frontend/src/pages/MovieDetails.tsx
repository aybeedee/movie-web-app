import { getMovieById } from "@/api/movies";
import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";
import { useToast } from "@/components/ui/use-toast";
import { Movie } from "@/lib/types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function MovieDetails() {
  const [movie, setMovie] = useState<Movie>();
  const location = useLocation();
  const { toast } = useToast();

  const fetchMovie = async () => {
    const movieId = location.pathname.split("/")[1];
    try {
      const res = await getMovieById(movieId);
      setMovie(res.data.movie);
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

  useEffect(() => {
    fetchMovie();
  }, []);

  // this is the third time writing the same bg jsx, can just abstract this into a component and pass pages through its outlet
  return (

    <div className="w-full h-full flex flex-row bg-[#18181a] text-white overflow-x-hidden scrollbar">
      <div className="w-full relative">
        <div className="absolute top-0 right-0 opacity-60 translate-x-1/2">
          <BackgroundIllustrationTop />
        </div>
        <div className="fixed bottom-0 left-0 opacity-60 -translate-x-1/2">
          <BackgroundIllustrationBottom />
        </div>
        <div className="flex flex-col py-9 px-8 gap-8">
          <div className="flex flex-row gap-8">
            <div className="aspect-video w-1/2">
              <iframe
                width={"100%"}
                height={"100%"}
                src={movie?.trailerUrl}
                allow="autoplay; encrypted-media"
                allowFullScreen
                allowTransparency
              />
            </div>
            <div className="flex flex-col gap-6 w-1/2">
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2">
                  <h1 className="font-semibold text-3xl">
                    {movie?.title}
                  </h1>
                  <div className="flex flex-row gap-2 items-baseline">
                    <h3>
                      {movie?.releaseYear}
                    </h3>
                    <p className="font-light italic border-l border-white pl-2">
                      {movie?.durationHours}h {movie?.durationMinutes}m
                    </p>
                  </div>
                  <p className="font-light">
                    {movie?.description}
                  </p>
                </div>
                <div className="z-10">
                  <img src={movie?.posterUrl} className="object-cover min-w-44 h-64 rounded-sm" />
                </div>
              </div>
              <div className="flex flex-row gap-2 bg-[#3abab4]/50 w-min text-nowrap py-1 px-3 rounded-full items-baseline">
                <h1>
                  CMDb Rank #<span className="font-bold">{"45"}</span>
                </h1>
                <p className="text-base">{"(With "}{"2"}{" reviews)"}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold py-2 border-b border-[#3abab4]">
              Reviews
            </h1>
            <div>
              {
                // some array . map all the reviwe
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};