import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/order-item.model';
import { Product } from '../../products/models/product.model';

const CART_KEY = 'streetbites_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  // Signal para estado reactivo del carrito
  private itemsSignal = signal<CartItem[]>(this.loadFromStorage());

  // Computed para acceso público y total
  public items = computed(() => this.itemsSignal());
  public itemCount = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );
  public total = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  );

  /**
   * Agrega un producto al carrito o incrementa cantidad si ya existe
   */
  addItem(product: Product, quantity: number): void {
    if (quantity <= 0) return;

    const items = [...this.itemsSignal()];
    const existingIndex = items.findIndex(item => item.productId === product.id);

    if (existingIndex >= 0) {
      // Validar que no exceda stock
      const newQty = items[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        items[existingIndex].quantity = product.stock;
      } else {
        items[existingIndex].quantity = newQty;
      }
    } else {
      // Agregar nuevo item
      const cartItem: CartItem = {
        productId: product.id,
        productName: product.name,
        productImageUrl: product.imageUrl,
        quantity: Math.min(quantity, product.stock),
        unitPrice: product.price,
        stock: product.stock
      };
      items.push(cartItem);
    }

    this.updateItems(items);
  }

  /**
   * Elimina un producto del carrito
   */
  removeItem(productId: string): void {
    const items = this.itemsSignal().filter(item => item.productId !== productId);
    this.updateItems(items);
  }

  /**
   * Actualiza la cantidad de un producto
   */
  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const items = this.itemsSignal().map(item => {
      if (item.productId === productId) {
        // Validar stock máximo
        const validQty = Math.min(quantity, item.stock);
        return { ...item, quantity: validQty };
      }
      return item;
    });

    this.updateItems(items);
  }

  /**
   * Obtiene todos los items del carrito
   */
  getItems(): CartItem[] {
    return this.itemsSignal();
  }

  /**
   * Obtiene el total del carrito
   */
  getTotal(): number {
    return this.total();
  }

  /**
   * Limpia el carrito completamente
   */
  clearCart(): void {
    this.updateItems([]);
  }

  /**
   * Verifica si el carrito tiene items
   */
  hasItems(): boolean {
    return this.itemsSignal().length > 0;
  }

  // --- Métodos privados ---

  private updateItems(items: CartItem[]): void {
    this.itemsSignal.set(items);
    this.saveToStorage(items);
  }

  private loadFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // Silently fail if localStorage is not available
    }
  }
}
