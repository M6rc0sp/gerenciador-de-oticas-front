export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
