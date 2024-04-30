import { Component, Input, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { Subject, takeUntil } from "rxjs";
import { Category } from "src/app/Models/category.Model";
import { CartI, Product } from "src/app/Models/product.model";
import { CartService } from "src/app/service/cart.service";
import { StoreService } from "src/app/service/store.service";
import { Router, NavigationEnd } from "@angular/router";
import { UserRegistrationService } from "src/app/service/user-registration.service";


@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  private _cart: CartI = { items: [] };
  itemsQuantity = 0;
  wishlistQuantity = 0;
  categories: Category[] | undefined;
  searchResults: Product[] = [];
  @ViewChild("cartTrigger") cartMenuTrigger!: MatMenuTrigger;
  @ViewChild("searchMenuTrigger")
  searchMenuTrigger!: MatMenuTrigger;
  languageMenu = false;
  isMenuOpen = false;
  @Input()
  get cart(): CartI {
    return this._cart;
  }
  
  log = "logo.png";
  Nederland = "Nederlands-flag.png";
  Eritrea = "Eritrea-flag.png";
  private unsubscribe$ = new Subject<void>();
  constructor(
    private cartService: CartService,
    private storeService: StoreService,
    private router: Router,
    public userService: UserRegistrationService,
    
  ) {}

  ngOnInit(): void {
  
    this.fetchWishlistProductIds();
    this.cartService.showMenu$.subscribe(() => {
      this.openCartMenu();
    });
    this.getCatogories();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.clearInput();
      }
    });
  }

  
  closeMenu(): void {
    this.isMenuOpen = false;
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  handleCategorySelect(categoryName: string): void {
    this.categoriesChange(categoryName);
    this.closeMenu();
  }

  fetchWishlistProductIds(): void {
    // this.wishlistService
    //   .getWishlistProducts()
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((products) => {
    //     this.wishlistService.setWishlistCount(products.length);
    //   });
  }
  clearInput() {
    const inputElement = document.querySelector(
      ".search-input"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  }
  openCartMenu(): void {
    this.cartMenuTrigger?.openMenu();
  }

  searchProducts(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value;

    if (query.trim() === "") {
      this.searchResults = [];
      return;
    }
    this.storeService
      .searchProducts(query)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((products: Product[]) => {
        this.searchResults = products;
        if (products.length > 0) {
          this.searchMenuTrigger.openMenu();
        } else {
          this.searchMenuTrigger.openMenu(); 
        }
      });
  }

  getCatogories() {
    this.storeService
      .getCatogories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Category[]) => {
        this.categories = data;
       
      });
  }
  language() {
    this.languageMenu = true;
  }

  onCategorySelect(category: string): void {
    console.log("You selected: ", category);
  }

  set cart(cart: CartI) {
    console.log("cart.items", cart.items)
    this.itemsQuantity = cart.items
      .map((item) => item.quantity / (item.kilo! > 1 ? item.kilo! : 1))
      .reduce((prev, curent) => prev + curent, 0);

      console.log("this.itemsQuantity", this.itemsQuantity)

  }

  categoriesChange(category: string) {
    this.storeService.changeShowData(category);
  }
 
}
