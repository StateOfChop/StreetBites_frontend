// Modelo de Producto
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// DTO para crear/actualizar producto
export interface ProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive?: boolean;
}
