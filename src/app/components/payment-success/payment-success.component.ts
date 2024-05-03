import { Component } from '@angular/core';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
})
export class PaymentSuccessComponent {

constructor(private cartService: CartService,){

}

ngOnInit(){
  this.cartService.clearCart();
}

}
