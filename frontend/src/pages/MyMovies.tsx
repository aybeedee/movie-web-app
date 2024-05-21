import { addMovie, deleteMovie, getMoviesByUser } from "@/api/movies";
import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";
import { MovieCard } from "@/components/core";
import { useToast } from "@/components/ui/use-toast";
import { Movie, MoviePayload } from "@/lib/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MyMovies() {
  const [userMovies, setUserMovies] = useState<Movie[]>([]);
  const [isAddingMovie, setIsAddingMovie] = useState<boolean>(false);
  const [moviePayload, setMoviePayload] = useState<MoviePayload>({
    title: "",
    description: "",
    releaseYear: 2024,
    durationHours: 0,
    durationMinutes: 0
  });
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

  const handleAddMovie = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await addMovie(moviePayload);
      console.log(res);
      setIsAddingMovie(false);
      setUserMovies((prevState) => [
        res.data.movie,
        ...prevState
      ]);
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

  // can use refactoring to simpler structure, especially dialog
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
              <Dialog
                open={isAddingMovie}
                onOpenChange={(open) => setIsAddingMovie(open)}
                defaultOpen={false}
              >
                <DialogTrigger className="flex flex-col justify-center items-center gap-2 w-44 max-w-44 min-h-64 rounded-md text-sm z-10 border border-[#3abab4] bg-[#3abab4]/10 shadow-black/10 shadow-2xl hover:bg-black/25 hover:shadow-black/0 active:bg-black/65 active:shadow-black active:shadow-inner active:border-black/25 cursor-pointer">
                  <Plus className="text-[#3abab4]" />
                  <p>Add a Movie</p>
                </DialogTrigger>
                <DialogContent className="flex flex-col bg-[#18181a] text-white border border-[#3abab4]">
                  <h1 className="text-lg">Add a Movie</h1>
                  <form onSubmit={handleAddMovie} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-light">Title</label>
                      <input
                        type="text"
                        placeholder="Movie title"
                        required={true}
                        id="title"
                        name="title"
                        value={moviePayload.title}
                        onChange={(event) => {
                          setMoviePayload((prevState) => ({
                            ...prevState,
                            title: event.target.value
                          }));
                        }}
                        className="bg-white/5 font-light text-sm py-2 px-3 rounded-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-light">Description</label>
                      <textarea
                        placeholder="Describe the movie"
                        required={true}
                        id="description"
                        name="description"
                        value={moviePayload.description}
                        onChange={(event) => {
                          setMoviePayload((prevState) => ({
                            ...prevState,
                            description: event.target.value
                          }));
                        }}
                        rows={3}
                        className="bg-white/5 font-light text-sm py-2 px-3 rounded-sm scrollbar"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-light">Release Year</label>
                      <input
                        type="number"
                        required={true}
                        id="releaseYear"
                        name="releaseYear"
                        value={moviePayload.releaseYear}
                        step={"1"}
                        min={"1970"}
                        max={(new Date()).getFullYear()}
                        onChange={(event) => {
                          setMoviePayload((prevState) => ({
                            ...prevState,
                            releaseYear: Number(event.target.value)
                          }));
                        }}
                        className="bg-white/5 font-light text-sm py-2 px-3 rounded-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-light">{"Duration"}</label>
                      <div className="flex flex-row w-full gap-4">
                        <div className="flex flex-row w-full items-center gap-2">
                          <p className="text-sm">Hours:</p>
                          <input
                            type="number"
                            required={true}
                            id="durationHours"
                            name="durationHours"
                            value={moviePayload.durationHours}
                            step={"1"}
                            min={"0"}
                            max={"23"}
                            onChange={(event) => {
                              setMoviePayload((prevState) => ({
                                ...prevState,
                                durationHours: Number(event.target.value)
                              }));
                            }}
                            className="w-full bg-white/5 font-light text-sm py-2 px-3 rounded-sm"
                          />
                        </div>
                        <div className="flex flex-row w-full items-center gap-2">
                          <p className="text-sm">Minutes:</p>
                          <input
                            type="number"
                            required={true}
                            id="durationMinutes"
                            name="durationMinutes"
                            value={moviePayload.durationMinutes}
                            step={"1"}
                            min={"0"}
                            max={"59"}
                            onChange={(event) => {
                              setMoviePayload((prevState) => ({
                                ...prevState,
                                durationMinutes: Number(event.target.value)
                              }));
                            }}
                            className="w-full bg-white/5 font-light text-sm py-2 px-3 rounded-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mt-2 text-center place-self-end w-full text-sm bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white px-4 py-2 rounded-sm"
                    >
                      Add
                    </button>
                  </form>
                </DialogContent>
              </Dialog>
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