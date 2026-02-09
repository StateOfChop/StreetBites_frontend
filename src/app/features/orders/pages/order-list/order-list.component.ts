import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [CommonModule, RouterModule, ConfirmDialogComponent],
    templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
    private orderService = inject(OrderService);

    // Estado
    orders = signal<Order[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    // Para diálogo de cancelación
    showCancelDialog = signal(false);
    orderToCancel = signal<string | null>(null);

    // Exponer enum para el template
    OrderStatus = OrderStatus;

    async ngOnInit(): Promise<void> {
        await this.loadOrders();
    }

    async loadOrders(): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            const orders = await this.orderService.getOrders();
            this.orders.set(orders);
        } catch (err: any) {
            this.error.set(err.userMessage || 'Error al cargar pedidos');
        } finally {
            this.loading.set(false);
        }
    }

    openCancelDialog(orderId: string): void {
        this.orderToCancel.set(orderId);
        this.showCancelDialog.set(true);
    }

    async onConfirmCancel(confirmed: boolean): Promise<void> {
        this.showCancelDialog.set(false);

        if (!confirmed || !this.orderToCancel()) return;

        try {
            await this.orderService.cancelOrder(this.orderToCancel()!);
            await this.loadOrders(); // Recargar lista
        } catch (err: any) {
            this.error.set(err.userMessage || 'Error al cancelar pedido');
        } finally {
            this.orderToCancel.set(null);
        }
    }

    getStatusClass(status: OrderStatus): string {
        switch (status) {
            case OrderStatus.PENDING:
                return 'bg-yellow-100 text-yellow-800';
            case OrderStatus.PREPARING:
                return 'bg-blue-100 text-blue-800';
            case OrderStatus.DELIVERED:
                return 'bg-green-100 text-green-800';
            case OrderStatus.CANCELLED:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    getStatusLabel(status: OrderStatus): string {
        switch (status) {
            case OrderStatus.PENDING:
                return 'Pendiente';
            case OrderStatus.PREPARING:
                return 'En preparación';
            case OrderStatus.DELIVERED:
                return 'Entregado';
            case OrderStatus.CANCELLED:
                return 'Cancelado';
            default:
                return status;
        }
    }
}
