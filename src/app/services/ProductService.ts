import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from './ClientsService';
import { Product } from '../layouts/client-layout/shared/models/Product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:8081/produits';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ApiResponse<Product[]>> {
    console.log("all prods : " , this.apiUrl);

    return this.http.get<ApiResponse<Product[]>>(this.apiUrl);
  }

  getProductsByCategory(categoryId: number): Observable<ApiResponse<Product[]>> {
    console.log(`getProductsByCategory : ${this.apiUrl}/getProdcutsByCategory/${categoryId}`);

    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/getProdcutsByCategory/${categoryId}`);
  }

  getProductById(productId: number): Observable<any> {
    console.log(`getProductById : ${this.apiUrl}/${productId}`);

    return this.http.get<any>(`${this.apiUrl}/${productId}`);
  }


  saveProduct(productData: any): Observable<ApiResponse<Product>> {
    console.log("Données envoyées au service :", productData);
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}`, productData);
  }
}
