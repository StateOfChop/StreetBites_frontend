import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../products/services/product.service';
import { OrderService } from '../../../orders/services/order.service';
import { Order, OrderStatus } from '../../../orders/models/order.model';

interface DashboardStats {
    totalOrdersToday: number;
    pendingOrders: number;
    activeProducts: number;
    totalSalesToday: number;
}

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
    private productService = inject(ProductService);
    private orderService = inject(OrderService);

    // Estado
    stats = signal<DashboardStats>({
        totalOrdersToday: 0,
        pendingOrders: 0,
        activeProducts: 0,
        totalSalesToday: 0
    });
    loading = signal(false);
    error = signal<string | null>(null);

    async ngOnInit(): Promise<void> {
        await this.loadStats();
    }

    async loadStats(): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            // Cargar productos y pedidos
            const [products, orders] = await Promise.all([
                this.productService.getAllProducts(),
                this.orderService.getOrders()
            ]);

            // Calcular estadísticas
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const ordersToday = orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                orderDate.setHours(0, 0, 0, 0);
                return orderDate.getTime() === today.getTime();
            });

            const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING);
            const activeProducts = products.filter(p => p.isActive);

            // Ventas de hoy (solo pedidos no cancelados)
            const salesToday = ordersToday
                .filter(o => o.status !== OrderStatus.CANCELLED)
                .reduce((sum, o) => sum + o.total, 0);

            this.stats.set({
                totalOrdersToday: ordersToday.length,
                pendingOrders: pendingOrders.length,
                activeProducts: activeProducts.length,
                totalSalesToday: salesToday
            });
        } catch (err: any) {
            this.error.set(err.userMessage || 'Error al cargar estadísticas');
        } finally {
            this.loading.set(false);
        }
    }
}
