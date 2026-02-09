import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
	},
	{
		path: 'products',
		canActivate: [authGuard],
		loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCTS_ROUTES)
	},
	{
		path: 'orders',
		canActivate: [authGuard],
		loadChildren: () => import('./features/orders/orders.routes').then(m => m.ORDERS_ROUTES)
	},
	{
		path: 'admin',
		canActivate: [authGuard],
		loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
	},
	{
		path: '',
		redirectTo: 'auth/login',
		pathMatch: 'full'
	},
	{
		path: '**',
		redirectTo: 'auth/login'
	}
];
