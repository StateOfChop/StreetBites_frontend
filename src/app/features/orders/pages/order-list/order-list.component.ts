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
                return 'bg-[rgba(255,200,0,0.15)] text-yellow-400 border border-yellow-500';
            case OrderStatus.PREPARING:
                return 'bg-[rgba(100,149,237,0.15)] text-blue-400 border border-blue-500';
            case OrderStatus.DELIVERED:
                return 'bg-[rgba(127,255,0,0.15)] text-[#7fff00] border border-[#7fff00]';
            case OrderStatus.CANCELLED:
                return 'bg-[rgba(255,107,53,0.15)] text-[#ff6b35] border border-[#ff6b35]';
            default:
                return 'bg-[rgba(255,255,255,0.05)] text-gray-400 border border-gray-600';
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
