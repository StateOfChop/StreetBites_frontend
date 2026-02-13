import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../orders/services/cart.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
    private productService = inject(ProductService);
    private cartService = inject(CartService);

    // Estado
    products = signal<Product[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    // Mapa para cantidades por producto
    quantities: { [key: string]: number } = {};

    async ngOnInit(): Promise<void> {
        await this.loadProducts();
    }

    async loadProducts(): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            const products = await this.productService.getProducts();
            this.products.set(products);

            // Inicializar cantidades en 1
            products.forEach(p => {
                this.quantities[p.id] = 1;
            });
        } catch (err: any) {
            this.error.set(err.userMessage || 'Error al cargar productos');
        } finally {
            this.loading.set(false);
        }
    }

    addToCart(product: Product): void {
        const quantity = this.quantities[product.id] || 1;

        if (quantity > 0 && quantity <= product.stock) {
            this.cartService.addItem(product, quantity);
            // Reset cantidad a 1 después de agregar
            this.quantities[product.id] = 1;
        }
    }

    isValidQuantity(product: Product): boolean {
        const qty = this.quantities[product.id] || 0;
        return qty > 0 && qty <= product.stock;
    }
}
