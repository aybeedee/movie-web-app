export interface AuthContextType {
	auth: AuthInfo;
	setAuth: React.Dispatch<React.SetStateAction<AuthInfo>>;
	isVerified: () => Promise<boolean>;
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

export interface SignupData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface LoginData {
	email: string;
	password: string;
}
