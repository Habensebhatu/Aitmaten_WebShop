import { Component, ViewEncapsulation  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, of, switchMap, takeUntil } from 'rxjs';
import { Product } from 'src/app/Models/product.model';
import { CartService } from 'src/app/service/cart.service';
import { StoreService } from 'src/app/service/store.service';
import { ChangeDetectorRef } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { UserRegistrationService } from 'src/app/service/user-registration.service';


@Component({
  selector: 'app-datail-product',
  templateUrl:'./datail-product.component.html',
  encapsulation: ViewEncapsulation.None 
})
export class DatailProductComponent {
  productId: string | undefined;
  product: Product | undefined; 
  relatedProducts: Product[] = []; 
  selectedImage: string | undefined; 
  private unsubscribe$ = new Subject<void>();
  Quetity = 1;
  categoryName: string| undefined;
  wishlistProductIds: string[] = [];
  hovered = false;
  currentPage: number = 1;
  pageSize: number = 10;
  quantitiesCrate = new Map<string, { crate: number, message: boolean }>();
  quantitiesPiece = new Map<string, { piece: number, message: boolean }>(); 
  currentUserApproved: boolean = false;
  private checkoutTimeout: any;
  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private cartService: CartService,
   private _snackBar: MatSnackBar,private router: Router,
    private metaService: Meta,
    private userService: UserRegistrationService
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
   this.loadCurrentUser()
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
  loadCurrentUser(): void {
    this.userService.currentUser.pipe(
      switchMap(user => {
        if (!user) {
          return of(null); 
        }
        return this.userService.getUserById(user.nameid);
      })
    ).subscribe({
      next: (userData) => {
        if (!userData) {
          return;
        }
        this.currentUserApproved = userData.isApproved;
      },
      error: (error) => {
        console.error('Error fetching user details.', error);
      }
    });
  }

  
  displayedRelatedProducts: string[] = [];
// currentIndex = 0;

 
  
    onAddQuantityCrate(productId: string, instock: number, contents: number) {
      let quantityCrate = this.quantitiesCrate.get(productId) || {  crate: 0, message: false };
      const totalAdded = quantityCrate.crate * contents;
        if ((totalAdded + contents) <= instock) {
          quantityCrate.crate++;
          quantityCrate.message = false;
        } else {
          quantityCrate.message = true; 
        }
     
        this.quantitiesCrate.set(productId, quantityCrate);
    }

    onRemoveQuantityCrate(productId: string) {
      let quantity = this.quantitiesCrate.get(productId)
      if (!quantity) return;
    
      if (quantity.crate > 1) {
        quantity.crate--;
        quantity.message = false;
      }
      this.quantitiesCrate.set(productId, quantity);
    }

    onAddQuantityPiece(productId: string,  instock: number) {

      let quantity = this.quantitiesPiece.get(productId) || { piece: 0,  message: false };
        if ((quantity.piece + 1) <= instock) {
          quantity.piece++;
          console.log(" quantity.piece",  quantity.piece)
          quantity.message = false;
        } else {
          quantity.message = true; 
        }
      this.quantitiesPiece.set(productId, quantity);
      
    }

    onRemoveQuantityPiece(productId: string) {
      let quantity = this.quantitiesPiece.get(productId)
      if (!quantity) return;
    
      if (quantity.piece > 1) {
        quantity.piece--;
        quantity.message = false;
      } 
      this.quantitiesPiece.set(productId, quantity);
    }
    

    onAddPieceToCart(product: Product, piecePrice: number): void {
      let currentQuantity = this.quantitiesPiece.get(product.productId) || { piece: 1,  message: false };
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
  
      this.quantitiesPiece.set(product.productId, { 
        ...currentQuantity,
        piece: 1,
        message: currentQuantity.piece >= product.instokeOfPiece
      });
      clearTimeout(this.checkoutTimeout);
      this.checkoutTimeout = setTimeout(() => {
        this.cartService.triggerCheckout(); 
      }, 900000); 
  }

  onAddCrateToCart(product: Product, cratePrice: number): void {
    let currentQuantity = this.quantitiesCrate.get(product.productId) || {  crate: 1, message: false };
    const tottalcrateQuantity =  currentQuantity.crate * product.crateQuantity
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
        kilo :product.crateQuantity,
        cartId: "cdc1a936-c8fb-4a25-9a95-304794763b1f"
      });
      this.quantitiesCrate.set(product.productId, { 
        ...currentQuantity,
        crate: 1, 
        // crate: currentQuantity.crate, 
        message: currentQuantity.crate >= product.instokeOfCrate 
      });
  
      clearTimeout(this.checkoutTimeout);
      this.checkoutTimeout = setTimeout(() => {
        this.cartService.triggerCheckout(); 
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

 
  isInWishlist(): boolean {
    return this.wishlistProductIds.includes(this.productId!);
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
