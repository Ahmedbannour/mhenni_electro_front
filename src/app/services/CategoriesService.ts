import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Categorie } from '../layouts/client-layout/shared/models/Categorie';
import { Product } from '../layouts/client-layout/shared/models/Product';
import { ApiResponse } from './ClientsService';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private apiUrl = 'http://localhost:8081/categories';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<any> {

    return this.http.get<any>(this.apiUrl);
  }


  saveCategory(categoryData: any): Observable<ApiResponse<Categorie>> {
    return this.http.post<any>(`${this.apiUrl}`, categoryData);
  }



  deleteCategory(categoryId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${categoryId}`);
  }
}
