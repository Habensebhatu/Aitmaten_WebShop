import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/Models/product.model';
import { CartService } from 'src/app/service/cart.service';

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
  constructor( private router: Router, private cartService: CartService,  private _snackBar: MatSnackBar){

  }
  navigateToProductDetails(productId: string): void {
    this.router.navigate(['product', productId]);
  }
  ngOnInit(){
    console.log("this.productslovelovelovelove", this.products)
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
  
  
}
