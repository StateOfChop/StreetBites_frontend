import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { PRODUCTS_ROUTES } from './features/products/products.routes';
import { ORDERS_ROUTES } from './features/orders/orders.routes';
import { ADMIN_ROUTES } from './features/admin/admin.routes';

export const routes: Routes = [
	{ path: '', children: PRODUCTS_ROUTES },
	{ path: 'auth', children: AUTH_ROUTES },
	{ path: 'orders', children: ORDERS_ROUTES },
	{ path: 'admin', children: ADMIN_ROUTES }
];
