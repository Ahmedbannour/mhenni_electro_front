import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Categorie } from '../layouts/client-layout/shared/models/Categorie';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private apiUrl = 'http://localhost:8081/categories';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<any> {

    return this.http.get<any>(this.apiUrl);
  }
}
