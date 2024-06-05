import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MyMovies from "./MyMovies";
import { getMoviesByUser, addMovie, deleteMovie } from "@/api/movies";
import { useToast } from "@/components/ui/use-toast";
import { moviesData } from "@/fixtures/movies";

jest.mock("@/api/movies");
jest.mock("@/components/ui/use-toast");

const mockGetMoviesByUser = getMoviesByUser as jest.Mock;
const mockAddMovie = addMovie as jest.Mock;
const mockDeleteMovie = deleteMovie as jest.Mock;
const mockUseToast = useToast as jest.Mock;

describe("MyMovies Component", () => {
  const toast = jest.fn();

  beforeEach(() => {
    mockUseToast.mockReturnValue({ toast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the MyMovies component and fetches user movies", async () => {
    mockGetMoviesByUser.mockResolvedValue({
      error: false,
      message: "User's movies successfully fetched",
      data: {
        movies: moviesData,
      },
    });

    render(
      <BrowserRouter>
        <MyMovies />
      </BrowserRouter>
    );

    expect(screen.getByText(/Your Movies/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetMoviesByUser).toHaveBeenCalled();
    });

    expect(screen.getByText(new RegExp(moviesData[0].title, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(moviesData[1].title, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(moviesData[2].title, "i"))).toBeInTheDocument();
  });

  test("handles adding a movie", async () => {
    mockGetMoviesByUser.mockResolvedValueOnce({
      error: false,
      message: "User's movies successfully fetched",
      data: {
        movies: [],
      },
    });

    mockAddMovie.mockResolvedValue({
      error: false,
      message: "Movie successfully added",
      data: {
        movie: moviesData[0],
      },
    });

    render(
      <BrowserRouter>
        <MyMovies />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Add a Movie/i));

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: moviesData[0].title } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: moviesData[0].description } });
    fireEvent.change(screen.getByLabelText(/Release Year/i), { target: { value: moviesData[0].releaseYear } });
    fireEvent.change(screen.getByLabelText(/Hours/i), { target: { value: moviesData[0].durationHours } });
    fireEvent.change(screen.getByLabelText(/Minutes/i), { target: { value: moviesData[0].durationMinutes } });

    fireEvent.click(screen.getByTestId(/add-movie-button/i));

    const { id, reviewCount, posterUrl, trailerUrl, ...addMoviePayload } = moviesData[0];

    await waitFor(() => {
      expect(mockAddMovie).toHaveBeenCalledWith(addMoviePayload);
    });

    expect(screen.getByText(new RegExp(moviesData[0].title, "i"))).toBeInTheDocument();

    expect(toast).toHaveBeenCalledWith({
      variant: "default",
      title: "Success",
      description: "Movie successfully added",
    });
  });

  test("handles deleting a movie", async () => {
    mockGetMoviesByUser.mockResolvedValue({
      error: false,
      message: "User's movies successfully fetched",
      data: {
        movies: [moviesData[0]],
      },
    });

    mockDeleteMovie.mockResolvedValue({
      error: false,
      message: "Movie successfully deleted",
      data: {
        count: 1,
      },
    });

    render(
      <BrowserRouter>
        <MyMovies />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetMoviesByUser).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByTestId(/delete-movie-button/i));

    await waitFor(() => {
      expect(mockDeleteMovie).toHaveBeenCalledWith(moviesData[0].id);
    });

    expect(screen.queryByText(new RegExp(moviesData[0].title, "i"))).not.toBeInTheDocument();

    expect(toast).toHaveBeenCalledWith({
      variant: "default",
      title: "Success",
      description: "Movie successfully deleted",
    });
  });

  test("handles errors during fetching movies", async () => {
    mockGetMoviesByUser.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "Internal server error",
        }
      }
    });

    render(
      <BrowserRouter>
        <MyMovies />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetMoviesByUser).toHaveBeenCalled();
    });

    expect(toast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "An error occured",
      description: "There was a problem fetching your movies",
    });
  });

  test("handles errors during adding a movie", async () => {
    mockGetMoviesByUser.mockResolvedValueOnce({
      error: false,
      message: "User's movies successfully fetched",
      data: {
        movies: [moviesData[0]],
      },
    });

    mockAddMovie.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "A movie with this title already exists",
        }
      }
    });

    render(
      <BrowserRouter>
        <MyMovies />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Add a Movie/i));

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: moviesData[0].title } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: moviesData[0].description } });
    fireEvent.change(screen.getByLabelText(/Release Year/i), { target: { value: moviesData[0].releaseYear } });
    fireEvent.change(screen.getByLabelText(/Hours/i), { target: { value: moviesData[0].durationHours } });
    fireEvent.change(screen.getByLabelText(/Minutes/i), { target: { value: moviesData[0].durationMinutes } });

    fireEvent.click(screen.getByTestId(/add-movie-button/i));

    await waitFor(() => {
      expect(mockAddMovie).toHaveBeenCalled();
    });

    expect(toast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "An error occured",
      description: "A movie with this title already exists",
    });
  });

  test("handles errors during deleting a movie", async () => {
    mockGetMoviesByUser.mockResolvedValue({
      error: false,
      message: "User's movies successfully fetched",
      data: {
        movies: [moviesData[0]],
      },
    });

    mockDeleteMovie.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "Movie does not exist",
        }
      }
    });

    render(
      <BrowserRouter>
        <MyMovies />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetMoviesByUser).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByTestId(/delete-movie-button/i));

    await waitFor(() => {
      // doesn't actually make sense to call with id of your movie and then have it err with movie does not exist.
      expect(mockDeleteMovie).toHaveBeenCalledWith(moviesData[0].id);
    });

    expect(toast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "An error occured",
      description: "Movie does not exist",
    });
  });
});