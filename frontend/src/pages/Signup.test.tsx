import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Signup from "./Signup";
import { signup } from "@/api/auth";
import { useAuth } from "@/hooks";
import { useToast } from "@/components/ui/use-toast";
import { userData } from "@/fixtures/users";

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

    fireEvent.change(firstNameInput, { target: { value: "Abdullah" } });
    fireEvent.change(lastNameInput, { target: { value: "Umer" } });
    fireEvent.change(emailInput, { target: { value: "abd@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(firstNameInput).toHaveValue("Abdullah");
    expect(lastNameInput).toHaveValue("Umer");
    expect(emailInput).toHaveValue("abd@gmail.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("submits the form successfully", async () => {
    mockSignup.mockResolvedValue({
      error: false,
      message: "Signup successful",
      data: userData,
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

    fireEvent.change(firstNameInput, { target: { value: "Abdullah" } });
    fireEvent.change(lastNameInput, { target: { value: "Umer" } });
    fireEvent.change(emailInput, { target: { value: "abd@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        firstName: "Abdullah",
        lastName: "Umer",
        email: "abd@gmail.com",
        password: "password123"
      });
      expect(saveUser).toHaveBeenCalledWith(userData);
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

    fireEvent.change(firstNameInput, { target: { value: "Abdullah" } });
    fireEvent.change(lastNameInput, { target: { value: "Umer" } });
    fireEvent.change(emailInput, { target: { value: "abd@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        firstName: "Abdullah",
        lastName: "Umer",
        email: "abd@gmail.com",
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