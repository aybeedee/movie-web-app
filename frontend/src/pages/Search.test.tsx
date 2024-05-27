import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, useSearchParams } from "react-router-dom";
import Search from "./Search";
import { getSearchResults } from "@/api/movies";
import { useToast } from "@/components/ui/use-toast";

jest.mock("@/api/movies");
jest.mock("@/components/ui/use-toast");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: jest.fn(),
}));

const mockGetSearchResults = getSearchResults as jest.Mock;
const mockUseToast = useToast as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;

describe("Search Component", () => {
  const toast = jest.fn();
  const setSearchParams = jest.fn();

  beforeEach(() => {
    mockUseToast.mockReturnValue({ toast });
    mockUseSearchParams.mockReturnValue([{ get: () => "test query" }, setSearchParams]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Search component and fetches results", async () => {
    mockGetSearchResults.mockResolvedValue({
      error: false,
      message: "New movies successfully fetched",
      data: {
        movies: [
          {
            id: 1,
            title: "Inception",
            description: "Directed by Christopher Nolan, 'Inception' is a mind-bending heist film set in a world where technology exists to enter the human mind through dreams. Dom Cobb, a skilled thief, is tasked with the seemingly impossible mission of planting an idea into the mind of a CEO. As he delves deeper into the layers of the subconscious, Cobb must confront his own demons and question the nature of reality.",
            releaseYear: 2010,
            durationHours: 2,
            durationMinutes: 28,
            reviewCount: 1,
            posterUrl: "https://picsum.photos/seed/Inception/500/750",
            trailerUrl: "https://www.youtube.com/embed/ycoY201RTRo"
          },
          {
            id: 2,
            title: "The Lion King",
            description: "Disney's live-action adaptation of the classic animated film, retelling the story of Simba, a young lion prince who flees his kingdom after the murder of his father, only to learn the true meaning of responsibility and bravery. Set against the majestic African savanna, this timeless tale explores themes of family, friendship, and destiny.",
            releaseYear: 2019,
            durationHours: 1,
            durationMinutes: 58,
            reviewCount: 0,
            posterUrl: "https://picsum.photos/seed/TheLionKing/500/750",
            trailerUrl: "https://www.youtube.com/embed/oyRxxpD3yNw"
          },
        ],
      },
    });

    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetSearchResults).toHaveBeenCalledWith("test query");
    });

    expect(screen.getByText(/2 results found/i)).toBeInTheDocument();
    expect(screen.getByText(/Inception/i)).toBeInTheDocument();
    expect(screen.getByText(/The Lion King/i)).toBeInTheDocument();
  });

  test("handles no search results", async () => {
    mockGetSearchResults.mockResolvedValue({
      error: false,
      message: "New movies successfully fetched",
      data: {
        movies: [],
      },
    });

    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetSearchResults).toHaveBeenCalledWith("test query");
    });

    expect(screen.getByText(/No results found/i)).toBeInTheDocument();
  });

  test("handles errors when fetching search results", async () => {
    mockGetSearchResults.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "Internal server error",
        }
      }
    });

    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetSearchResults).toHaveBeenCalledWith("test query");
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "An error occured",
        description: "There was a problem fetching results.",
      });
    });
  });
});