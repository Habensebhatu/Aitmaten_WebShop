export interface Cart {
      items: Array<Product>;
    }
 export interface Product {
    productId: string;
    categoryId: string;
    title: string;
    piecePrice: number;
    kilo?: number;
    instokeOfPiece: number;
    cratePrice: number;
    crateQuantity: number;
    instokeOfCrate: number;
    categoryName: string;
    description: string;
    imageUrls: ImageUpdateModel[];
     quantity: number;
     sessionId : string;
     isPopular: boolean;
     

  }

  // public productId: string;
  //     public categoryId: string;
  //     public title: string;
  //     public piecePrice: number;
  //     public kilo?: number
  //     public instokeOfPiece: number;
  //     public cratePrice: number;
  //     public crateQuantity: number;
  //     public InstokeOfCrate: number;
  //     public categoryName: string;
  //     public description: string;
  //     public isPopular: boolean;
  //     public imageUrls: ImageUpdateModel[];


  //     constructor(data: any) {
  //       this.productId = uuidv4();
  //       this.categoryId = data.categoryId
  //       this.title = data.title;
  //       this.piecePrice = data.piecePrice;
  //       this.instokeOfPiece = data.instokeOfPiece
  //       this.kilo = data.kilo
  //       this.cratePrice = data.cratePrice;
  //       this.crateQuantity = data.crateQuantity;
  //       this.InstokeOfCrate = data.InstokeOfCrate;
  //       this.categoryName = data.categoryName;
  //       this.description = data.description;
  //       this.imageUrls = data.imageUrls;
  //       this.isPopular = data.isPopular;

  export interface CartI {
    items: Array<ProductAddCart>;
  }
  
  export interface ProductAddCart {
    productId: string;
    cartId : string;
    categoryId: string;
     title: string;
      price: number;
      kilo?: number;
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
  
