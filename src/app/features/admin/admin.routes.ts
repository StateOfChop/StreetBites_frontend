import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard.component';
import { ManageProductsComponent } from './pages/manage-products/manage-products.component';
import { ManageOrdersComponent } from './pages/manage-orders/manage-orders.component';
import { adminGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    component: AdminDashboardComponent
  },
  {
    path: 'products',
    canActivate: [adminGuard],
    component: ManageProductsComponent
  },
  {
    path: 'orders',
    canActivate: [adminGuard],
    component: ManageOrdersComponent
  }
];
