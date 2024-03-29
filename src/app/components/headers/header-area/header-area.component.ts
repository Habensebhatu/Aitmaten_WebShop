import { Component, Input } from '@angular/core';
import { UserRegistration } from 'src/app/Models/ UserRegistration';
import { CartI, ProductAddCart } from 'src/app/Models/product.model';
import { CartService } from 'src/app/service/cart.service';
import { UserRegistrationService } from 'src/app/service/user-registration.service';
import { WishlistService } from 'src/app/service/wishlist.service';

@Component({
  selector: 'app-header-area',
  templateUrl: './header-area.component.html'
})
export class HeaderAreaComponent {
  @Input() itemsQuantity: number = 0;
  @Input() cart: any;
  log = 'logeaitmaten.png';
  currentUser: UserRegistration | null = null;
  wishlistQuantity = 0; 
  private _cart: CartI = { items: [] };
  showAccountMenu = false;
  
  constructor(public userService: UserRegistrationService, private cartService: CartService, private wishlistService: WishlistService) {}
 

  toggleAccountMenu() {
     this.showAccountMenu = !this.showAccountMenu;
  }
  ngOnInit(): void{
    this.wishlistCount();
    this.userService.currentUser.subscribe(user => this.currentUser = user);
  }
  
  onClearCart(): void {
    this.cartService.clearCart();
  }

  getTotal(items: ProductAddCart[]): number {
    return this.cartService.getTotal(items);
  }
  
  wishlistCount(){
    this.wishlistService.wishlistCount$.subscribe(
      count => this.wishlistQuantity = count
    );
  }

}
