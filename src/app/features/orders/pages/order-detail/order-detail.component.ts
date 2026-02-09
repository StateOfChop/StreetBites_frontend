import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ConfirmDialogComponent],
    templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent implements OnInit {
    private orderService = inject(OrderService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    // Estado
    order = signal<Order | null>(null);
    loading = signal(false);
    error = signal<string | null>(null);

    // Dialog de cancelación
    showCancelDialog = signal(false);

    // Exponer enum para el template
    OrderStatus = OrderStatus;

    async ngOnInit(): Promise<void> {
        const orderId = this.route.snapshot.paramMap.get('id');
        if (orderId) {
            await this.loadOrder(orderId);
        }
    }

    async loadOrder(id: string): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            const order = await this.orderService.getOrder(id);
            this.order.set(order);
        } catch (err: any) {
            this.error.set(err.userMessage || 'Error al cargar pedido');
        } finally {
            this.loading.set(false);
        }
    }

    openCancelDialog(): void {
        this.showCancelDialog.set(true);
    }

    async onConfirmCancel(confirmed: boolean): Promise<void> {
        this.showCancelDialog.set(false);

        if (!confirmed || !this.order()) return;

        try {
            await this.orderService.cancelOrder(this.order()!.id);
            this.router.navigate(['/orders']);
        } catch (err: any) {
            this.error.set(err.userMessage || 'Error al cancelar pedido');
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
