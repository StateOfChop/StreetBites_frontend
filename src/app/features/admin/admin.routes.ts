import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard.component';
import { ManageProductsComponent } from './pages/manage-products/manage-products.component';
import { ManageOrdersComponent } from './pages/manage-orders/manage-orders.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'products', component: ManageProductsComponent },
  { path: 'orders', component: ManageOrdersComponent }
];
