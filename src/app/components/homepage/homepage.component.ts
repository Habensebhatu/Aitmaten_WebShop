import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Meta } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Observable, Subject, of, takeUntil } from "rxjs";
import { Product } from "src/app/Models/product.model";
import { StoreService } from "src/app/service/store.service";
import { WishlistService } from "src/app/service/wishlist.service";
import Swiper from "swiper";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.css"],
})
export class HomepageComponent {
  constructor(
    private storeService: StoreService,
    private wishlistService: WishlistService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute, 
    private router: Router,
    private metaTagService: Meta
  ) {}
  cols: Observable<number> = of(4);
  private unsubscribe$ = new Subject<void>();
  trendingProducts: Product[] | undefined;
  wishlistProductIds: string[] = [];
  slides = [
    {
      image: "../assets/image/bgwebshop.png",
      //  image: "../assets/image/store2image.jpeg"
    },
    {
      // image: "../assets/image/bgwebshop.png",
       image: "../assets/image/storeimage.jpeg",
       animationClass: "",
       promoTitle: "",
       promoText: "",
       mainTitle: "",
       mainSubtitle: "",
       subtitle:
         "",
       buttonUrl: "",
    },
    // {
    //   // image: "../assets/image/bgslide.jpg",
    //   // image: "../assets/image/sofanishop.jpeg",
     
    // },
  ];

  loading = true;

  ngOnInit() {
    this.metaTagService.addTag({ rel: 'canonical', href: 'https://sofanimarket.com/' });
    this.metaTagService.addTags([
      { name: 'keywords', content: 'Sofani Market - De toonaangevende Eritrese en Ethiopische levensmiddelenwinkel in Arnhem. Ontdek een breed assortiment van Habesha producten.' },
      { name: 'description', content: 'Sofani Market, Habesha Winkel, Eritrese winkel, Ethiopische winkel, levensmiddelen, Arnhem' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Sofani Market - Uw Eritrese Winkel in Arnhem' },
      { property: 'og:title', content: 'Habesha Winkel' },
      { property: 'og:title', content: 'Eritrese winkel' },
      { property: 'og:title', content: 'https://sofanimarket.com' },
      { property: 'og:description', content: 'Ontdek Sofani Market in Arnhem voor authentieke Eritrese en Ethiopische levensmiddelen en producten.' },
      { property: 'og:image', content: 'link_naar_een_afbeelding_van_uw_winkel' },
      { property: 'og:url', content: 'https://sofanimarket.com' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]);
    
    this.getProducts();
    this.fetchWishlistProductIds();

    setTimeout(() => {
      this.loading = false; // Set to false when loading is complete
    }, 1000);
  }
  getProducts(): void {
    this.storeService
      .GetPopularProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Product[]) => {
        this.trendingProducts = data;
      });
  }
  fetchWishlistProductIds(): void {
    this.wishlistService
      .getWishlistProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((products) => {
        this.wishlistProductIds = products.map((product) => product.productId);
      });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistProductIds.includes(productId);
  }

  onAddToWishlist(productId: string): void {
    if (!this.isInWishlist(productId)) {
      this.wishlistService.addToWishlist(productId);
      this.wishlistProductIds.push(productId);
    } else {
      this._snackBar.open("Product is already in the wishlist.", "Ok", {
        duration: 3000,
      });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const primarySwiper = new Swiper("#primary_slider", {
        slidesPerView: 1,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: ".swiper-arrow.next",
          prevEl: ".swiper-arrow.prev",
        },

        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });

      const categoriesSwiper = new Swiper("#categories_slider", {
        spaceBetween: 20,
        speed: 400,
        navigation: {
          nextEl: ".swiper-arrow.next",
          prevEl: ".swiper-arrow.prev",
        },

        breakpoints: {
          992: {
            slidesPerView: 4,
          },

          767: {
            slidesPerView: 3,
          },

          450: {
            slidesPerView: 2,
          },

          300: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
        },
      });
      const trendingProducts = new Swiper("#trendingProducts_slider", {
        slidesPerView: 4, 
        spaceBetween: 20,
        speed: 2000,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },

        

        breakpoints: {
          992: {
            slidesPerView: 4,
          },

          767: {
            slidesPerView: 3,
          },

          450: {
            slidesPerView: 2,
          },

          300: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
        },
      });
    }, 500);
  }

  products = [

    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/groente.jpeg",
        },
      ],
      title: "Verkoop uw groente direct uit onze voorraad",
      categoryName: "Groente",
      productId: "jhjjjk",
      categoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
      piecePrice: 2,
       cratePrice: 3,
       crate: 33,
       piece: 3
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Fruit.jpeg",
        },
      ],
      title: "Verkoop uw fruit direct uit onze voorraad",
      categoryName: "Fruit",
      productId: "jhjjjk",
      categoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
      piecePrice: 2,
       cratePrice: 3,
       crate: 33,
       piece: 3
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/CHAMPIGNONS.jpeg",
        },
      ],
      title: "Verkoop uw champignons direct uit onze voorraad",
      categoryName: "CHAMPIGNONS",
      productId: "jhjjjk",
      categoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
      piecePrice: 2,
       cratePrice: 3,
       crate: 33,
       piece: 3
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/knoflook.jpeg",
        },
      ],
      title: "",
      categoryName: "Knoflook",
      productId: "jhjjjk",
      categoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
      piecePrice: 2,
      cratePrice: 3,
      crate: 33,
      piece: 3
    },
   
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Bellamegogo1.jpeg",
        },
      ],
      title: "Bella Megogo (ዓብይ መጎጎ)",
      categoryName: "keuken",
      productId: "jhjjjk",
      categoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
      piecePrice: 2,
      cratePrice: 3,
      crate: 33,
      piece: 3
    },
   
    
  ];

 
}
// this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     const fragment = this.route.snapshot.fragment;
    //     if (fragment) {
    //       const element = document.querySelector('#' + fragment);
    //       if (element) element.scrollIntoView();
    //     }
    //   }
    // });