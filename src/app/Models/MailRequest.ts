export class MailRequestModel {
   public recipientName: string;
   public Email: string;
   public city: string;
   public adres: string;
   public postalCode: string;
   public OrderDate: Date;
   public OrderNummer: number;
   public OrderItems: OrderItemModel[];
    
    constructor(data: any) {
     this.recipientName = data.recipientName,
     this.Email = data.Email,
     this.city = data.city,
     this.adres = data.adres,
     this.postalCode = data.postalCode,
     this.OrderDate = data.OrderDate,
     this.OrderNummer = data.OrderNummer,
     this.OrderItems = data.OrderItems

    }
  }
  
  export class OrderItemModel {
   public ProductName: string;
   public Quantity: number;
   public Price: number;
   public Total: number;
   public ImageUrl: string;

   constructor(data : any){
    this.ProductName = data.ProductName,
    this.Quantity = data.Quantity,
    this.Price = data.price,
    this.Total = data.Total,
    this.ImageUrl = data.ImageUrl

   }
  }
  