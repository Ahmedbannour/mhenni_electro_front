import { Routes } from '@angular/router';
import { roleGuard } from './guards/role-guard';
import { Home } from './layouts/client-layout/home/home';
import { Contact } from './layouts/client-layout/contact/contact';
import { LoginComponent } from './layouts/client-layout/login-component/login-component';
import { RegisterComponent } from './layouts/client-layout/register-component/register-component';
import { ProductsComponent } from './layouts/client-layout/products-component/products-component';
import { ProductDetails } from './layouts/client-layout/products-component/product-details/product-details';
import { PanierComponents } from './layouts/client-layout/panier-components/panier-components';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { ClientLayout } from './layouts/client-layout/client-layout';
import { AdminHome } from './layouts/admin-layout/components/admin-home/admin-home';
import { ClientsWidget } from './layouts/admin-layout/components/clients-widget/clients-widget';
import { DepotWidget } from './layouts/admin-layout/components/depot-widget/depot-widget';
import { ProductsAdminWidget } from './layouts/admin-layout/components/products-admin-widget/products-admin-widget';
import { GarantiesWidget } from './layouts/admin-layout/components/garanties-widget/garanties-widget';
import { AssurancesWidget } from './layouts/admin-layout/components/assurances-widget/assurances-widget';
import { EvenementsWidget } from './layouts/admin-layout/components/evenements-widget/evenements-widget';
import { DonsWidget } from './layouts/admin-layout/components/dons-widget/dons-widget';

export const routes: Routes = [
  // GROUPE CLIENT : Toutes ces routes utiliseront le ClientLayout (avec Navbar/Footer)
  {
    path: '',
    component: ClientLayout,
    children: [
      { path: 'home', component: Home },
      { path: 'contact', component: Contact },
      { path: 'products', component: ProductsComponent },
      { path: 'products/:id', component: ProductDetails },
      { path: 'panier', component: PanierComponents },
      { path: 'category/:id', component: ProductsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]
  },

  // GROUPE AUTH : Pages sans Navbar (souvent plein écran)


  // GROUPE ADMIN : Utilise uniquement l'AdminLayout
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' },
    children: [
      { path: 'clients', component: ClientsWidget },
      { path: 'depots', component: DepotWidget },
      { path: 'products', component: ProductsAdminWidget },
      { path: 'garanties', component: GarantiesWidget },
      { path: 'assurances', component: AssurancesWidget },
      { path: 'evenements', component: EvenementsWidget },
      { path: 'dons', component: DonsWidget },
      { path: 'home', component: AdminHome },
      { path: '', redirectTo: 'home', pathMatch: 'full' },


    ]
  },

];
