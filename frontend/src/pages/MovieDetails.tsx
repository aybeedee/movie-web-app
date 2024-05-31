import { getMovieById } from "@/api/movies";
import { addReview, deleteReview, editReview } from "@/api/review";
import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { Movie, Review, ReviewPayload } from "@/lib/types";
import { getTimeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// this page can use a lot of refactoring and componentization, for both better structure and reducing renders
export default function MovieDetails() {
  const [movie, setMovie] = useState<Movie>();
  const [rank, setRank] = useState<number>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review>();
  const [isEditingReview, setIsEditingReview] = useState<boolean>(false);
  const [reviewPayload, setReviewPayload] = useState<ReviewPayload>({
    movieId: "",
    rating: 4, // hard coded for now, will change if fully implement rating
    comment: ""
  });
  const { authInfo, isLoggedIn, loadingAuth } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const fetchMovie = async () => {
    const movieId = location.pathname.split("/")[1];
    try {
      const res = await getMovieById(movieId);
      setMovie(res.data.movie);
      setRank(res.data.rank);
      setReviews(res.data.reviews);
      // set the movie id in the review payload for potentially adding reviews
      setReviewPayload((prevState) => ({
        ...prevState,
        movieId: res.data.movie.id
      }));
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
    if (!loadingAuth && isLoggedIn) {
      const findUserReview = reviews.find((review) => review.userId === authInfo.user?.id);
      if (findUserReview) {
        setReviews(
          reviews.filter((review) => review.userId !== authInfo.user?.id)
        );
        setUserReview(findUserReview);
      }
    }
  }, [loadingAuth, isLoggedIn, authInfo, reviews]);

  useEffect(() => {
    fetchMovie();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewPayload((prevState) => ({
      ...prevState,
      comment: event.target.value
    }));
  }

  const handleAddReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await addReview(reviewPayload);
      if (movie && authInfo.user) {
        // this is just a local version for reactivity - still, does ensure that addReview() request was successful though ig
        setUserReview({
          ...reviewPayload,
          edited: false,
          createdAt: new Date().toISOString(),
          userId: authInfo.user.id,
          user: authInfo.user
        });
      }
      setReviewPayload((prevState) => ({
        ...prevState,
        comment: ""
      }));
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

  const handleEditReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await editReview(reviewPayload);
      setIsEditingReview(false);
      // checking just in case but I believe userReview will not be undefined since you can only edit if your review has been found and set
      if (userReview) {
        setUserReview({
          ...userReview,
          edited: true,
          comment: reviewPayload.comment
        });
      }
      setReviewPayload((prevState) => ({
        ...prevState,
        comment: ""
      }));
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

  const handleDeleteReview = async () => {
    try {
      let res;
      // checking just in case but I believe userReview will not be undefined since you can only delete if your review has been found and set
      if (userReview) {
        res = await deleteReview(userReview?.movieId);
      }
      setUserReview(undefined);
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
                  <h1
                    data-testid="movie-title-heading"
                    className="font-semibold text-3xl"
                  >
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
                  CMDb Rank #
                  <span data-testid="rank-span" className="font-bold">
                    {rank}
                  </span>
                </h1>
                <p className="text-base">
                  {"(With "}
                  {
                    movie?.reviewCount === 1 ?
                      `${movie?.reviewCount} review)`
                      : `${movie?.reviewCount} reviews)`
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold py-2 border-b border-[#3abab4]">
              Reviews
            </h1>
            {
              userReview ?
                <div className="flex w-full">
                  <div className="text-sm z-10 flex flex-col py-4 px-5 gap-4 min-w-[50%] rounded-md border border-[#3abab4] bg-[#3abab4]/10 shadow-black/10 shadow-2xl hover:bg-black/25 hover:shadow-black/0">
                    <div className="flex flex-row justify-between">
                      <h2 className="text-[#3abab4]">
                        You
                      </h2>
                      <p className="text-xs font-light">
                      {getTimeAgo(userReview.createdAt)}
                      </p>
                    </div>
                    {
                      isEditingReview ?
                        <form onSubmit={handleEditReview} className="flex flex-col gap-3">
                          <textarea
                            placeholder="Share your thoughts here"
                            required={true}
                            id="reviewComment"
                            name="reviewComment"
                            value={reviewPayload.comment}
                            onChange={handleInputChange}
                            rows={3}
                            className="bg-white/5 font-light text-sm py-2 px-3 rounded-sm scrollbar"
                          />
                          <button
                            data-testid="save-review-button"
                            type="submit"
                            className="place-self-end text-sm bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white w-fit px-4 py-1 rounded-sm"
                          >
                            Save
                          </button>
                        </form>
                        : <>
                          <p className="font-light">
                            {userReview.comment}
                          </p>
                          <div className="flex flex-row gap-4 justify-end">
                            <button
                              data-testid="edit-review-button"
                              className="text-sm bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white w-fit px-4 py-1 rounded-sm"
                              onClick={() => {
                                setReviewPayload((prevState) => ({
                                  ...prevState,
                                  comment: userReview.comment
                                }));
                                setIsEditingReview(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              data-testid="delete-review-button"
                              className="text-sm bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white w-fit px-4 py-1 rounded-sm"
                              onClick={handleDeleteReview}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                    }
                  </div>
                </div>
                : <div className="z-10 flex flex-col py-4 px-5 gap-4 min-w-[50%] w-min text-nowrap rounded-md bg-black/25 shadow-black/10 shadow-2xl hover:bg-black/25 hover:shadow-black/0">
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
                          className="bg-white/5 font-light text-sm py-2 px-3 rounded-sm scrollbar"
                        />
                        <button
                          data-testid="add-review-button"
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
            }
            <div className="flex flex-col gap-6">
              {
                reviews.map((review) => (
                  <div className="flex w-full" key={`${review.movieId}-${review.userId}`}>
                    <div className="text-sm z-10 flex flex-col py-4 px-5 gap-4 min-w-[50%] rounded-md bg-black/25 shadow-black/10 shadow-2xl hover:bg-black/25 hover:shadow-black/0">
                      <div className="flex flex-row justify-between">
                        <h2 className="text-[#3abab4]">
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