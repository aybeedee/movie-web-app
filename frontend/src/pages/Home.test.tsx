import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "./Home";
import { getAllRankedMovies, getFeaturedMovies, getNewMovies } from "@/api/movies";
import { useToast } from "@/components/ui/use-toast";
import { moviesData } from "@/fixtures/movies";

jest.mock("@/api/movies");
jest.mock("@/components/ui/use-toast");
jest.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselNext: () => <button>Next</button>,
  CarouselPrevious: () => <button>Previous</button>,
}));

const mockGetAllRankedMovies = getAllRankedMovies as jest.Mock;
const mockGetFeaturedMovies = getFeaturedMovies as jest.Mock;
const mockGetNewMovies = getNewMovies as jest.Mock;
const mockUseToast = useToast as jest.Mock;

describe("Home Component", () => {
  const toast = jest.fn();

  beforeEach(() => {
    mockUseToast.mockReturnValue({ toast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Home component and fetches movies", async () => {
    mockGetAllRankedMovies.mockResolvedValue({
      error: false,
      message: "New movies successfully fetched",
      data: {
        movies: [moviesData[0]],
      },
    });
    mockGetFeaturedMovies.mockResolvedValue({
      error: false,
      message: "New movies successfully fetched",
      data: {
        movies: [moviesData[1]],
      },
    });
    mockGetNewMovies.mockResolvedValue({
      error: false,
      message: "All movies successfully fetched",
      data: {
        movies: [moviesData[2]],
      },
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/Top Ranked/i)).toBeInTheDocument();
    expect(screen.getByText(/Featured Today/i)).toBeInTheDocument();
    expect(screen.getByText(/Newly Added/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetAllRankedMovies).toHaveBeenCalled();
      expect(mockGetFeaturedMovies).toHaveBeenCalled();
      expect(mockGetNewMovies).toHaveBeenCalled();
    });

    expect(screen.getByText(new RegExp(moviesData[0].title, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(moviesData[1].title, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(moviesData[2].title, "i"))).toBeInTheDocument();
  });

  test("handles errors when fetching movies", async () => {
    mockGetAllRankedMovies.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "Internal server error",
        }
      }
    });
    mockGetFeaturedMovies.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "Internal server error",
        }
      }
    });
    mockGetNewMovies.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "Internal server error",
        }
      }
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetAllRankedMovies).toHaveBeenCalled();
      expect(mockGetFeaturedMovies).toHaveBeenCalled();
      expect(mockGetNewMovies).toHaveBeenCalled();
    });

    expect(toast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "An error occured",
      description: "There was a problem fetching ranked movies.",
    });
    expect(toast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "An error occured",
      description: "There was a problem fetching featured movies.",
    });
    expect(toast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "An error occured",
      description: "There was a problem fetching new movies.",
    });
  });
});