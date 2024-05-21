import { deleteMovie, getMoviesByUser } from "@/api/movies";
import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";
import { MovieCard } from "@/components/core";
import { useToast } from "@/components/ui/use-toast";
import { Movie } from "@/lib/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyMovies() {
  const [userMovies, setUserMovies] = useState<Movie[]>([]);
  const { toast } = useToast();

  const fetchUserMovies = async () => {
    try {
      const res = await getMoviesByUser();
      console.log(res);
      setUserMovies(res.data.movies);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occured",
        description: "There was a problem fetching your movies"
      });
    }
  }

  useEffect(() => {
    fetchUserMovies();
  }, []);

  const handleDeleteMovie = async (movieId: string) => {
    try {
      const res = await deleteMovie(movieId);
      setUserMovies(userMovies.filter((movie) => movie.id !== movieId));
      toast({
        variant: "default",
        title: "Success",
        description: res.message
      });
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

  return (
    <div className="w-full h-full flex flex-row bg-[#18181a] text-white overflow-x-hidden scrollbar">
      <div className="w-full relative">
        <div className="absolute top-0 right-0 opacity-60 translate-x-1/2">
          <BackgroundIllustrationTop />
        </div>
        <div className="fixed bottom-0 left-0 opacity-60 -translate-x-1/2">
          <BackgroundIllustrationBottom />
        </div>
        <div className="flex flex-col py-9 px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-row justify-start gap-3 items-baseline">
              <h1 className="font-semibold text-2xl">
                Your Movies
              </h1>
              <p className="text-sm font-light italic border-l border-white pl-2">
                Manage movies that you have added to the platform
              </p>
            </div>
            <div className="flex flex-row flex-wrap gap-4 z-10">
              {
                userMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex flex-col"
                  >
                    <MovieCard movie={movie} />
                    <div className="flex flex-row w-full gap-2 mt-2">
                      <Link
                        to={`/${movie.id}`}
                        className="text-center w-full text-sm bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white px-4 py-1 rounded-sm"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteMovie(movie.id)}
                        className="text-center w-full text-sm bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white px-4 py-1 rounded-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};