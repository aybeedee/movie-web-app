import {
	IsNotEmpty,
	IsString,
	IsEmail,
	IsInt,
	Min,
	Max,
} from "class-validator";

export class SignupData {
	@IsNotEmpty()
	@IsString()
	firstName!: string;

	@IsNotEmpty()
	@IsString()
	lastName!: string;

	@IsNotEmpty()
	@IsEmail()
	email!: string;

	@IsNotEmpty()
	@IsString()
	password!: string;
}

export class LoginData {
	@IsNotEmpty()
	@IsEmail()
	email!: string;

	@IsNotEmpty()
	@IsString()
	password!: string;
}

export class MovieData {
	@IsNotEmpty()
	@IsString()
	title!: string;

	@IsNotEmpty()
	@IsString()
	description!: string;

	@IsNotEmpty()
	@IsInt()
	@Min(1900)
	releaseYear!: number;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	durationHours!: number;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Max(59)
	durationMinutes!: number;
}
