export interface OrderDetail {
    productId: string;
    quantity: number;
    amountTotal: number;
     contents : number;
     price : number;
  }
  
  export interface OrderModel {
    UserId?: string;
    orderDetails: OrderDetail[];
  }
  