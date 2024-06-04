import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, useSearchParams } from "react-router-dom";
import Search from "./Search";
import { getSearchResults } from "@/api/movies";
import { useToast } from "@/components/ui/use-toast";
import { moviesData } from "@/fixtures/movies";

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
        movies: moviesData,
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

    await waitFor(() => {
      expect(screen.getByText(new RegExp(`${moviesData.length} results found`, "i"))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(moviesData[0].title, "i"))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(moviesData[1].title, "i"))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(moviesData[2].title, "i"))).toBeInTheDocument();
    });
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

    await waitFor(() => {
      expect(screen.getByText(/No results found/i)).toBeInTheDocument();
    });
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