import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../products/services/product.service';
import { Product, ProductDto } from '../../../products/models/product.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-manage-products',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmDialogComponent],
    templateUrl: './manage-products.component.html'
})
export class ManageProductsComponent implements OnInit {
    private productService = inject(ProductService);
    private fb = inject(FormBuilder);

    // Estado
    products = signal<Product[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    // Modal de formulario
    showFormModal = signal(false);
    editingProduct = signal<Product | null>(null);
    formLoading = signal(false);

    // Modal de confirmación
    showDeleteDialog = signal(false);
    productToToggle = signal<Product | null>(null);

    // Formulario reactivo
    productForm: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        description: [''],
        price: [0, [Validators.required, Validators.min(0)]],
        stock: [0, [Validators.required, Validators.min(0)]],
        imageUrl: [''],
        isActive: [true]
    });

    async ngOnInit(): Promise<void> {
        await this.loadProducts();
    }

    async loadProducts(): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            const products = await this.productService.getAllProducts();
            this.products.set(products);
        } catch (err: any) {
            this.error.set(err.userMessage || 'Error al cargar productos');
        } finally {
            this.loading.set(false);
        }
    }

    // Modal de formulario
    openNewProduct(): void {
        this.editingProduct.set(null);
        this.productForm.reset({ isActive: true, price: 0, stock: 0 });
        this.showFormModal.set(true);
    }

    openEditProduct(product: Product): void {
        this.editingProduct.set(product);
        this.productForm.patchValue({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl || '',
            isActive: product.isActive
        });
        this.showFormModal.set(true);
    }

    closeFormModal(): void {
        this.showFormModal.set(false);
        this.editingProduct.set(null);
        this.productForm.reset();
    }

    async onSubmitProduct(): Promise<void> {
        if (this.productForm.invalid) return;

        this.formLoading.set(true);

        try {
            const data: ProductDto = this.productForm.value;

            if (this.editingProduct()) {
                // Actualizar producto existente
                await this.productService.updateProduct(this.editingProduct()!.id, data);
            } else {
                // Crear nuevo producto
                await this.productService.createProduct(data);
            }

            this.closeFormModal();
            await this.loadProducts();
        } catch (err: any) {
            this.error.set(err.userMessage || 'Error al guardar producto');
        } finally {
            this.formLoading.set(false);
        }
    }

    // Activar/Desactivar producto
    openToggleDialog(product: Product): void {
        this.productToToggle.set(product);
        this.showDeleteDialog.set(true);
    }

    async onConfirmToggle(confirmed: boolean): Promise<void> {
        this.showDeleteDialog.set(false);

        if (!confirmed || !this.productToToggle()) return;

        try {
            const product = this.productToToggle()!;
            // Actualizar estado opuesto
            await this.productService.updateProduct(product.id, {
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                imageUrl: product.imageUrl,
                isActive: !product.isActive
            });
            await this.loadProducts();
        } catch (err: any) {
            this.error.set(err.userMessage || 'Error al cambiar estado del producto');
        } finally {
            this.productToToggle.set(null);
        }
    }
}
