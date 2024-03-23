import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import {CartI,  ProductAddCart } from 'src/app/Models/product.model';
import { CartService } from 'src/app/service/cart.service';
import { StoreService } from 'src/app/service/store.service';

@Component({
  selector: 'app-cart',
  templateUrl:'./cart.component.html' 
 
})
export class CartComponent {
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
  
constructor(private cartService: CartService, private http: HttpClient, private storeService: StoreService){}
ngOnInit(){
  this.cartService.cart.subscribe((_cart: CartI)=>{
    this.cart = _cart;
    this.Products = this.cart.items;
    this.dataSource = this.cart.items
    console.log("this.dataSource",   this.dataSource)
    this.calculatorShippingCost();
  })

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
  console.log("Quantity", item)
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
  this.http
    .post('https://webshopfilimon.azurewebsites.net/api/Stripe/checkout', {
      items: this.cart.items,
    })
    .subscribe(async (res: any) => {
      let stripe = await loadStripe('pk_live_51NTNZBD7MblCQnUpIt68VrorlFv5MOncjPGTUCt4wyFZKWSXQZpDTIvoWSUQ3JTYzXluSlEZrFMGy79pY1voYivB00oYQHH66M');
      stripe?.redirectToCheckout({
        sessionId: res.id,
      });
    });
   
}

}



