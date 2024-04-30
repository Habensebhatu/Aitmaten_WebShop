import { NgModule, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { DatailProductComponent } from './components/datail-product/datail-product.component';
import { StoreService } from './service/store.service';
import { CartService } from './service/cart.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageComponent } from './components/homepage/homepage.component';
import { register } from 'swiper/element/bundle';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ShopComponent } from './components/product-display-components/shop/shop.component';
import { BreadcrumbComponent } from './components/product-display-components/breadcrumb/breadcrumb.component';
import { AppViewToggleComponent } from './components/product-display-components/app-view-toggle/app-view-toggle.component';
import { AppProductGridComponent } from './components/product-display-components/app-product-grid/app-product-grid.component';
import { AppProductListComponent } from './components/product-display-components/app-product-list/app-product-list.component';
import { PaginationComponent } from './components/product-display-components/pagination/pagination.component';
import { TopBarComponent } from './components/headers/top-bar/top-bar.component';
import { HeaderAreaComponent } from './components/headers/header-area/header-area.component';
import { HeaderComponent } from './components/headers/header/header.component';
import { ProductsSliderComponent } from './components/product-display-components/products-slider/products-slider.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
// Import the Dutch locale

import localeNl from '@angular/common/locales/nl';
import { registerLocaleData } from '@angular/common';

// Register the Dutch locale
registerLocaleData(localeNl);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
register();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DatailProductComponent,
    HomepageComponent,
    RegisterComponent,
    LoginComponent,
    CartComponent,
    ContactUsComponent,
    AboutUsComponent,
    ShopComponent,
    BreadcrumbComponent,
    AppViewToggleComponent,
    AppProductGridComponent,
    AppProductListComponent,
    PaginationComponent,
    TopBarComponent,
    HeaderAreaComponent,
    ProductsSliderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatBadgeModule,
    MatTableModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
   
  providers: [CartService, StoreService, { provide: LOCALE_ID, useValue: 'nl-NL' }],
  bootstrap: [AppComponent]
})
export class AppModule { }






