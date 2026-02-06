import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <!-- Decorative elements -->
      <div class="paint-splatter splatter-1"></div>
      <div class="paint-splatter splatter-2"></div>
      <div class="paint-splatter splatter-3"></div>
      
      <div class="auth-card">
        <!-- Logo -->
        <div class="logo-container">
          <img src="assets/images/Street_Bites_Logo.png" alt="Street Bites" class="logo" />
        </div>
        
        <h1 class="auth-title">¡Bienvenido!</h1>
        <p class="auth-subtitle">Inicia sesión para ordenar</p>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="input-group">
            <label for="email">Correo</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="tu@correo.com"
              class="street-input"
            />
          </div>
          
          <div class="input-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••"
              class="street-input"
            />
          </div>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="street-btn"
          >
            <span *ngIf="isLoading">Cargando...</span>
            <span *ngIf="!isLoading">🍔 Entrar</span>
          </button>
        </form>
        
        <p class="auth-link">
          ¿No tienes cuenta? 
          <a routerLink="/auth/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
      position: relative;
      overflow: hidden;
      padding: 20px;
    }

    /* Paint splatter decorations */
    .paint-splatter {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.4;
    }

    .splatter-1 {
      width: 300px;
      height: 300px;
      background: #7fff00;
      top: -100px;
      left: -100px;
    }

    .splatter-2 {
      width: 200px;
      height: 200px;
      background: #ff6b35;
      bottom: -50px;
      right: -50px;
    }

    .splatter-3 {
      width: 150px;
      height: 150px;
      background: #ff6b35;
      top: 50%;
      right: 10%;
    }

    .auth-card {
      background: rgba(26, 26, 46, 0.95);
      border: 2px solid #7fff00;
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 
        0 0 30px rgba(127, 255, 0, 0.2),
        0 25px 50px rgba(0, 0, 0, 0.5);
      position: relative;
      z-index: 1;
    }

    .logo-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
    }

    .logo {
      width: 150px;
      height: auto;
      display: block;
      margin: 0 auto;
      filter: drop-shadow(0 0 20px rgba(127, 255, 0, 0.5));
    }

    .auth-title {
      font-family: 'Permanent Marker', cursive, sans-serif;
      font-size: 2.5rem;
      color: #7fff00;
      text-align: center;
      margin: 0;
      text-shadow: 2px 2px 0 #ff6b35, 4px 4px 0 rgba(0,0,0,0.3);
    }

    .auth-subtitle {
      color: #a0a0a0;
      text-align: center;
      margin: 10px 0 30px;
      font-size: 1rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .input-group label {
      color: #7fff00;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .street-input {
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid #333;
      border-radius: 10px;
      padding: 15px;
      color: #fff;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .street-input:focus {
      outline: none;
      border-color: #7fff00;
      box-shadow: 0 0 15px rgba(127, 255, 0, 0.3);
    }

    .street-input::placeholder {
      color: #666;
    }

    .error-message {
      background: rgba(255, 107, 53, 0.2);
      border: 1px solid #ff6b35;
      border-radius: 8px;
      padding: 12px;
      color: #ff6b35;
      text-align: center;
      font-size: 0.9rem;
    }

    .street-btn {
      background: linear-gradient(135deg, #7fff00 0%, #32cd32 100%);
      border: none;
      border-radius: 10px;
      padding: 15px 30px;
      color: #000;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 10px;
    }

    .street-btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(127, 255, 0, 0.4);
    }

    .street-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .auth-link {
      text-align: center;
      margin-top: 25px;
      color: #a0a0a0;
    }

    .auth-link a {
      color: #ff6b35;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s;
    }

    .auth-link a:hover {
      color: #7fff00;
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 30px 20px;
      }
      
      .auth-title {
        font-size: 2rem;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al iniciar sesión';
      }
    });
  }
}
