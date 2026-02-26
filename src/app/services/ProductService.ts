import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:8081/produits';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    console.log("all prods : " , this.apiUrl);

    return this.http.get<any[]>(this.apiUrl);
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    console.log(`getProductsByCategory : ${this.apiUrl}/getProdcutsByCategory/${categoryId}`);

    return this.http.get<any[]>(`${this.apiUrl}/getProdcutsByCategory/${categoryId}`);
  }

  getProductById(productId: number): Observable<any> {
    console.log(`getProductById : ${this.apiUrl}/${productId}`);

    return this.http.get<any>(`${this.apiUrl}/${productId}`);
  }
}
