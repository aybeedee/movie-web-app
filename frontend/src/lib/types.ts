export interface AuthContextType {
	auth: AuthInfo;
	setAuth: React.Dispatch<React.SetStateAction<AuthInfo>>;
}

export interface AuthInfo {
	user: User;
	token: string | null;
}

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}
