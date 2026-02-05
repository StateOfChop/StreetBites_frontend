import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, catchError, of, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Importación correcta por defecto
import { AuthResponse, LoginDto, RegisterDto, User, UserRole } from '../../../core/models/auth.models';

interface JwtPayload {
  nameid: string; // ID del usuario
  email: string;
  role: string;
  fullName: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private tokenKey = 'streetbites_token';

  // Signals para estado reactivo
  private currentUserSignal = signal<User | null>(null);
  public currentUser = computed(() => this.currentUserSignal());

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromToken();
  }

  // --- Auth Actions ---

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.setToken(response.token))
    );
  }

  register(data: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  // --- Token Management ---

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Simplificado: si hay token, asumimos logueado hasta que falle un request
  }

  isAdmin(): boolean {
    const user = this.currentUserSignal();
    return user?.role === UserRole.ADMIN;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loadUserFromToken();
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);

      // Mapear claims del token (backend usa ClaimTypes standard)
      const user: User = {
        id: decoded.nameid || decoded.sub,
        email: decoded.email,
        role: decoded.role as UserRole,
        name: decoded.fullName
      };

      this.currentUserSignal.set(user);
    } catch (error) {
      console.error('Error decoding token', error);
      this.logout();
    }
  }
}
