// Item de un pedido (como viene del backend)
export interface OrderItem {
  id?: string;
  productId: string;
  productName?: string;
  product?: {
    id: string;
    name: string;
    description?: string;
    price: number;
  };
  quantity: number;
  price: number; // Campo del backend (precio histórico al momento de compra)
}

// Item del carrito (antes de crear el pedido)
export interface CartItem {
  productId: string;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
  stock: number; // Stock disponible para validación
}
