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
  constructor( private router: Router, private cartService: CartService, private wishlistService: WishlistService, private _snackBar: MatSnackBar){

  }
  navigateToProductDetails(productId: string): void {
    this.router.navigate(['product', productId]);
  }


   
  quantities = new Map<string, { piece: number, crate: number, message: boolean }>();

onAddQuantity(productId: string, itemType: string, instock: number) {
  let quantity = this.quantities.get(productId) || { piece: 1, crate: 1, message: false };
  if (itemType === 'piece' && quantity.piece < instock) {
    quantity.piece++;
    quantity.message = false; 
  } else if (itemType === 'crate' && quantity.crate < instock) {
    quantity.crate++;
    quantity.message = false;
  } else {
    // Only show the message for the specific product
    quantity.message = true;
  }
  this.quantities.set(productId, quantity);
}

  
  onRemoveQuantity(productId: string, itemType: string) {
    let quantity = this.quantities.get(productId);
    if (!quantity) return;
  
    if (itemType === 'piece' && quantity.piece > 1) {
      quantity.piece--;
    } else if (itemType === 'crate' && quantity.crate > 1) {
      quantity.crate--;
    }
    this.quantities.set(productId, quantity);
  }
  

  onAddPieceToCart(product: Product, piecePrice: number): void {
    console.log(' piecePrice',  piecePrice)
    let currentQuantity = this.quantities.get(product.productId) || { piece: 1, crate: 1, message: false };
    console.log('currentQuantity', currentQuantity)
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
      piece: currentQuantity.piece, // Increment the piece quantity.
      message: currentQuantity.piece >= product.piece // Set the message flag based on the stock.
    });
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
      crate: currentQuantity.crate, // Increment the piece quantity.
      message: currentQuantity.crate >= product.piece // Set the message flag based on the stock.
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
