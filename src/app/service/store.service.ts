import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable, min, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Product} from "../Models/product.model";
import { Category } from "../Models/category.Model";
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';




@Injectable({
  providedIn: "root",
})
export class StoreService {
  // private readonly apiUrl = 'https://localhost:7087/api/Product';
  // private readonly apiUrlCategory = 'https://localhost:7087/api/Category';
  private readonly apiUrlCategory = 'https://webshopfilimon.azurewebsites.net/api/Category';
  private apiUrl = 'https://webshopfilimon.azurewebsites.net/api/Product';
  getAllProducts = false;
  constructor(private httpClient: HttpClient) { }
  private shouldGetAllProducts = false;
  private showDataSubject = new BehaviorSubject<string>('');
  public showData$ = this.showDataSubject.asObservable();
  connectionStringName = 'Aitmaten';

  changeShowData(value: string): void {
    
    this.showDataSubject.next(value);
  }

  setAllProducts(value: boolean) {
    this.shouldGetAllProducts = value;
  }

  isAllProducts() {
    return this.shouldGetAllProducts;
  }

  getCatogories(): Observable<Category[]> {
    const params = new HttpParams().set('connectionString', this.connectionStringName);
    return this.httpClient.get<Category[]>(`${this.apiUrlCategory}/GetAllCategories`, { params });
  }

  getProductBYCategory(category: string, pageNumber: number, pageSize: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiUrl}/ByCategory/${category}?pageNumber=${pageNumber}&pageSize=${pageSize}&connectionString=${this.connectionStringName}`);
  }


  getProductsByNameAndPrice(params: {
    category: string,
    minPrice: number,
    pageNumber: number,
    pageSize: number,
    maxPrice?: number,
  }): Observable<Product[]> {
    let httpParams = new HttpParams()
      .set('minPrice', params.minPrice.toString())
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString())
      .set('connectionString', this.connectionStringName);
      

    if (params.maxPrice !== undefined) {
      httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    }

    return this.httpClient.get<Product[]>(`${this.apiUrl}/ByCategory/${params.category}/ByPriceRange`, {
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
    const params = new HttpParams().set('connectionString', this.connectionStringName);
    return this.httpClient.get<Product[]>(`${this.apiUrl}/ByPriceRange/${minNumber}/${maxNumber}`,  {params});
  }


  getProducts(): Observable<Product[]> {
    const params = new HttpParams().set('connectionString', this.connectionStringName);
    return this.httpClient.get<Product[]>(`${this.apiUrl}/AllProducts`, {params});
  }

  GetPopularProducts(): Observable<Product[]> {
    const params = new HttpParams().set('connectionString', this.connectionStringName);
    return this.httpClient.get<Product[]>(`${this.apiUrl}/PopularProducts`, {params});
  }

  searchProducts(productName: string): Observable<Product[]> {
    const params = new HttpParams().set('connectionString', this.connectionStringName);
    return this.httpClient.get<Product[]>(`${this.apiUrl}/SearchByName/${productName}`, { params });
  }

  getProductsById(productId: string): Observable<Product> {
    const params = new HttpParams().set('connectionString', this.connectionStringName);
    return this.httpClient.get<Product>(`${this.apiUrl}/ById/${productId}`, { params });
  }



  updateProductStock(productId: string, newStock: number, price: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('connectionString', this.connectionStringName);
    return this.httpClient.post(`${this.apiUrl}/UpdateProductStock`, { productId, newStock, price },{
      params: params,
      headers: headers
    });
  }
  

}
