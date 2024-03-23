import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Meta } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { Product, ProductAddCart } from "src/app/Models/product.model";
import { CartService } from "src/app/service/cart.service";
import { WishlistService } from "src/app/service/wishlist.service";

@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.css"],
})
export class WishlistComponent {
  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private metaService: Meta
  ) {}
  private unsubscribe$ = new Subject<void>();
  wishlistProducts: Product[] | undefined;

  ngOnInit() {
    this.metaService.addTag({ rel: 'canonical', href: 'https://sofanimarket.com/' });
    this.getWishlistProducts();
  }

  getWishlistProducts() {
    this.wishlistService
      .getWishlistProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Product[]) => {
        this.wishlistProducts = data;
        console.log("this.wishlistProducts", data);
      });
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      categoryName: product.categoryName,
      title: product.title,
      price: product.piecePrice,
      quantity: 1,
      imageUrl: product.imageUrls[0].file,
      productId: product.productId,
      categoryId: product.categoryId,
      description: product.description,
      sessionId: product.sessionId,
      kilo : 1,
      cartId: "cdc1a936-c8fb-4a25-9a95-304794763b1f"
    });
  }

  // In wishlist.component.ts
  onDeleteFromWishlist(productId: string): void {
    this.wishlistService.deleteFromWishlist(productId).subscribe(
      (success) => {
        this._snackBar.open("Item removed from wishList.", "Ok", {
          duration: 3000,
        });
        this.getWishlistProducts();
      },
      (error) => {
        // Handle error (maybe show a snackbar or message to user)
      }
    );
  }

  navigateToProductDetails(productId: string): void {
    this.router.navigate(["product", productId]);
  }

 
}
