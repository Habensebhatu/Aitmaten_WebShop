import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/Models/product.model';
import { CartService } from 'src/app/service/cart.service';
import { StoreService } from 'src/app/service/store.service';
import { WishlistService } from 'src/app/service/wishlist.service';

@Component({
  selector: 'app-datail-product',
  templateUrl:'./datail-product.component.html' 
})
export class DatailProductComponent {
  productId: string | undefined;
  product: Product | undefined; // Assume Product is a model with properties: title, price, description, images etc.
  relatedProducts: Product[] = []; // A list of related products.
  selectedImage: string | undefined; // The currently selected image.
  private unsubscribe$ = new Subject<void>();
  Quetity = 1;
  categoryName: string| undefined;
  wishlistProductIds: string[] = [];
  hovered = false;
  currentPage: number = 1;
  pageSize: number = 10;
  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private cartService: CartService,
    private wishlistService: WishlistService,  private _snackBar: MatSnackBar
  ) {}
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['productId']) {
        this.productId =  params['productId']
        this.getProduct();
      }
    });
  this.fetchWishlistProductIds();
  }
  
  getProduct() {
    this.storeService.getProductsById(this.productId!).pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Product) => {
        this.product = data
        console.log('data.imageUrls', data)
        this.selectedImage = data.imageUrls[0].file;
        this.getProductBYCategory();
        window.scrollTo(0, 0); 
      });
  }
  
  getProductBYCategory() {
    console.log('this.product?.categoryName!',this.product?.categoryName!)
    if (this.product?.categoryName) {
      this.storeService.getProductBYCategory(this.product.categoryName, this.currentPage, this.pageSize).pipe(takeUntil(this.unsubscribe$))
        .subscribe((data: Product[]) => {
          this.relatedProducts = data;
          console.log('this.relatedProducts', this.relatedProducts);
        });
    }
  }
  
  displayedRelatedProducts: string[] = [];
currentIndex = 0;

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

  onAddToCart(): void {
    if(this.product){
      this.cartService.addToCartFromProductDetail({
        categoryName: this.product.categoryName,
        title: this.product.title,
        price: this.product.price,
        quantity: this.Quetity,
        imageUrl: this.product.imageUrls[0].file,
        productId: this.product.productId,
        categoryId: this.product.categoryId,
        description: this.product.description,
        sessionId: this.product.sessionId

      });
    }
    this.cartService.show();
  }

  fetchWishlistProductIds(): void {
    this.wishlistService.getWishlistProducts().pipe(takeUntil(this.unsubscribe$))
        .subscribe(products => {
            this.wishlistProductIds = products.map(product => product.productId);
        });
  }
  
  
  isInWishlist(): boolean {
    return this.wishlistProductIds.includes(this.productId!);
  }
  
  onAddToWishlist() : void {
    if (!this.isInWishlist()) {
      this.wishlistService.addToWishlist(this.productId!);
      this.wishlistProductIds.push(this.productId!); // Optionally update local list
    } else {
      this._snackBar.open('Product is already in the wishlist.', 'Ok', {duration: 3000,});
      console.log('Product is already in the wishlist.');
      // You can also provide user feedback like a toast message here if required
    }
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.unsubscribe();
    }
  }
  
}
