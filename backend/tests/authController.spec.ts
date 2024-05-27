import { Request, Response } from "express";
import { AuthController } from "../src/controllers/auth.controller";
import { AuthService } from "../src/services/auth.service";
import { validate } from "class-validator";

jest.mock("class-validator");
jest.mock("../src/services/auth.service");

describe("AuthController", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;

	beforeEach(() => {
		req = {
			body: {},
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis(),
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("signUp", () => {
		it("should return 400 if input is invalid", async () => {
			(validate as jest.Mock).mockResolvedValue([
				{
					property: "email",
					constraints: { isEmail: "email must be an email" },
				},
			]);

			req.body = {
				firstName: "John",
				lastName: "Doe",
				email: "invalidemail",
				password: "password",
			};

			await AuthController.signUp(req as Request, res as Response);

			expect(validate).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					error: true,
					message: "Invalid input",
				})
			);
		});

		it("should return 400 if user already exists", async () => {
			(validate as jest.Mock).mockResolvedValue([]);
			(AuthService.getUserByEmail as jest.Mock).mockResolvedValue({
				id: 1,
				email: "test@example.com",
			});

			req.body = {
				firstName: "John",
				lastName: "Doe",
				email: "test@example.com",
				password: "password",
			};

			await AuthController.signUp(req as Request, res as Response);

			expect(AuthService.getUserByEmail).toHaveBeenCalledWith(
				"test@example.com"
			);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					error: true,
					message: "An account is already registered with this email",
				})
			);
		});

		it("should return 201 and user data if signup is successful", async () => {
			(validate as jest.Mock).mockResolvedValue([]);
			(AuthService.getUserByEmail as jest.Mock).mockResolvedValue(null);
			(AuthService.createUser as jest.Mock).mockResolvedValue({
				id: 1,
				firstName: "John",
				lastName: "Doe",
				email: "test@example.com",
			});
			(AuthService.getToken as jest.Mock).mockReturnValue("jwt-token");

			req.body = {
				firstName: "John",
				lastName: "Doe",
				email: "test@example.com",
				password: "password",
			};

			await AuthController.signUp(req as Request, res as Response);

			expect(AuthService.createUser).toHaveBeenCalled();
			expect(AuthService.getToken).toHaveBeenCalledWith(1);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					error: false,
					message: "Signup successful",
				})
			);
		});
	});

	describe("login", () => {
		it("should return 400 if input is invalid", async () => {
			(validate as jest.Mock).mockResolvedValue([
				{
					property: "email",
					constraints: { isEmail: "email must be an email" },
				},
			]);

			req.body = {
				email: "invalidemail",
				password: "password",
			};

			await AuthController.login(req as Request, res as Response);

			expect(validate).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					error: true,
					message: "Invalid input",
				})
			);
		});

		it("should return 400 if user is not found", async () => {
			(validate as jest.Mock).mockResolvedValue([]);
			(AuthService.getUserByEmail as jest.Mock).mockResolvedValue(null);

			req.body = {
				email: "test@example.com",
				password: "password",
			};

			await AuthController.login(req as Request, res as Response);

			expect(AuthService.getUserByEmail).toHaveBeenCalledWith(
				"test@example.com",
				true
			);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					error: true,
					message: "Incorrect email",
				})
			);
		});

		it("should return 400 if password is incorrect", async () => {
			(validate as jest.Mock).mockResolvedValue([]);
			(AuthService.getUserByEmail as jest.Mock).mockResolvedValue({
				id: 1,
				email: "test@example.com",
				password: "hashedpassword",
			});
			(AuthService.verifyPassword as jest.Mock).mockResolvedValue(false);

			req.body = {
				email: "test@example.com",
				password: "wrongpassword",
			};

			await AuthController.login(req as Request, res as Response);

			expect(AuthService.verifyPassword).toHaveBeenCalledWith(
				"wrongpassword",
				"hashedpassword"
			);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					error: true,
					message: "Incorrect password",
				})
			);
		});

		it("should return 200 and user data if login is successful", async () => {
			(validate as jest.Mock).mockResolvedValue([]);
			(AuthService.getUserByEmail as jest.Mock).mockResolvedValue({
				id: 1,
				email: "test@example.com",
				password: "hashedpassword",
			});
			(AuthService.verifyPassword as jest.Mock).mockResolvedValue(true);
			(AuthService.getToken as jest.Mock).mockReturnValue("jwt-token");

			req.body = {
				email: "test@example.com",
				password: "password",
			};

			await AuthController.login(req as Request, res as Response);

			expect(AuthService.getToken).toHaveBeenCalledWith(1);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					error: false,
					message: "Login in successful",
				})
			);
		});
	});

	describe("getUser", () => {
		it("should return 200 and user data if user is found", async () => {
			(AuthService.getUserById as jest.Mock).mockResolvedValue({
				id: 1,
				firstName: "John",
				lastName: "Doe",
				email: "test@example.com",
			});

			req.body = {
				userId: 1,
			};

			await AuthController.getUser(req as Request, res as Response);

			expect(AuthService.getUserById).toHaveBeenCalledWith(1);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					error: false,
					message: "User found successfully",
				})
			);
		});

		it("should return 400 if user is not found", async () => {
			(AuthService.getUserById as jest.Mock).mockResolvedValue(null);

			req.body = {
				userId: 1,
			};

			await AuthController.getUser(req as Request, res as Response);

			expect(AuthService.getUserById).toHaveBeenCalledWith(1);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					error: true,
					message: "No user found",
				})
			);
		});
	});
});
