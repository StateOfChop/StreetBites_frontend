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
