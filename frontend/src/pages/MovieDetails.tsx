import { getMovieById } from "@/api/movies";
import { addReview } from "@/api/review";
import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { Movie, Review, ReviewPayload } from "@/lib/types";
import { getTimeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function MovieDetails() {
  const [movie, setMovie] = useState<Movie>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewPayload, setReviewPayload] = useState<ReviewPayload>({
    movieId: "",
    rating: 4, // hard coded for now, will change if fully implement rating
    comment: ""
  });
  const { isLoggedIn, loadingAuth } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const fetchMovie = async () => {
    const movieId = location.pathname.split("/")[1];
    try {
      const res = await getMovieById(movieId);
      console.log(res.data);
      setMovie(res.data.movie);
      setReviews(res.data.reviews);
      // set the movie id in the review payload for potentially adding reviews
      setReviewPayload((prevState) => ({
        ...prevState,
        movieId: res.data.movie.id
      }))
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

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewPayload((prevState) => ({
      ...prevState,
      comment: event.target.value
    }))
  }

  const handleAddReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log(reviewPayload);
      const res = await addReview(reviewPayload);
      console.log(res);
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
      {/* this is the third time writing the same bg jsx, can just abstract this into a component and pass pages through its outlet */}
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
                className="rounded-md"
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
              <div className="flex flex-row gap-2 bg-[#3abab4]/50 w-min text-nowrap py-2 px-4 rounded-full items-baseline">
                <h1>
                  CMDb Rank #<span className="font-bold">{"45"}</span>
                </h1>
                <p className="text-base">{"(With "}{"2"}{" reviews)"}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold py-2 border-b border-[#3abab4]">
              Reviews
            </h1>
            <div className="z-10 flex flex-col py-4 px-5 gap-4 min-w-[50%] w-min text-nowrap rounded-md bg-black/25 shadow-black/10 shadow-2xl hover:bg-black/25 hover:shadow-black/0">
              <h2 className="font-light">
                Write a Review for <span className="font-semibold text-[#3abab4]">{movie?.title}</span>
              </h2>
              {
                (!loadingAuth && isLoggedIn) ?
                  <form onSubmit={handleAddReview} className="flex flex-col gap-3">
                    <textarea
                      placeholder="Share your thoughts here"
                      required={true}
                      id="reviewComment"
                      name="reviewComment"
                      value={reviewPayload.comment}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-white/5 font-light text-sm py-2 px-3 rounded-sm scrollbar" />
                    <button
                      type="submit"
                      className="text-sm bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white w-fit px-4 py-1 rounded-sm"
                    >
                      Add
                    </button>
                  </form>
                  : <div className="flex flex-row justify-center pt-2 py-4 gap-3 text-sm items-center">
                    <Link
                      to="/login"
                      className="bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white w-fit px-4 py-1 rounded-sm"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white w-fit px-4 py-1 rounded-sm"
                    >
                      Signup
                    </Link>
                  </div>
              }
            </div>
            <div className="flex flex-col gap-6">
              {
                reviews.map((review) => (
                  <div className="flex w-full" key={`${review.movieId}-${review.userId}`}>
                    <div className="text-sm z-10 flex flex-col py-4 px-5 gap-4 min-w-[50%] rounded-md bg-black/25 shadow-black/10 shadow-2xl hover:bg-black/25 hover:shadow-black/0">
                      <div className="flex flex-row justify-between">
                        <h2 className="font-semibold">
                          {review.user.firstName}{" "}{review.user.lastName}
                        </h2>
                        <p className="text-xs font-light">
                          {getTimeAgo(review.createdAt)}
                        </p>
                      </div>
                      <p className="font-light">
                        {review.comment}
                      </p>
                      {
                        review.edited &&
                        <p className="text-xs italic">
                          Edited
                        </p>
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};