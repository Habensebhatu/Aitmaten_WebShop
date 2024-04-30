import { NgModule } from '@angular/core';

import { CartComponent } from "./components/cart/cart.component";
import { DatailProductComponent } from "./components/datail-product/datail-product.component";
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ShopComponent } from './components/product-display-components/shop/shop.component';

const routes: Routes = [
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "product/:productId",
    component:  DatailProductComponent,
  },
  {
    path: "home",
    component: HomepageComponent,
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
  

  { path: 'Register', component:  RegisterComponent},
  { path: 'login', component:   LoginComponent},
  { path: 'contactUs', component:   ContactUsComponent},
  { path: 'aboutUs', component:    AboutUsComponent},
  { path:  "shop/:name",component:   ShopComponent},
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
