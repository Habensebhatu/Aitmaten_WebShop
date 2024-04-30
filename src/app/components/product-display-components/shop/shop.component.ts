import { Component } from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subject, Subscription, takeUntil } from "rxjs";
import { Category } from "src/app/Models/category.Model";
import { Product } from "src/app/Models/product.model";
import { StoreService } from "src/app/service/store.service";

@Component({
  selector: "app-shop",
  templateUrl: "./shop.component.html",
  styleUrls: ["./shop.component.css"],
})
export class ShopComponent {
  
 
  activeView: "grid" | "list" = "grid";
  products: Product[] | undefined;

  commingProducts: Product[] | undefined;
  count = "12";
  sort = "desc";
  category: string | undefined;
  minNumber: number | undefined;
  maxNumber: number | undefined;
  productsSubscription: Subscription | undefined;
  private unsubscribe$ = new Subject<void>();
  private subs: Subscription = new Subscription();
  categories: Category[] | undefined;
  selectedCategory: string | undefined;
  selectedPrice: string | undefined;
  currentPage: number = 1;
  pageSize: number = 9;
  totalProductsOfCategory: number | undefined;

  Math = Math;
  prices: string[] | undefined;
  translatedPhrase: string | undefined;
  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private metaService: Meta
  ) {
    this.translatedPhrase = '€25,00 & meer';
  }


  ngOnInit() {
    this.metaService.addTag({ rel: 'canonical', href: 'https://sofanimarket.com/' });
    this.updateTranslation();

    // Update translation whenever language changes
    this.translate.onLangChange.subscribe(() => {
      this.updateTranslation();
    });
    // this.setPricesWithTranslation(this.translatedPhrase!);
    this.getProducts();
    this.route.queryParams.subscribe((params) => {
      window.scrollTo(0, 0);
      if (params["category"]) {
        this.selectedCategory = params["category"];
        this.category = this.selectedCategory;
        this.filterByCategory(this.selectedCategory!);
      }
      if (params["price"]) {
        this.selectedPrice = params["price"];
        this.OnfillterProductsBYPrice(this.selectedPrice!);
      }
    });

    this.getCategoryByURL();
    this.getCatogories();
  }

  private updateTranslation() {
    const more = this.translate.instant('more');
    this.translatedPhrase = more ? `€25,00 & ${more}` : '€25,00 & meer';
    this.setPricesWithTranslation(this.translatedPhrase);
  }

  private setPricesWithTranslation(translatedPhrase: string): void {
    this.prices = [
      "0 - €5,00, ",
      "€5,00 - €10,00",
      "€10,00 - €15,00",
      "€15,00 - €20,00",
      "€20,00 - €25,00",
      translatedPhrase,
    ];
  }
  getCategoryByURL() {
    if (this.selectedCategory == null) {
      this.route.params.subscribe((params) => {
        if (params["name"]) {
          this.category = params["name"];
          this.filterByCategory(this.category!);
        }
      });
    }
  }

  getCatogories() {
    this.storeService
      .getCatogories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Category[]) => {
        this.categories = data;
      });
  }

  filterByCategory(category: string) {
    this.storeService
      .getProductBYCategory(category, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Product[]) => {
        if (
          this.minNumber == undefined &&
          this.maxNumber == undefined &&
          this.selectedPrice == null
        ) {
          this.products = data;
          console.log("this.products", this.products);
        }
      });
  }

  OnshowCategoty(newCatagory: string): void {
    this.currentPage = 1;
    this.getProducts();
    this.category = newCatagory;
    this.filterByCategory(this.selectedCategory!);
    this.selectedCategory = newCatagory;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: newCatagory, price: this.selectedPrice },
      queryParamsHandling: "merge",
    });
  }

  getProducts() {
    this.storeService
      .getProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Product[]) => {
        this.commingProducts = data;
        this.getTotalProductsBycategory();
      });
  }

  getTotalProductsBycategory() {
    const filterProductbycategory = this.commingProducts?.filter(
      (p) => p.categoryName == this.category
    );
    if (this.selectedPrice == undefined) {
      this.totalProductsOfCategory = filterProductbycategory!.length;
    }
  }

  get totalPages(): number {
    if (
      this.totalProductsOfCategory === undefined ||
      this.totalProductsOfCategory === 0
    ) {
      return 0;
    }
    return Math.ceil(this.totalProductsOfCategory / this.pageSize);
  }

  OnfillterProductsBYPrice(filltedProduct: string): void {
    if (this.minNumber == undefined || this.maxNumber == undefined) {
      this.currentPage = 1;
    }
    let numbers = filltedProduct.match(/(\d+[\.,\d]*)/g);
    this.selectedPrice = filltedProduct;
    if (numbers && numbers.length >= 2) {
      this.minNumber = parseFloat(numbers[0].replace(",", "."));
      this.maxNumber = parseFloat(numbers[1].replace(",", "."));
    } else if (numbers && numbers.length === 1) {
      this.minNumber = parseFloat(numbers[0].replace(",", "."));
      this.maxNumber = undefined;
    }
    this.getProductsByNameAndPrice();
  }

  togglePriceSelection(price: string): void {
    if (this.selectedPrice == price) {
      console.log("this.selectedPrice");
      this.selectedPrice = undefined;
      this.minNumber = undefined;
      this.maxNumber = undefined;
      console.log("this3333333", this.selectedPrice);
      this.filterByCategory(this.category!);
      this.getProducts();
    } else {
      this.OnfillterProductsBYPrice(price);
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: this.category, price: this.selectedPrice },
      queryParamsHandling: "merge",
    });
  }

  getProductsByNameAndPrice() {
    if (this.minNumber !== undefined || this.maxNumber !== undefined) {
      this.storeService
        .getProductsByNameAndPrice({
          category: this.category!,
          minPrice: this.minNumber!,
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          maxPrice: this.maxNumber,
        })
        .subscribe((data) => {
          this.products = data;
          this.totalProductsOfCategory = data.length;
        });
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: this.category, price: this.selectedPrice },
      queryParamsHandling: "merge",
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo(0, 0);
    }
    if (this.selectedCategory == undefined && this.selectedPrice == undefined) {
      this.filterByCategory(this.category!);
    }
    if (this.selectedCategory && this.selectedPrice == undefined) {
      this.filterByCategory(this.selectedCategory!);
    } else {
      this.getProductsByNameAndPrice();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    window.scrollTo(0, 0);
    if (this.selectedCategory == undefined) {
      this.filterByCategory(this.category!);
    } else {
      this.filterByCategory(this.selectedCategory!);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo(0, 0);
    }

    if (this.selectedCategory == undefined) {
      this.filterByCategory(this.category!);
    } else {
      this.filterByCategory(this.selectedCategory!);
    }
  }

  navigateToProductDetails(productId: string): void {
    this.router.navigate(["product", productId]);
  }

  onItemsCountChange(count: number): void {
    this.count = count.toString();
  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.unsubscribe();
    }
    this.subs.unsubscribe();
  }

  onViewChanged(view: "grid" | "list") {
    this.activeView = view;
  }

  isDivHidden: boolean = true;

  toggleDiv() {
    this.isDivHidden = !this.isDivHidden;
  }

  setTranslatedPhrase() {
    this.translate.onLangChange.subscribe(() => {
      const more = this.translate.instant('more');
      this.translatedPhrase = `€25,00 ${more}`;
    });
  }
}
