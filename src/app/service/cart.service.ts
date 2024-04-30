import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Cart, CartI, Product, ProductAddCart } from '../Models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OrderModel } from '../Models/Order';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    // private apiUrl = 'https://localhost:7087/api/Cart';
    // private apiUOrder = 'https://localhost:7087/api/OrderAit';
    private apiUrl = 'https://webshopfilimon.azurewebsites.net/api/Cart';
    private apiUOrder = 'https://webshopfilimon.azurewebsites.net/api/OrderAit';
    cart = new BehaviorSubject<CartI>({ items: [] });
    private _showMenu = new Subject<void>();
    showMenu$ = this._showMenu.asObservable();
     sessionId: string ;
     private checkoutTrigger = new Subject<void>();
     checkoutTriggered$ = this.checkoutTrigger.asObservable();
     connectionStringName = 'Aitmaten';

    constructor(private _snackBar: MatSnackBar, private httpClient: HttpClient, ) {
        this.sessionId = this.getSessionId();
        this.loadCartFromServer();
    }

      triggerCheckout() {
        this.checkoutTrigger.next();
      }

  private getSessionId(): string {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  private generateSessionId(): string {
    // Generate a simple random session ID, you can refine this further
    return Math.random().toString(36).substr(2, 9);
  }

    show(): void {
        this._showMenu.next();
    }

    loadCartFromServer() {
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
            
        }
        const params = new HttpParams().set('connectionString', this.connectionStringName);
        this.httpClient.get<ProductAddCart[]>(`${this.apiUrl}/GetCartItems?sessionId=${this.sessionId}`, { headers, params: params }).subscribe(items => {
            const updatedcart = { items: items };
            this.cart.next(updatedcart);
        });
    }
    

    addToCart(item: ProductAddCart): void {
        item.sessionId = this.sessionId;
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`)
        }
        console.log("item.questitity", item)
        const params = new HttpParams().set('connectionString', this.connectionStringName);
        this.httpClient.post<ProductAddCart>(`${this.apiUrl}/AddCartItem`, item, { headers, params: params }).subscribe(
            response => {
          
                const items = [...this.cart.value.items];
                const itemInCart = items.find((_item) => _item.productId === item.productId && _item.price == item.price);
                if (itemInCart) {
                    itemInCart.quantity += item.quantity;
                } else {
                    items.push(item);
                }
                this.loadCartFromServer();
                this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 });
            },
            error => {
                console.error('Error adding product to cart', error);
            }
        );
    }    

    addToCartFromProductDetail(item: ProductAddCart): void {
        item.sessionId = this.sessionId;
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        const params = new HttpParams().set('connectionString', this.connectionStringName);
        this.httpClient.post<ProductAddCart>(`${this.apiUrl}/AddCartItem`, item, { headers, params: params }).subscribe(
            response => {
                const items = [...this.cart.value.items];
                const itemInCart = items.find((_item) => _item.productId === item.productId && _item.price == item.price);
                if (itemInCart) {
                    itemInCart.quantity += item.quantity;
                } else {
                    items.push(item);
                }
               
                this.loadCartFromServer();
                this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 });
            },
            error => {
                console.error('Error adding product to cart', error);
            }
        );
    }

    getTotal(items: ProductAddCart[]): number {
        return items.map((item) =>
            item.price * item.quantity).reduce((prev, current) => prev + current, 0)

    }

    clearCart(): void {
        console.log("testestese");
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        const params = new HttpParams().set('connectionString', this.connectionStringName);
        this.httpClient.delete<any>(`${this.apiUrl}/ClearAllCartItems?sessionId=${this.sessionId}`, { headers, params: params }).subscribe(
            response => {
                this.cart.next({ items: [] });
                this._snackBar.open(response.message, 'Ok', {
                    duration: 3000,
                });
            },
            error => {
                console.error('Error clearing the cart', error);
            }
        );
    }

    removeFromCart(item: ProductAddCart, updateCart = true): void {
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
     console.log("item.productId", item.productId)
        const params = new HttpParams().set('connectionString', this.connectionStringName);
        this.httpClient.delete(`${this.apiUrl}/RemoveFromCart/${item.cartId}?sessionId=${this.sessionId}`, { headers, params: params }).subscribe(
            response => {
                const filteredItems = this.cart.value.items.filter(
                    (_item) => _item.cartId !== item.cartId
                );
                if (updateCart) {
                    this.cart.next({ items: filteredItems });
                    this._snackBar.open('1 item removed from cart.', 'Ok', {
                        duration: 3000,
                    });
                }
            },
            error => {
                console.error('Error removing product from cart', error);
            }
        );
    }

    removeQuantity(item: ProductAddCart): void {
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        const params = new HttpParams().set('connectionString', this.connectionStringName);
        this.httpClient.put<ProductAddCart>(
            `${this.apiUrl}/UpdateProductQuantity/${item.productId}?sessionId=${this.sessionId}`,
            item,
            { headers, params }
        ).subscribe(
            updatedCart => {
                const filteredItems = this.cart.value.items.map((_item) => {
                    if (_item.productId === updatedCart.productId) {
                        return updatedCart;
                    }
                    return _item;
                }).filter(_item => _item.quantity > 0);  // filter out items with zero quantity

                this.cart.next({ items: filteredItems });
                this._snackBar.open('1 item quantity reduced.', 'Ok', {
                    duration: 3000,
                });
            },
            error => {
                console.error('Error updating product quantity', error);
            }
        );
    }


    addOrder(order: OrderModel): Observable<OrderModel> {
        console.log("orderorderodwr", order)
        const params = new HttpParams().set('connectionString', this.connectionStringName);
        return this.httpClient.post<OrderModel>(`${this.apiUOrder}/AddOrder`, order, {params});
      }

}
