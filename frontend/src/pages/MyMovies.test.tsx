import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MyMovies from "./MyMovies";
import { getMoviesByUser, addMovie, deleteMovie } from "@/api/movies";
import { useToast } from "@/components/ui/use-toast";

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
        <MyMovies />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetMoviesByUser).toHaveBeenCalled();
    });

    expect(screen.getByText(/Your Movies/i)).toBeInTheDocument();
    expect(screen.getByText(/Inception/i)).toBeInTheDocument();
    expect(screen.getByText(/The Lion King/i)).toBeInTheDocument();
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
        movie: {
          id: 1,
          title: "Titanic",
          description: "Another masterpiece from James Cameron, 'Titanic' is a romantic epic that tells the tragic story of the ill-fated maiden voyage of the RMS Titanic. The film centers on the forbidden love between Jack, a poor artist, and Rose, a wealthy young woman, as they navigate the class struggles aboard the ship. Their love story is set against the backdrop of one of the greatest maritime disasters in history.",
          releaseYear: 1997,
          durationHours: 3,
          durationMinutes: 15,
          reviewCount: 0,
          posterUrl: "https://picsum.photos/seed/Titanic/500/750",
          trailerUrl: "https://www.youtube.com/embed/ycoY201RTRo",
        },
      },
    });

    render(
      <BrowserRouter>
        <MyMovies />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Add a Movie/i));

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Titanic" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Another masterpiece from James Cameron, 'Titanic' is a romantic epic that tells the tragic story of the ill-fated maiden voyage of the RMS Titanic. The film centers on the forbidden love between Jack, a poor artist, and Rose, a wealthy young woman, as they navigate the class struggles aboard the ship. Their love story is set against the backdrop of one of the greatest maritime disasters in history." } });
    fireEvent.change(screen.getByLabelText(/Release Year/i), { target: { value: 1997 } });
    fireEvent.change(screen.getByLabelText(/Hours/i), { target: { value: 3 } });
    fireEvent.change(screen.getByLabelText(/Minutes/i), { target: { value: 15 } });

    fireEvent.click(screen.getByTestId(/add-movie-button/i));

    await waitFor(() => {
      expect(mockAddMovie).toHaveBeenCalledWith({
        title: "Titanic",
        description: "Another masterpiece from James Cameron, 'Titanic' is a romantic epic that tells the tragic story of the ill-fated maiden voyage of the RMS Titanic. The film centers on the forbidden love between Jack, a poor artist, and Rose, a wealthy young woman, as they navigate the class struggles aboard the ship. Their love story is set against the backdrop of one of the greatest maritime disasters in history.",
        releaseYear: 1997,
        durationHours: 3,
        durationMinutes: 15,
      });
    });

    expect(screen.getByText(/Titanic/i)).toBeInTheDocument();
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
        ],
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

    fireEvent.click(screen.getByText(/Delete/i));

    await waitFor(() => {
      expect(mockDeleteMovie).toHaveBeenCalledWith(1);
    });

    expect(screen.queryByText(/Inception/i)).not.toBeInTheDocument();
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
        movies: [],
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

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Titanic" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Another masterpiece from James Cameron, 'Titanic' is a romantic epic that tells the tragic story of the ill-fated maiden voyage of the RMS Titanic. The film centers on the forbidden love between Jack, a poor artist, and Rose, a wealthy young woman, as they navigate the class struggles aboard the ship. Their love story is set against the backdrop of one of the greatest maritime disasters in history." } });
    fireEvent.change(screen.getByLabelText(/Release Year/i), { target: { value: 1997 } });
    fireEvent.change(screen.getByLabelText(/Hours/i), { target: { value: 3 } });
    fireEvent.change(screen.getByLabelText(/Minutes/i), { target: { value: 15 } });

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
        ],
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

    fireEvent.click(screen.getByText(/Delete/i));

    await waitFor(() => {
      expect(mockDeleteMovie).toHaveBeenCalledWith(1);
    });

    expect(toast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "An error occured",
      description: "Movie does not exist",
    });
  });
});