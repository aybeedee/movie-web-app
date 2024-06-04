import { Movie } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }: { movie: Movie }) {
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/${movie.id}`);
      }}
      className="flex flex-col w-44 max-w-44 rounded-md shadow-black/75 shadow-2xl hover:bg-black/25 hover:shadow-black/5 active:bg-black/65 active:shadow-black active:shadow-inner active:border-black/25 cursor-pointer"
    >
      <div
        className={
          cn(
            "h-52 rounded-sm animate-pulse bg-white/20",
            {
              "hidden": !imgLoading
            }
          )
        }
      />
      <img
        src={movie.posterUrl}
        className={
          cn(
            "object-cover h-52 rounded-sm",
            {
              "hidden": imgLoading
            }
          )
        }
        onLoad={() => setImgLoading(false)}
      />

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
    </div>
  );
};