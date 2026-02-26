import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Contact } from './contact/contact';
import { LoginComponent } from './login-component/login-component';
import { RegisterComponent } from './register-component/register-component';
import { ProductsComponent } from './products-component/products-component';
import { ProductDetails } from './products-component/product-details/product-details';
import { PanierComponents } from './panier-components/panier-components';
import { roleGuard } from './guards/role-guard';
import { AdminDashboardComponent } from './admin-dashboard-component/admin-dashboard-component';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'contact', component: Contact },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetails },
  { path: 'panier', component: PanierComponents },
  { path: 'category/:id', component: ProductsComponent }, // Par catégorie
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Dashboard ADMIN
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },

  // Dashboard CLIENT
  {
    path: 'client-dashboard',
    component: Home,
    canActivate: [roleGuard],
    data: { role: 'ROLE_USER' }
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
