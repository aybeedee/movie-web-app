import { Movie } from "@/lib/types";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        console.log("hello");
        navigate(`/${movie.id}`);
      }}
      className="flex flex-col w-44 max-w-44 rounded-md shadow-black/75 shadow-2xl hover:bg-black/25 hover:shadow-black/5 active:bg-black/65 active:shadow-black active:shadow-inner active:border-black/25 cursor-pointer"
    >
      <img src={movie.posterUrl} className="object-cover h-52 rounded-sm" />
      <div className="flex flex-col p-2">
        <div className="flex flex-row justify-between items-baseline">
          <h1 className="font-semibold text-xs max-w-[70%] text-nowrap overflow-hidden text-ellipsis">
            {movie.title}
          </h1>
          <h2 className="text-xs font-light">
            {movie.durationHours}h {movie.durationMinutes}m
          </h2>
        </div>
        <h2 className="w-full text-start text-xs font-normal mb-1">
          {movie.releaseYear}
        </h2>
        <p className="w-full text-center font-medium text-xs border-t border-white/25 pt-1">
          {movie.reviewCount}
          {" "}
          <span className="font-light">
            review{movie.reviewCount === 1 ? "" : "s"}
          </span>
        </p>
      </div>
      {/* <div className="rounded-md border border-secondaryGrey p-1 mb-2">
        <img src={image} className="object-cover h-28 xl:h-32 2xl:h-44 w-full rounded-sm" />
      </div>
      <p className="text-sm text-tertiaryGrey font-bold">{title}</p>
      <p className="text-xs">
        By <span className="font-semibold">{brand}</span>
      </p>
      <p className="text-base font-bold text-primaryBlue mb-3">£{price}</p> */}
    </div>
  );
};