import { Component, ViewEncapsulation  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/Models/product.model';
import { CartService } from 'src/app/service/cart.service';
import { StoreService } from 'src/app/service/store.service';
import { WishlistService } from 'src/app/service/wishlist.service';
import { ChangeDetectorRef } from '@angular/core';
import { Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-datail-product',
  templateUrl:'./datail-product.component.html',
  encapsulation: ViewEncapsulation.None 
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
  private checkoutTimeout: any;
  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private cartService: CartService,
    private wishlistService: WishlistService,  private _snackBar: MatSnackBar,private router: Router,
    private metaService: Meta
  ) {}
  
  ngOnInit() {

    this.metaService.addTag({ rel: 'canonical', href: 'https://sofanimarket.com/' });
    //
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

  //   onRemoveQuantity(){
  //   if(this.Quetity > 1){
  //      this.Quetity--;
  //   }
  //   else(
  //     this.Quetity
  //   )
  // }

  // onAddQuantity(){
  //  this.Quetity++;
  // }
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
      this.cartService.addToCartFromProductDetail({
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
      this.router.navigate(['/cart']);
      this.cartService.show();
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
  
      clearTimeout(this.checkoutTimeout);
      this.checkoutTimeout = setTimeout(() => {
        this.cartService.triggerCheckout(); // Automatically trigger checkout after 15 minutes
      }, 900000); // 15 minutes in milliseconds
  }

  onAddToCart(): void {
    if(this.product){
      this.cartService.addToCartFromProductDetail({
        categoryName: this.product.categoryName,
        title: this.product.title,
        price: this.product.piecePrice,
        quantity: this.Quetity,
        kilo :2,
        imageUrl: this.product.imageUrls[0].file,
        productId: this.product.productId,
        categoryId: this.product.categoryId,
        description: this.product.description,
        sessionId: this.product.sessionId,
        cartId: "cdc1a936-c8fb-4a25-9a95-304794763b1f"

      });
    }
    this.router.navigate(['/cart']);
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
    }
  }

  changeProductDetails(product: Product) {
    this.product = product;
    this.selectedImage = product.imageUrls[0].file;
    this.getProductBYCategory();
    this.router.navigate(['/product-detail', product.productId]).then(() => {
      window.scrollTo(0, 0);
    });
    
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.unsubscribe();
    }
  }
  
}
