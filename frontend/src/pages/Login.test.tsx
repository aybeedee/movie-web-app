import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import { login } from "@/api/auth";
import { useAuth } from "@/hooks";
import { useToast } from "@/components/ui/use-toast";

jest.mock("@/lib/constants", () => ({
  BACKEND_URL: "http://localhost:3000",
}));
jest.mock("@/api/auth");
jest.mock("@/hooks");
jest.mock("@/components/ui/use-toast");

const mockLogin = login as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockUseToast = useToast as jest.Mock;

describe("Login Component", () => {
  const saveUser = jest.fn();
  const toast = jest.fn();

  beforeEach(() => {
    mockUseAuth.mockReturnValue({ saveUser });
    mockUseToast.mockReturnValue({ toast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("handles input change", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("submits the form successfully", async () => {
    mockLogin.mockResolvedValue({
      error: false,
      message: "Login successful",
      data: {
        user: {
          id: 1,
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
        },
        token: "eyJhbGciOiJIUzI1NiJ9eyJpZCI6MX0JAWUkAU2mWhxcd6MS8r9pd44yBIfkEBmpr3WLeqIccM",
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123"
      });
      expect(saveUser).toHaveBeenCalledWith({
        user: {
          id: 1,
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
        },
        token: "eyJhbGciOiJIUzI1NiJ9eyJpZCI6MX0JAWUkAU2mWhxcd6MS8r9pd44yBIfkEBmpr3WLeqIccM",
      });
      expect(toast).toHaveBeenCalledWith({
        variant: "default",
        title: "Success",
        description: "Login successful"
      });
    });
  });

  test("handles form submission failure", async () => {
    mockLogin.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "Incorrect email",
        }
      }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123"
      });
      expect(toast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "An error occured",
        description: "Incorrect email"
      });
    });
  });
});