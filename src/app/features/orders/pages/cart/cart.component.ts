import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule, ConfirmDialogComponent],
    templateUrl: './cart.component.html'
})
export class CartComponent {
    private cartService = inject(CartService);
    private orderService = inject(OrderService);
    private router = inject(Router);

    // Estado reactivo del carrito
    items = this.cartService.items;
    total = this.cartService.total;
    hasItems = this.cartService.hasItems.bind(this.cartService);

    // Estados de UI
    loading = signal(false);
    error = signal<string | null>(null);
    showConfirmDialog = signal(false);

    incrementQuantity(productId: string): void {
        const item = this.items().find(i => i.productId === productId);
        if (item && item.quantity < item.stock) {
            this.cartService.updateQuantity(productId, item.quantity + 1);
        }
    }

    decrementQuantity(productId: string): void {
        const item = this.items().find(i => i.productId === productId);
        if (item && item.quantity > 1) {
            this.cartService.updateQuantity(productId, item.quantity - 1);
        }
    }

    removeItem(productId: string): void {
        this.cartService.removeItem(productId);
    }

    openCheckoutConfirm(): void {
        if (this.hasItems()) {
            this.showConfirmDialog.set(true);
        }
    }

    async onConfirmCheckout(confirmed: boolean): Promise<void> {
        this.showConfirmDialog.set(false);

        if (!confirmed) return;

        this.loading.set(true);
        this.error.set(null);

        try {
            // Preparar items para el API
            const orderItems = this.items().map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            // Crear pedido
            await this.orderService.createOrder(orderItems);

            // Limpiar carrito y redirigir
            this.cartService.clearCart();
            this.router.navigate(['/orders']);
        } catch (err: any) {
            this.error.set(err.userMessage || 'Error al crear el pedido');
        } finally {
            this.loading.set(false);
        }
    }
}
