import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/Models/product.model';
import { CartService } from 'src/app/service/cart.service';
import { WishlistService } from 'src/app/service/wishlist.service';

@Component({
  selector: 'app-app-product-grid',
  templateUrl: './app-product-grid.component.html',
  styleUrls: ['./app-product-grid.component.css']
})
export class AppProductGridComponent {
  
  @Input() products: Product[] | undefined;
  wishlistProductIds: string[] = [];
  private unsubscribe$ = new Subject<void>();
  Quetity = 1;
  pieceQuantity = 1;
  crateQuantity = 1;
  private checkoutTimeout: any;
  constructor( private router: Router, private cartService: CartService, private wishlistService: WishlistService, private _snackBar: MatSnackBar){

  }
  navigateToProductDetails(productId: string): void {
    this.router.navigate(['product', productId]);
  }


   
  quantities = new Map<string, { piece: number, crate: number, message: boolean }>();
onAddQuantity(productId: string, itemType: string, instock: number, contents: number) {
  let quantity = this.quantities.get(productId) || { piece: 0, crate: 1, message: false };
  if(itemType === 'piece' && quantity.crate < 2){
    contents = 0
  }
  const totalAdded = (quantity.piece * 1) + (quantity.crate * contents);
  console.log(" totalAdded totalAdded",  totalAdded)
  if (itemType === 'piece') {
    if ((totalAdded + 1) <= instock) {
      quantity.piece++;
      quantity.message = false;
    } else {
      quantity.message = true; 
    }
  } else if (itemType === 'crate') {
    if ((totalAdded + contents) <= instock) {
      quantity.crate++;
      quantity.message = false;
    } else {
      quantity.message = true; 
    }
  }
  this.quantities.set(productId, quantity);
}


  onRemoveQuantity(productId: string, itemType: string) {
    let quantity = this.quantities.get(productId)
    if (!quantity) return;
  
    if (itemType === 'piece' && quantity.piece > 1) {
      quantity.piece--;
      quantity.message = false;
    } else if (itemType === 'crate' && quantity.crate > 1) {
      quantity.crate--;
      quantity.message = false;
    }
    this.quantities.set(productId, quantity);
  }
  

  onAddPieceToCart(product: Product, piecePrice: number): void {
    let currentQuantity = this.quantities.get(product.productId) || { piece: 1, crate: 1, message: false };
    this.cartService.addToCart({
      categoryName: product.categoryName,
      title: product.title,
      price: piecePrice,
      quantity: currentQuantity.piece,
      imageUrl: product.imageUrls[0].file,
      productId: product.productId,
      categoryId: product.categoryId,
      description: product.description,
      sessionId : product.sessionId,
      kilo :1,
      cartId: "cdc1a936-c8fb-4a25-9a95-304794763b1f"
    });
    this.quantities.set(product.productId, { 
      ...currentQuantity,
      piece: currentQuantity.piece,
      message: currentQuantity.piece >= product.piece
    });
    clearTimeout(this.checkoutTimeout);
    this.checkoutTimeout = setTimeout(() => {
      this.cartService.triggerCheckout(); // Automatically trigger checkout after 15 minutes
    }, 900000); // 15 minutes in milliseconds
}

onAddCrateToCart(product: Product, cratePrice: number): void {
  let currentQuantity = this.quantities.get(product.productId) || { piece: 1, crate: 1, message: false };
  const tottalcrateQuantity =  currentQuantity.crate * product.crate
    this.cartService.addToCart({
      categoryName: product.categoryName,
      title: product.title,
      price: cratePrice,
      quantity: tottalcrateQuantity, 
      imageUrl: product.imageUrls[0].file,
      productId: product.productId,
      categoryId: product.categoryId,
      description: product.description,
      sessionId : product.sessionId,
      kilo :product.crate,
      cartId: "cdc1a936-c8fb-4a25-9a95-304794763b1f"
    });
    this.quantities.set(product.productId, { 
      ...currentQuantity,
      crate: currentQuantity.crate, 
      message: currentQuantity.crate >= product.piece 
    });
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
