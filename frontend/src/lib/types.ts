export interface AuthContextType {
	authInfo: AuthInfo;
	isLoggedIn: boolean;
	loadingAuth: boolean;
	saveUser: (authInfo: AuthInfo) => void;
	removeSession: () => void;
}

export interface AuthInfo {
	user: User | null;
	token: string | null;
}

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface SignupPayload {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface Movie {
	id: string;
	title: string;
	description: string;
	releaseYear: number;
	durationHours: number;
	durationMinutes: number;
	reviewCount: number;
	posterUrl: string;
	trailerUrl: string;
}

export interface ReviewPayload {
	movieId: string;
	comment: string;
	rating: number;
}

export interface Review {
	movieId: string;
	comment: string;
	rating: number;
	edited: boolean;
	createdAt: string;
	userId: string;
	firstName: string;
	lastName: string;
	user: User;
}
