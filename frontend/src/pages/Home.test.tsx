import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "./Home";
import { getAllRankedMovies, getFeaturedMovies, getNewMovies } from "@/api/movies";
import { useToast } from "@/components/ui/use-toast";

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
        movies: [{
          id: "1",
          title: "Inception",
          description: "Directed by Christopher Nolan, 'Inception' is a mind-bending heist film set in a world where technology exists to enter the human mind through dreams. Dom Cobb, a skilled thief, is tasked with the seemingly impossible mission of planting an idea into the mind of a CEO. As he delves deeper into the layers of the subconscious, Cobb must confront his own demons and question the nature of reality.",
          releaseYear: 2010,
          durationHours: 2,
          durationMinutes: 28,
          reviewCount: 1,
          posterUrl: "https://picsum.photos/seed/Inception/500/750",
          trailerUrl: "https://www.youtube.com/embed/ycoY201RTRo"
        }],
      },
    });
    mockGetFeaturedMovies.mockResolvedValue({
      error: false,
      message: "New movies successfully fetched",
      data: {
        movies: [{
          id: "1",
          title: "Pulp Fiction",
          description: "Directed by Christopher Nolan, 'Inception' is a mind-bending heist film set in a world where technology exists to enter the human mind through dreams. Dom Cobb, a skilled thief, is tasked with the seemingly impossible mission of planting an idea into the mind of a CEO. As he delves deeper into the layers of the subconscious, Cobb must confront his own demons and question the nature of reality.",
          releaseYear: 2010,
          durationHours: 2,
          durationMinutes: 28,
          reviewCount: 1,
          posterUrl: "https://picsum.photos/seed/Inception/500/750",
          trailerUrl: "https://www.youtube.com/embed/ycoY201RTRo"
        }],
      },
    });
    mockGetNewMovies.mockResolvedValue({
      error: false,
      message: "All movies successfully fetched",
      data: {
        movies: [{
          id: "1",
          title: "The Godfather",
          description: "Directed by Christopher Nolan, 'Inception' is a mind-bending heist film set in a world where technology exists to enter the human mind through dreams. Dom Cobb, a skilled thief, is tasked with the seemingly impossible mission of planting an idea into the mind of a CEO. As he delves deeper into the layers of the subconscious, Cobb must confront his own demons and question the nature of reality.",
          releaseYear: 2010,
          durationHours: 2,
          durationMinutes: 28,
          reviewCount: 1,
          posterUrl: "https://picsum.photos/seed/Inception/500/750",
          trailerUrl: "https://www.youtube.com/embed/ycoY201RTRo"
        }],
      },
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

    expect(screen.getByText(/Top Ranked/i)).toBeInTheDocument();
    expect(screen.getByText(/Featured Today/i)).toBeInTheDocument();
    expect(screen.getByText(/Newly Added/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.getByText(/Pulp Fiction/i)).toBeInTheDocument();
      expect(screen.getByText(/The Godfather/i)).toBeInTheDocument();
    });
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

    await waitFor(() => {
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
});