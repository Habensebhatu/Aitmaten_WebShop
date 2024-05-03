import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Meta } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Observable, Subject, of, takeUntil } from "rxjs";
import { Product } from "src/app/Models/product.model";
import { StoreService } from "src/app/service/store.service";
import Swiper from "swiper";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.css"],
})
export class HomepageComponent {
  constructor(
    private storeService: StoreService,
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
      image: "../assets/image/heroimageAit.png",
      //  image: "../assets/image/store2image.jpeg"
    },
    {
      // image: "../assets/image/bgwebshop.png",
       image: "../assets/image/heroimgesAit.png",
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
          file: "../assets/image/groetenAit.png",
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
      kilo : 4,
      instokeOfPiece: 4,
      cratePrice: 4,
      crateQuantity: 4,
      instokeOfCrate: 4,
     
       
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/fruitsAit.png",
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
      kilo : 4,
      instokeOfPiece: 4,
      cratePrice: 4,
      crateQuantity: 4,
      instokeOfCrate: 4,
     
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/vlees.png",
        },
      ],
      title: "100% HALAL, alles is vers geen toevoegingen",
      categoryName: "Vlees",
      productId: "jhjjjk",
      categoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
      piecePrice: 2,
      kilo : 4,
      instokeOfPiece: 4,
      cratePrice: 4,
      crateQuantity: 4,
      instokeOfCrate: 4,
     
    },

    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/kips.png",
        },
      ],
      title: "100% HALAL, alles is vers geen toevoegingen",
      categoryName: "Kip",
      productId: "jhjjjk",
      categoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
      piecePrice: 2,
      kilo : 4,
      instokeOfPiece: 4,
      cratePrice: 4,
      crateQuantity: 4,
      instokeOfCrate: 4,
     
    },

    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/mushrooms.png",
        },
      ],
      title: "Verkoop uw champignons direct uit onze voorraad",
      categoryName: "chamoignons",
      productId: "jhjjjk",
      categoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
      piecePrice: 2,
      kilo : 4,
      instokeOfPiece: 4,
      cratePrice: 4,
      crateQuantity: 4,
      instokeOfCrate: 4,
     
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/potatoes.png",
        },
      ],
      title: "Verkoop uw aardappelen direct uit onze voorraad",
      categoryName: "Aardappelen",
      productId: "jhjjjk",
      categoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
      piecePrice: 2,
      kilo : 4,
      instokeOfPiece: 4,
      cratePrice: 4,
      crateQuantity: 4,
      instokeOfCrate: 4,
     
    },
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/garlic.png",
        },
      ],
      title: "Verkoop uw Knoflook direct uit onze voorraad",
      categoryName: "Knoflook",
      productId: "jhjjjk",
      categoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
      piecePrice: 2,
      kilo : 4,
      instokeOfPiece: 4,
      cratePrice: 4,
      crateQuantity: 4,
      instokeOfCrate: 4,
     
    },
   
    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/cressAit.png",
        },
      ],
      title: "Verkoop uw cressen direct uit onze voorraad",
      categoryName: "Cressen",
      productId: "jhjjjk",
      categoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
      piecePrice: 2,
      kilo : 4,
      instokeOfPiece: 4,
      cratePrice: 4,
      crateQuantity: 4,
      instokeOfCrate: 4,
     
    },

    {
      imageUrls: [
        {
          index: 0,
          file: "../assets/image/KruidenAit.png",
        },
      ],
      title: "Verkoop uw Kruiden direct uit onze voorraad",
      categoryName: "Kruiden",
      productId: "jhjjjk",
      categoryId: "vvvvvvv",
      description: "hhjdfhjfjhd",
      quantity: 3,
      sessionId: "ddd445556",
      isPopular: true,
      piecePrice: 2,
      kilo : 4,
      instokeOfPiece: 4,
      cratePrice: 4,
      crateQuantity: 4,
      instokeOfCrate: 4,
     
    },
   
   
    
  ];

 
}
