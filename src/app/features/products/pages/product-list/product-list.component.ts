import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-list.component.html'
})
export class ProductListComponent {
    authService = inject(AuthService);

    logout(): void {
        this.authService.logout();
    }
}
