import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/Models/product.model';
import { CartService } from 'src/app/service/cart.service';
import { WishlistService } from 'src/app/service/wishlist.service';

@Component({
  selector: 'app-app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class AppProductListComponent {
  @Input() products: Product[] | undefined;
  wishlistProductIds: string[] = [];
  private unsubscribe$ = new Subject<void>();
  Quetity = 1;
  constructor( private router: Router, private cartService: CartService, private wishlistService: WishlistService, private _snackBar: MatSnackBar){

  }
  navigateToProductDetails(productId: string): void {
    this.router.navigate(['product', productId]);
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      categoryName: product.categoryName,
      title: product.title,
      price: product.piecePrice,
      quantity: this.Quetity,
      imageUrl: product.imageUrls[0].file,
      productId: product.productId,
      categoryId: product.categoryId,
      description: product.description,
      sessionId : product.sessionId,
      kilo : 2,
      cartId: "cdc1a936-c8fb-4a25-9a95-304794763b1f"
    });
  }
   

  onRemoveQuantity(){
    if(this.Quetity > 1){
       this.Quetity--;
    }
    else(
      this.Quetity
    )
  }

  onAddQuantity(){
   this.Quetity++;
  }
  
  isInWishlist(productId: string): boolean {
    return this.wishlistProductIds.includes(productId);
  }
  
  onAddToWishlist(productId: string) : void {
    if (!this.isInWishlist(productId)) {
      this.wishlistService.addToWishlist(productId);
      this.wishlistProductIds.push(productId); 
    } else {
      this._snackBar.open('Product is already in the wishlist.', 'Ok', {duration: 3000,});    
    }
  }
  fetchWishlistProductIds(): void {
    this.wishlistService.getWishlistProducts().pipe(takeUntil(this.unsubscribe$))
        .subscribe(products => {
            this.wishlistProductIds = products.map(product => product.productId);
        });
  }

}
