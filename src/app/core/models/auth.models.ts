export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface AuthResponse {
    token: string;
}

export interface LoginDto {
    email: string;
    password?: string;
}

export interface RegisterDto {
    name: string;
    email: string;
    password?: string;
}
