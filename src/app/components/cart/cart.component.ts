import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';
import { UserRegistration } from 'src/app/Models/ UserRegistration';
import { OrderDetail, OrderModel } from 'src/app/Models/Order';
import {CartI,  ProductAddCart } from 'src/app/Models/product.model';
import { CartService } from 'src/app/service/cart.service';
import { StoreService } from 'src/app/service/store.service';
import { UserRegistrationService } from 'src/app/service/user-registration.service';

@Component({
  selector: 'app-cart',
  templateUrl:'./cart.component.html' 
 
})
export class CartComponent{
  phoneNumber = '061790373929';
  shippingCost: number = 7.65;
  cart: CartI = {items:[
  ]
  }
  
  Products : Array<ProductAddCart> = [];
  displayedColumns: string[] = [
    'AFBEELDING',
    'PRODUCT',
    'AANTAL',
    'INHOUD',
    'STUKSPRIJS',
    'TOTAAL',
    'action'
  ];
 
  dataSource: Array<ProductAddCart> = [];
 checkoutSubscription: Subscription | undefined;
constructor(private cartService: CartService, private http: HttpClient, private storeService: StoreService, private userService: UserRegistrationService, private router: Router){}
ngOnInit(){
  this.cartService.cart.subscribe((_cart: CartI)=>{
    this.cart = _cart;
    this.Products = this.cart.items;
    this.dataSource = this.cart.items
    this.calculatorShippingCost();
  })

  this.checkoutSubscription = this.cartService.checkoutTriggered$.subscribe(() => {
    this.onCheckout();
  });

}



getLastProductCategory() {
  if (this.Products && this.Products.length > 0) {
    return this.Products[this.Products.length - 1].categoryName;
  }
  return ''; 
}

getTotalQuantity(items: ProductAddCart[]): number {
  return items.reduce((prev, current) => prev + current.quantity, 0);
}

getTotal(items: ProductAddCart[]): number {
  return this.cartService.getTotal(items);
  
}

calculatorShippingCost() {
  const totalWeight = this.Products.reduce((prev, current) => prev + (current.kilo * current.quantity), 0);
  if (totalWeight <= 10) {
    this.shippingCost = 7.65;
  } else if (totalWeight <= 23) {
    this.shippingCost = 13.90;
  } else if (totalWeight <= 33) {
    this.shippingCost = 21,55;
  } 
 
  else {
    this.shippingCost = 27,80;
  }
  
}


getProducts(){
  this.storeService.setAllProducts(true);
  }

onAddQuantity(item: ProductAddCart): void {
  this.cartService.addToCart(item);
}

onRemoveQuantity(item: ProductAddCart): void {
  this.cartService.removeQuantity(item);
}


onClearCart(): void {
  this.cartService.clearCart();
}

onRemoveFromCart(item: ProductAddCart): void {
  this.cartService.removeFromCart(item);
}


onCheckout(): void {
  this.userService.currentUser.subscribe(user => {
    if (!user) return; // Early exit if user is null or undefined
    
    // dataSource has OrderDetail
    const orderDetails: OrderDetail[] = this.dataSource.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      amountTotal: item.price * item.quantity,
      contents: item.kilo,
      price: item.price
    }));
  
    const order: OrderModel = {
      UserId: user.nameid, // Use the userId from the subscription
      orderDetails: orderDetails
    };
   
    this.cartService.addOrder(order).subscribe({
      next: (result) => {
        // Aggregate quantities for the same productId after the order has been placed
        const aggregatedQuantities = orderDetails.reduce((acc: {[key: string]: number}, detail) => {
          const productId = detail.productId.toString(); // Ensure productId is a string, adjust if necessary
          if (acc[productId]) {
            acc[productId] += detail.quantity;
          } else {
            acc[productId] = detail.quantity;
          }
          return acc;
        }, {});
        
        
        // Now update the stock for each product based on the aggregated quantities
        Object.entries(aggregatedQuantities).forEach(([productId, quantity]) => {
          this.storeService.updateProductStock(productId, quantity).subscribe({
            next: (updateResult) => {
              console.log(`Stock updated for product ${productId}`);
            },
            error: (error) => {
              console.error(`Failed to update stock for product ${productId}`, error);
            }
          });
        });
        
        this.router.navigate(['/payment-success']);
      },
      error: (error) => {
        console.error(`Failed to place order`, error);
      }
    });
  });
}

ngOnDestroy() {
  if (this.checkoutSubscription) {
    this.checkoutSubscription.unsubscribe();
  }
}

}



