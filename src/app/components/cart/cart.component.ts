import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { loadStripe } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';
import { UserRegistration } from 'src/app/Models/ UserRegistration';
import { MailRequestModel } from 'src/app/Models/MailRequest';
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
 timeSubscription: Subscription | undefined;
 cancelTime: string | undefined;
 errorMessage: string | null = null;
constructor(private cartService: CartService, private http: HttpClient, private storeService: StoreService, private userService: UserRegistrationService, private router: Router){}
ngOnInit(){
  this.cartService.cart.subscribe((_cart: CartI)=>{
    this.cart = _cart;
    this.Products = this.cart.items;
    this.dataSource = this.cart.items
    this.calculateCancelUntil();

  })

  this.checkoutSubscription = this.cartService.checkoutTriggered$.subscribe(() => {
    this.onCheckout();
   
  });
}

calculateCancelUntil() {
  let cancelTime = new Date();
  cancelTime.setMinutes(cancelTime.getMinutes() + 15);  // Add 15 minutes to the added time
 const cancelTimeTosting = cancelTime.toLocaleString('en-NL', {
    hour: 'numeric',
    minute: 'numeric',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
});
this.cancelTime = cancelTimeTosting
}





onCheckout(): void {

  const totalAmount = this.getTotal(this.Products);
    if (totalAmount < 100) {
      this.errorMessage = 'Het minimale bestelbedrag is €100.';
      return;
    }
  this.userService.currentUser.subscribe(user => {
    if (!user) return; 
    
    const orderDetails: OrderDetail[] = this.mapDataSourceToOrderDetails(this.dataSource);
    const order: OrderModel = this.createOrderModel(user, orderDetails);
    
    this.cartService.addOrder(order).subscribe({
      next: (result) => {
        const aggregatedQuantities = this.aggregateQuantities(orderDetails);
        this.updateProductStock(orderDetails);
        this.ConfirmationReceive();
        this.router.navigate(['/payment-success']);
      },
      error: (error) => {
        console.error(`Failed to place order`, error);
      }
    });
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


aggregateQuantities(orderDetails: OrderDetail[]): Record<string, number> {
  return orderDetails.reduce((acc: Record<string, number>, detail) => {
    const productId = detail.productId.toString();
    if (acc[productId]) {
      acc[productId] += detail.quantity;
    } else {
      acc[productId] = detail.quantity;
    }
    return acc;
  }, {});
}


updateProductStock(orderDetails: OrderDetail[]): void {
  orderDetails.forEach(detail => {
    const price = detail.price;
    this.storeService.updateProductStock(detail.productId, detail.quantity, detail.price).subscribe({
      next: () => console.log(`Stock updated for product ${detail.productId}`),
      error: (error) => console.error(`Failed to update stock for product ${detail.productId}`, error)
    });
  });
}



private mapDataSourceToOrderDetails(dataSource: ProductAddCart[]): OrderDetail[] {
  return dataSource.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    amountTotal: item.price * item.quantity,
    contents: item.kilo ?? 0,
    price: item.price,
  }));
}

private createOrderModel(user: UserRegistration, orderDetails: OrderDetail[]): OrderModel {
  return {
    UserId: user.nameid,
    orderDetails: orderDetails
  };
}


ConfirmationReceive(): void {
  this.userService.currentUser.subscribe(user => {
    if (!user) {
      return;
    }
  
    this.userService.getUserById(user.nameid).subscribe({
      next: (userData) => {
        const orderItems = this.dataSource.map(item => ({
          ProductName: item.title,
          Quantity: item.quantity,
          Price: item.price,
          Total: item.quantity * item.price,
          ImageUrl: item.imageUrl
        }));
  
        const mailRequest = new MailRequestModel({
          recipientName: `${userData.firstName} ${userData.lastName}`,
          Email: userData.email,
          city: userData.address?.residence,
          adres: userData.address?.street,
          postalCode: userData.address?.zipCode,
          OrderDate: new Date(), 
          OrderNummer: Date.now(), 
          OrderItems: orderItems
        });
  
        this.userService.sendConfirmationEmail(mailRequest).subscribe({
          next: () => {
            console.log('Confirmation email sent successfully.');
          },
          error: (error) => {
            console.error('Failed to send confirmation email.', error);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching user details.', error);
      }
    });
  });


 
}

ngOnDestroy() {
  if (this.checkoutSubscription) {
    this.checkoutSubscription.unsubscribe();
  }
  if (this.timeSubscription) {
    this.timeSubscription.unsubscribe();
  }
}
}



