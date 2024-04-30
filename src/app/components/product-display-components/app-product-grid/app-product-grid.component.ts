import { Component, Input, SimpleChanges  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, of, switchMap, takeUntil } from 'rxjs';
import { Product } from 'src/app/Models/product.model';
import { CartService } from 'src/app/service/cart.service';
import { UserRegistrationService } from 'src/app/service/user-registration.service';


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
  public availableProducts: Product[] = [];
  currentUserApproved: boolean = false;
  quantitiesCrate = new Map<string, { crate: number, message: boolean }>();
   quantitiesPiece = new Map<string, { piece: number, message: boolean }>(); 
  constructor( private router: Router, private cartService: CartService, private _snackBar: MatSnackBar, private userService: UserRegistrationService){

  }
  navigateToProductDetails(productId: string): void {
    this.router.navigate(['product', productId]);
  }

  
  ngOnInit() {
    this.loadCurrentUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      this.filterAvailableProducts();
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
        console.log("userData", userData)
        this.currentUserApproved = userData.isApproved;
        console.log("this.currentUserApproved", this.currentUserApproved)
      },
      error: (error) => {
        console.error('Error fetching user details.', error);
      }
    });
  }

  filterAvailableProducts(): void {
    if (this.products) {
      this.availableProducts = this.products.filter(product => product.instokeOfCrate > 0 || product.instokeOfPiece > 0);
      console.log("Filtered products: ",  this.availableProducts);
    }
  }
   
  // quantities = new Map<string, { piece: number, crate: number, message: boolean }>();


onAddQuantityCrate(productId: string, instock: number, contents: number) {
  let quantityCrate = this.quantitiesCrate.get(productId) || {  crate: 0, message: false };
  console.log("quantity7777777777",   quantityCrate.crate)
  const totalAdded = quantityCrate.crate * contents;
    if ((totalAdded + contents) <= instock) {
      quantityCrate.crate++;
      console.log("quantityCrate.crate",   quantityCrate.crate)
      quantityCrate.message = false;
    } else {
      quantityCrate.message = true; 
    }
 
    this.quantitiesCrate.set(productId, quantityCrate);
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

onRemoveQuantityCrate(productId: string) {
  let quantity = this.quantitiesCrate.get(productId)
  if (!quantity) return;

  if (quantity.crate > 1) {
    quantity.crate--;
    quantity.message = false;
  }
  this.quantitiesCrate.set(productId, quantity);
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


  isInWishlist(productId: string): boolean {
    return this.wishlistProductIds.includes(productId);
  }
  

}



// onAddPieceToCart(product: Product, piecePrice: number): void {
//   let currentQuantity = this.quantities.get(product.productId) || { piece: 1, crate: 1, message: false };
//   this.cartService.addToCart({
//     categoryName: product.categoryName,
//     title: product.title,
//     price: piecePrice,
//     quantity: currentQuantity.piece,
//     imageUrl: product.imageUrls[0].file,
//     productId: product.productId,
//     categoryId: product.categoryId,
//     description: product.description,
//     sessionId : product.sessionId,
//     kilo :1,
//     cartId: "cdc1a936-c8fb-4a25-9a95-304794763b1f"
//   });
//   this.quantities.set(product.productId, { 
//     ...currentQuantity,
//     piece: currentQuantity.piece,
//     message: currentQuantity.piece >= product.instokeOfPiece
//   });
//   clearTimeout(this.checkoutTimeout);
//   this.checkoutTimeout = setTimeout(() => {
//     this.cartService.triggerCheckout(); // Automatically trigger checkout after 15 minutes
//   }, 900000); // 15 minutes in milliseconds
// }
// onAddQuantity(productId: string, itemType: string, instock: number, contents: number) {
//   let quantity = this.quantities.get(productId) || { piece: 0, crate: 1, message: false };
//   if(itemType === 'piece' && quantity.crate < 2){
//     contents = 0
//   }
//   const totalAdded = (quantity.piece * 1) + (quantity.crate * contents);
//   if (itemType === 'piece') {
//     if ((totalAdded + 1) <= instock) {
//       quantity.piece++;
//       quantity.message = false;
//     } else {
//       quantity.message = true; 
//     }
//   } else if (itemType === 'crate') {
//     if ((totalAdded + contents) <= instock) {
//       quantity.crate++;
//       quantity.message = false;
//     } else {
//       quantity.message = true; 
//     }
//   }
//   this.quantities.set(productId, quantity);
// }


 // onRemoveQuantity(productId: string, itemType: string) {
  //   let quantity = this.quantities.get(productId)
  //   if (!quantity) return;
  
  //   if (itemType === 'piece' && quantity.piece > 1) {
  //     quantity.piece--;
  //     quantity.message = false;
  //   } else if (itemType === 'crate' && quantity.crate > 1) {
  //     quantity.crate--;
  //     quantity.message = false;
  //   }
  //   this.quantities.set(productId, quantity);
  // }