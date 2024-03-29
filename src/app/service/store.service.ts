import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable, min, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Product} from "../Models/product.model";
import { Category } from "../Models/category.Model";
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


const STORE_BASE_URL = "https://fakestoreapi.com";


@Injectable({
  providedIn: "root",
})
export class StoreService {
  private readonly apiUrl = 'https://localhost:7087/api/Product';
  private readonly apiUrlCategory = 'https://localhost:7087/api/Category';
  getAllProducts = false;
  constructor(private httpClient: HttpClient) { }
  private shouldGetAllProducts = false;
  private showDataSubject = new BehaviorSubject<string>('');
  public showData$ = this.showDataSubject.asObservable();

  changeShowData(value: string): void {
    
    this.showDataSubject.next(value);
  }

  setAllProducts(value: boolean) {
    this.shouldGetAllProducts = value;
  }

  isAllProducts() {
    return this.shouldGetAllProducts;
  }


  getAllCategories(): Observable<Array<string>> {
    return this.httpClient.get<Array<string>>(
      `${STORE_BASE_URL}/products/categories`
    );
  }

  getCatogories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.apiUrlCategory);
  }

  getProductBYCategory(category: string, pageNumber: number, pageSize: number): Observable<Product[]> {
    console.log("00000",category, pageNumber, pageSize);
    return this.httpClient.get<Product[]>(`${this.apiUrl}/category/${category}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }


  getProductsByNameAndPrice(params: {
    category: string, 
    minPrice: number, 
    pageNumber: number, 
    pageSize: number, 
    maxPrice?: number
}): Observable<Product[]> {
    let httpParams = new HttpParams()
        .set('minPrice', params.minPrice.toString())
        .set('pageNumber', params.pageNumber.toString())
        .set('pageSize', params.pageSize.toString());

    if(params.maxPrice !== undefined) {
        httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    }

    return this.httpClient.get<Product[]>(`${this.apiUrl}/category/${params.category}/price`, {
        params: httpParams
    }).pipe(
        catchError(error => {
            if (error.status === 404) {
                return of([]);  
            }
            throw error; 
        })
    );
}


  
  
  getProductBYPrice(minNumber: number, maxNumber: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiUrl}/filterPrice/${minNumber}/${maxNumber}`);
}


  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiUrl}`);
  }

  GetPopularProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiUrl}/popular`);
  }

  searchProducts(productName: string): Observable<Product[]> {
    console.log("serviceQuery", productName)
    return this.httpClient.get<Product[]>(`${this.apiUrl}/search/${productName}`);
  }

  getProductsById(productId: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiUrl}/${productId}`);
  }

  // In your product.service.ts or a relevant service file

  updateProductStock(productId: string, newStock: number): Observable<any> {
  console.log("productIdproductId", productId)
  console.log("newStocknewStocknewStock", newStock)
    return this.httpClient.post(`${this.apiUrl}/UpdateProductStock`, { productId, newStock });
  }
  

}
