import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Signup from "./Signup";
import { signup } from "@/api/auth";
import { useAuth } from "@/hooks";
import { useToast } from "@/components/ui/use-toast";

jest.mock("@/api/auth");
jest.mock("@/hooks");
jest.mock("@/components/ui/use-toast");

const mockSignup = signup as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockUseToast = useToast as jest.Mock;

describe("Signup Component", () => {
  const saveUser = jest.fn();
  const toast = jest.fn();

  beforeEach(() => {
    mockUseAuth.mockReturnValue({ saveUser });
    mockUseToast.mockReturnValue({ toast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the signup form", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Account/i })).toBeInTheDocument();
  });

  test("handles input change", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(firstNameInput).toHaveValue("John");
    expect(lastNameInput).toHaveValue("Doe");
    expect(emailInput).toHaveValue("john.doe@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("submits the form successfully", async () => {
    mockSignup.mockResolvedValue({
      error: false,
      message: "Signup successful",
      data: {
        user: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
        token: "eyJhbGciOiJIUzI1NiJ9eyJpZCI6MX0JAWUkAU2mWhxcd6MS8r9pd44yBIfkEBmpr3WLeqIccM",
      },
    });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123"
      });
      expect(saveUser).toHaveBeenCalledWith({
        user: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
        token: "eyJhbGciOiJIUzI1NiJ9eyJpZCI6MX0JAWUkAU2mWhxcd6MS8r9pd44yBIfkEBmpr3WLeqIccM",
      });
      expect(toast).toHaveBeenCalledWith({
        variant: "default",
        title: "Success",
        description: "Signup successful"
      });
    });
  });

  test("handles form submission failure", async () => {
    mockSignup.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "An account is already registered with this email",
        }
      }
    });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123"
      });
      expect(toast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "An error occured",
        description: "An account is already registered with this email"
      });
    });
  });
});