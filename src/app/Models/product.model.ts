export interface Cart {
      items: Array<Product>;
    }
 export interface Product {
   productId: string;
   categoryId: string;
   title: string;
  piecePrice: number;
     cratePrice: number;
    crate: number;
     piece: number;
    categoryName: string;
    description: string;
    imageUrls: ImageUpdateModel[];
     quantity: number;
     sessionId : string;
     isPopular: boolean;
     

  }

  export interface CartI {
    items: Array<ProductAddCart>;
  }
  
  export interface ProductAddCart {
    productId: string;
    cartId : string;
    categoryId: string;
     title: string;
      price: number;
      kilo: number;
     categoryName: string;
     description: string;
     imageUrl: string;
      quantity: number;
      sessionId : string;
 
   }

   export interface ProductAddCartt {
    productId: string;
     title: string;
      price: number;
      kilo: number;
     categoryName: string;
     description: string;
     imageUrl: string;
      quantity: number;
      sessionId : string;
 
   }

   export interface ImageUpdateModel {
    index: number;
    file: string;
  }
  
