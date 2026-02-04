import { Routes } from '@angular/router';
import { CartComponent } from './pages/cart/cart.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';

export const ORDERS_ROUTES: Routes = [
  { path: 'cart', component: CartComponent },
  { path: '', component: OrderListComponent },
  { path: ':id', component: OrderDetailComponent }
];
