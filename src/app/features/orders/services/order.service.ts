import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Order, CreateOrderDto, UpdateOrderStatusDto, OrderStatus } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/Orders`;

  /**
   * Obtiene pedidos del usuario actual (USER) o todos (ADMIN)
   */
  async getOrders(): Promise<Order[]> {
    try {
      return await firstValueFrom(
        this.http.get<Order[]>(this.apiUrl)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene el detalle de un pedido por ID
   */
  async getOrder(id: string): Promise<Order> {
    try {
      return await firstValueFrom(
        this.http.get<Order>(`${this.apiUrl}/${id}`)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crea un nuevo pedido con los items del carrito
   */
  async createOrder(items: { productId: string; quantity: number }[]): Promise<Order> {
    try {
      const dto: CreateOrderDto = { items };
      return await firstValueFrom(
        this.http.post<Order>(this.apiUrl, dto)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza el estado de un pedido (solo ADMIN)
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      const dto: UpdateOrderStatusDto = { status };
      return await firstValueFrom(
        this.http.put<Order>(`${this.apiUrl}/${id}/status`, dto)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancela un pedido (solo si está en PENDING)
   */
  async cancelOrder(id: string): Promise<Order> {
    try {
      return await firstValueFrom(
        this.http.put<Order>(`${this.apiUrl}/${id}/cancel`, {})
      );
    } catch (error) {
      throw error;
    }
  }
}
