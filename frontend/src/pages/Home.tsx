import { getAllRankedMovies, getFeaturedMovies, getNewMovies } from "@/api/movies";
import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";
import { Movie } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { MovieCard } from "@/components/core";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Home() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false);
  const [canScrollNext, setCanScrollNext] = useState<boolean>(true);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [allRankedMovies, setAllRankedMovies] = useState<Movie[]>([]);
  const [newMovies, setNewMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState({
    featuredMovies: true,
    allRankedMovies: true,
    newMovies: true
  });
  const { toast } = useToast();

  const fetchFeaturedMovies = async () => {
    try {
      const res = await getFeaturedMovies();
      setFeaturedMovies(res.data.movies);
      setIsLoading((prevState) => ({
        ...prevState,
        featuredMovies: false
      }));
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occured",
        description: "There was a problem fetching featured movies."
      });
    }
  }

  const fetchAllRankedMovies = async () => {
    try {
      const res = await getAllRankedMovies();
      setAllRankedMovies(res.data.movies);
      setIsLoading((prevState) => ({
        ...prevState,
        allRankedMovies: false
      }));
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occured",
        description: "There was a problem fetching ranked movies."
      });
    }
  }

  const fetchNewMovies = async () => {
    try {
      const res = await getNewMovies();
      setNewMovies(res.data.movies);
      setIsLoading((prevState) => ({
        ...prevState,
        newMovies: false
      }));
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occured",
        description: "There was a problem fetching new movies."
      });
    }
  }

  useEffect(() => {
    fetchFeaturedMovies();
    fetchAllRankedMovies();
    fetchNewMovies();
  }, []);

  const updateCanScroll = useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    carouselApi?.on("select", updateCanScroll);

    return () => {
      carouselApi?.off("select", updateCanScroll);
    }
  }, [carouselApi, updateCanScroll]);

  return (
    <div className="w-full h-full flex flex-row bg-[#18181a] text-white overflow-x-hidden scrollbar">
      <div className="w-full relative">
        <div className="absolute top-0 right-0 opacity-60 translate-x-1/2">
          <BackgroundIllustrationTop />
        </div>
        <div className="fixed bottom-0 left-0 opacity-60 -translate-x-1/2">
          <BackgroundIllustrationBottom />
        </div>
        <div className="flex flex-col py-9">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between px-8">
              <div className="flex flex-row justify-start gap-3 items-baseline">
                <h1 className="font-semibold text-2xl">
                  Top Ranked
                </h1>
                <p className="text-sm font-light italic border-l border-white pl-2">
                  All available movies ordered by rank
                </p>
              </div>
              <div className="flex flex-row gap-3 z-10">
                <button
                  className="flex justify-center items-center h-8 w-8 rounded-full text-white bg-[#3abab4] border border-[#3abab4] hover:text-black hover:bg-white hover:border-white disabled:opacity-45 disabled:cursor-not-allowed"
                  onClick={() => carouselApi?.scrollPrev()}
                  disabled={!canScrollPrev}
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  className="flex justify-center items-center h-8 w-8 rounded-full text-white bg-[#3abab4] border border-[#3abab4] hover:text-black hover:bg-white hover:border-white disabled:opacity-45 disabled:cursor-not-allowed"
                  onClick={() => carouselApi?.scrollNext()}
                  disabled={!canScrollNext}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 px-4">
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent className="pt-2 pb-16 pl-4">
                  {
                    isLoading.allRankedMovies ?
                      [...Array(5).keys()].map((element) => (
                        <CarouselItem key={element} className="max-w-min">
                          <div className="flex flex-col w-44 justify-center items-center h-[17.5rem] rounded-md shadow-black/75 shadow-2xl hover:bg-black/25 hover:shadow-black/5 active:bg-black/65 active:shadow-black active:shadow-inner active:border-black/25 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-transparent border-2 border-white/20 animate-ping" />
                          </div>
                        </CarouselItem>
                      ))
                      : allRankedMovies.map((rankedMovie) => (
                        <CarouselItem key={rankedMovie.id} className="max-w-min">
                          <MovieCard movie={rankedMovie} />
                        </CarouselItem>
                      ))
                  }
                </CarouselContent>
              </Carousel>
            </div>

            {/* <div className="px-12">
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent className="pt-2 pb-16 pl-8 mr-8">
                  {
                    isLoading.allRankedMovies ?
                      [...Array(5).keys()].map((element) => (
                        <CarouselItem key={element} className="max-w-min">
                          <div className="flex flex-col w-44 justify-center items-center h-[17.5rem] rounded-md shadow-black/75 shadow-2xl hover:bg-black/25 hover:shadow-black/5 active:bg-black/65 active:shadow-black active:shadow-inner active:border-black/25 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-transparent border-2 border-white/20 animate-ping" />
                          </div>
                        </CarouselItem>
                      ))
                      : allRankedMovies.map((rankedMovie) => (
                        <CarouselItem key={rankedMovie.id} className="max-w-min">
                          <MovieCard movie={rankedMovie} />
                        </CarouselItem>
                      ))
                  }
                </CarouselContent>
                <CarouselPrevious className="text-white bg-[#3abab4] border border-[#3abab4] hover:border-white" />
                <CarouselNext className="text-white bg-[#3abab4] border border-[#3abab4] hover:border-white" />
              </Carousel>
            </div> */}
          </div>
          <div className="flex flex-col gap-4 mb-16 px-8">
            <div className="flex flex-row justify-start gap-3 items-baseline">
              <h1 className="font-semibold text-2xl">
                Featured Today
              </h1>
              <p className="text-sm font-light italic border-l border-white pl-2">
                Carefully curated list of featured movies for the day
              </p>
            </div>
            <div className="flex flex-row flex-wrap gap-4 z-10">
              {
                isLoading.featuredMovies ?
                  [...Array(5).keys()].map((element) => (
                    <div key={element} className="flex flex-col w-44 justify-center items-center h-[17.5rem] rounded-md shadow-black/75 shadow-2xl hover:bg-black/25 hover:shadow-black/5 active:bg-black/65 active:shadow-black active:shadow-inner active:border-black/25 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-transparent border-2 border-white/20 animate-ping" />
                    </div>
                  ))
                  : featuredMovies.map((featuredMovie) => (
                    <MovieCard key={featuredMovie.id} movie={featuredMovie} />
                  ))
              }
            </div>
          </div>
          <div className="flex flex-col gap-4 px-8">
            <div className="flex flex-row justify-start gap-3 items-baseline">
              <h1 className="font-semibold text-2xl">
                Newly Added
              </h1>
              <p className="text-sm font-light italic border-l border-white pl-2">
                Movies that have been recently added to the platform
              </p>
            </div>
            <div className="flex flex-row flex-wrap gap-4 z-10">
              {
                isLoading.newMovies ?
                  [...Array(5).keys()].map((element) => (
                    <div key={element} className="flex flex-col w-44 justify-center items-center h-[17.5rem] rounded-md shadow-black/75 shadow-2xl hover:bg-black/25 hover:shadow-black/5 active:bg-black/65 active:shadow-black active:shadow-inner active:border-black/25 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-transparent border-2 border-white/20 animate-ping" />
                    </div>
                  ))
                  : newMovies.map((newMovie) => (
                    <MovieCard key={newMovie.id} movie={newMovie} />
                  ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};