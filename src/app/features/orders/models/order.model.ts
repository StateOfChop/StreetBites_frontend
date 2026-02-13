import { OrderItem } from './order-item.model';

// Estados posibles del pedido
export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// Modelo de Pedido
export interface Order {
  id: string;
  userId?: string;
  userEmail?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

// DTO para crear pedido
export interface CreateOrderDto {
  items: { productId: string; quantity: number }[];
}

// DTO para actualizar estado
export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
