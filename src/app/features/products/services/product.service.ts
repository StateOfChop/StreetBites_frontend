import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { Product, ProductDto } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/Products`;

  /**
   * Obtiene productos activos (para usuarios)
   */
  async getProducts(): Promise<Product[]> {
    try {
      return await firstValueFrom(
        this.http.get<Product[]>(this.apiUrl)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene todos los productos incluyendo inactivos (solo ADMIN)
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      return await firstValueFrom(
        this.http.get<Product[]>(`${this.apiUrl}?includeInactive=true`)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene un producto por ID
   */
  async getProduct(id: string): Promise<Product> {
    try {
      return await firstValueFrom(
        this.http.get<Product>(`${this.apiUrl}/${id}`)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crea un nuevo producto (solo ADMIN)
   */
  async createProduct(data: ProductDto): Promise<Product> {
    try {
      return await firstValueFrom(
        this.http.post<Product>(this.apiUrl, data)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza un producto existente (solo ADMIN)
   */
  async updateProduct(id: string, data: ProductDto): Promise<Product> {
    try {
      return await firstValueFrom(
        this.http.put<Product>(`${this.apiUrl}/${id}`, data)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Desactiva/activa un producto (solo ADMIN)
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete<void>(`${this.apiUrl}/${id}`)
      );
    } catch (error) {
      throw error;
    }
  }
}
