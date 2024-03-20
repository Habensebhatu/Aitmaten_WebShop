import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Product } from "../Models/product.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class WishlistService {
  private apiUrlAdd = "https://localhost:7087/api/Wishlist/AddToWishList";
  private apiUrlGet = "https://localhost:7087/api/Wishlist/GetWishlistProducts";
  private apiUrlDelete = "https://localhost:7087/api/Wishlist/DeleteFromWishlist";
  private wishlistCount = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCount.asObservable();

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar) {}

  addToWishlist(productId: string): void {
    let headers = this.getHeadersWithToken();
    this.httpClient.post(this.apiUrlAdd, { productId }, { headers }).subscribe(
      response => {
        this.incrementWishlistCount();
        this._snackBar.open('1 item added to wishlist.', 'Ok', {duration: 3000});
      }
    );
  }

  getWishlistProducts(): Observable<Product[]> {
    let headers = this.getHeadersWithToken();
    return this.httpClient.get<Product[]>(this.apiUrlGet, { headers });
  }

  deleteFromWishlist(productId: string): Observable<any>  {
    let headers = this.getHeadersWithToken();
    return this.httpClient.delete(`${this.apiUrlDelete}/${productId}`, { headers }).pipe(
      tap(() => {
        this.decrementWishlistCount();
      })
    );
  }


  private incrementWishlistCount(): void {
    this.wishlistCount.next(this.wishlistCount.value + 1);
  }

  private decrementWishlistCount(): void {
    this.wishlistCount.next(this.wishlistCount.value - 1);
  }

  setWishlistCount(count: number): void {
    this.wishlistCount.next(count);
  }

  private getHeadersWithToken(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("token");
    if (token) {
      headers = headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
}
