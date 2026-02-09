import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../features/orders/services/cart.service';
import { UserRole } from '../../../core/models/auth.models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  // Usuario actual (signal reactivo)
  currentUser = this.authService.currentUser;

  // Cantidad de items en el carrito
  cartItemCount = this.cartService.itemCount;

  // Computed para verificar rol - basado en el signal de currentUser
  isAdmin = computed(() => this.currentUser()?.role === UserRole.ADMIN);

  // Reactivo: se actualiza cuando currentUser cambia
  isLoggedIn = computed(() => !!this.currentUser());

  logout(): void {
    this.authService.logout();
  }
}
