import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../layouts/client-layout/shared/models/Product';
import { ApiResponse, Ville } from './ClientsService';

export interface DepotProduct {
  id: number;
  description : string;
  quantity : number,
  product: Product;
}


export interface Depot {
  id: number;
  label: string;
  ref: string;
  depotProducts: DepotProduct[];
  ville: Ville;
}




@Injectable({ providedIn: 'root' })
export class DepotsService {
  private apiUrl = 'http://localhost:8081/depots';

  constructor(private http: HttpClient) {}

  getAllDepots(): Observable<Depot[]> {
    console.log("all prods : " , this.apiUrl);

    return this.http.get<ApiResponse<Depot[]>>(this.apiUrl).pipe(
      map(response => {
        console.log("dataa  : ", response.data);
        return response.data;
      }) // On extrait "data" de ton ApiResponse
    );
  }

  getDepotsById(depotsId: number): Observable<any[]> {
    console.log(`getDepotsById : ${this.apiUrl}/getDepotsById/${depotsId}`);

    return this.http.get<any[]>(`${this.apiUrl}/getDepotsById/${depotsId}`);
  }

  deleteDepot(depotId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${depotId}`);
  }


}
