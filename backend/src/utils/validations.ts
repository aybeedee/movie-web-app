import {
	IsNotEmpty,
	IsString,
	IsEmail,
	IsInt,
	Min,
	Max,
	IsUUID,
	IsIn,
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

export class EditMovieData extends MovieData {
	@IsNotEmpty()
	@IsUUID()
	id!: string;
}

export class ReviewData {
	@IsNotEmpty()
	@IsUUID()
	movieId!: string;

	@IsNotEmpty()
	@IsString()
	comment!: string;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Max(5)
	rating!: number;
}

export class MovieIdData {
	@IsNotEmpty()
	@IsUUID()
	movieId!: string;
}

export class MovieTypeData {
	@IsNotEmpty()
	@IsString()
	@IsIn(["featured", "ranked", "new"])
	type!: string;
}

export class MovieQueryData {
	@IsNotEmpty()
	@IsString()
	query!: string;
}
