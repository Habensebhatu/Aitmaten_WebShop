import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
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
    private _snackBar: MatSnackBar
  ) {}
  cols: Observable<number> = of(4);
  private unsubscribe$ = new Subject<void>();
  trendingProducts: Product[] | undefined;
  wishlistProductIds: string[] = [];
  slides = [
    {
      image: "../assets/image/bgwebshop.png",
    },
    {
      image: "../assets/image/bgslide.jpg",
      animationClass: "layer-animation-3",
      promoTitle: "limited edition",
      promoText: "Sale Offer 20% Off This Week",
      mainTitle: "Top Popular",
      mainSubtitle: "Accessories 2022",
      subtitle:
        "Light knit upper adapts to the shape of your foot for flexible and natural movement.",
      buttonUrl: "shop-grid.html",
    },
  ];

  ngOnInit() {
    this.getProducts();
    this.fetchWishlistProductIds();
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
        slidesPerView: 4, // Display 4 images at once
        spaceBetween: 20,
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
        slidesPerView: 4, // Display 4 images at once
        spaceBetween: 20,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },

        navigation: {
          nextEl: ".categories-slider-wrapper .swiper-arrow.next",
          prevEl: ".categories-slider-wrapper .swiper-arrow.prev",
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
          file: "../assets/image/Berbere1.jpg",
        },
      ],
      title: "berbere",
      price: 71.05,
      categoryName: "food",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Tafelloper.avif",
        },
      ],
      title: "hairStyle",
      price: 21.05,
      categoryName: "cosmetica",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Koffieserveertafel.avif",
        },
      ],
      title: "Koffieserveertafel",
      price: 200.76,
      categoryName: "cosmetica",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/jurk.avif",
        },
      ],
      title: "jurk",
      price: 61.2,
      categoryName: "Kleding",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Tafelloper.avif",
        },
      ],
      title: "Tafle",
      price: 55.86,
      categoryName: "Cosmetica",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Tafelloper.avif",
        },
      ],
      title: "Tafle",
      price: 55.86,
      categoryName: "Cosmetica",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Tafelloper.avif",
        },
      ],
      title: "Tafle",
      price: 55.86,
      categoryName: "Cosmetica",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
  ];

  trendingProduct = [
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Berbere1.jpg",
        },
      ],
      title: "berbere",
      price: 71.05,
      categoryName: "food",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Koffieserveertafel.avif",
        },
      ],
      title: "Koffieserveertafel",
      price: 200.76,
      categoryName: "cosmetica",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/jurk.avif",
        },
      ],
      title: "jurk",
      price: 61.2,
      categoryName: "Kleding",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Tafelloper.avif",
        },
      ],
      title: "Tafle",
      price: 55.86,
      categoryName: "Cosmetica",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
  ];

  trendingProduct = [
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Berbere1.jpg",
        },
      ],
      title: "berbere",
      price: 71.05,
      categoryName: "food",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Tafelloper.avif",
        },
      ],
      title: "hairStyle",
      price: 21.05,
      categoryName: "cosmetica",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Koffieserveertafel.avif",
        },
      ],
      title: "Koffieserveertafel",
      price: 200.76,
      categoryName: "cosmetica",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/jurk.avif",
        },
      ],
      title: "jurk",
      price: 61.2,
      categoryName: "Kleding",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/Tafelloper.avif",
        },
      ],
      title: "Tafle",
      price: 55.86,
      categoryName: "Cosmetica",
      productId: "jhjjjk",
      CategoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
    },
  ];
}
