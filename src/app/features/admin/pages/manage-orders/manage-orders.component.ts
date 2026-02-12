import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../orders/services/order.service';
import { Order, OrderStatus } from '../../../orders/models/order.model';

@Component({
    selector: 'app-manage-orders',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './manage-orders.component.html'
})
export class ManageOrdersComponent implements OnInit {
    private orderService = inject(OrderService);

    // Estado
    orders = signal<Order[]>([]);
    filteredOrders = signal<Order[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    // Filtro
    statusFilter = signal<string>('ALL');

    // Detalle y cambio de estado
    selectedOrder = signal<Order | null>(null);
    newStatus = signal<OrderStatus | null>(null);
    updatingStatus = signal(false);

    // Exponer enum para el template
    OrderStatus = OrderStatus;
    statusOptions = Object.values(OrderStatus);

    async ngOnInit(): Promise<void> {
        await this.loadOrders();
    }

    async loadOrders(): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            const orders = await this.orderService.getOrders();
            this.orders.set(orders);
            this.applyFilter();
        } catch (err: any) {
            this.error.set(err.userMessage || 'Error al cargar pedidos');
        } finally {
            this.loading.set(false);
        }
    }

    onFilterChange(status: string): void {
        this.statusFilter.set(status);
        this.applyFilter();
    }

    private applyFilter(): void {
        const filter = this.statusFilter();
        if (filter === 'ALL') {
            this.filteredOrders.set(this.orders());
        } else {
            this.filteredOrders.set(
                this.orders().filter(o => o.status === filter)
            );
        }
    }

    openOrderDetail(order: Order): void {
        this.selectedOrder.set(order);
        this.newStatus.set(order.status);
    }

    closeOrderDetail(): void {
        this.selectedOrder.set(null);
        this.newStatus.set(null);
    }

    async updateOrderStatus(): Promise<void> {
        if (!this.selectedOrder() || !this.newStatus()) return;
        if (this.newStatus() === this.selectedOrder()!.status) return;

        this.updatingStatus.set(true);

        try {
            await this.orderService.updateOrderStatus(
                this.selectedOrder()!.id,
                this.newStatus()!
            );
            this.closeOrderDetail();
            await this.loadOrders();
        } catch (err: any) {
            this.error.set(err.userMessage || 'Error al actualizar estado');
        } finally {
            this.updatingStatus.set(false);
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
